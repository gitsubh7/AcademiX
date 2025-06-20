import { Student } from "../models/student.model.js";
import { Coding } from "../models/codings.model.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {apiResponse} from "../utils/apiResponse.js"
import { apiError } from "../utils/apiError.js";
import {uploadToCloudinary} from "../utils/cloudinary.js"
import {Attendance} from "../models/attendance.model.js"
import {isValidNitpEmail} from "../utils/emailAuth.js"
import {generateAccessAndRefreshToken} from "../utils/access-refresh.js"
import nodemailer from "nodemailer"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"



export const registerStudent=asyncHandler(async(req,res,next)=>{
  
  const {name,email,degree,department,section, password,roll_number,bio,year,passout_year,phone_number}=req.body;
  if(!isValidNitpEmail(email)){
      throw new apiError(400,"Invalid Email, use NITP email-address");
  }
  const {subjects_enrolled} = req.body;    
  const image_url = req.file.path
  if(!image_url) throw new apiError(400,"Please upload an image");

  if (!name ||!email ||!degree ||!department || !section ||!password ||!roll_number || !subjects_enrolled ||!year ||!passout_year ||!phone_number) {
      throw new apiError(400,"Please fill in all Mandatory fields"); 
    }
    
  //checking if student exists
  const studentExists = await Student.findOne({email:email})
  if(studentExists){
  throw new apiError(400,"Student already exists");
  }

  //handle  user imagee
  
  const cloudinary_img= await uploadToCloudinary(image_url);
  if(!cloudinary_img) throw new apiError(500,"Error uploading image");

  const newStudent = await Student.create({
  name,
  email,
  degree,
  department  ,
  section,
  password,
  roll_number,
  subjects_enrolled:subjects_enrolled,
  image_url:cloudinary_img,
  bio,
  year,
  passout_year,
  phone_number,
  })


  const attendanceSubs = subjects_enrolled.map((subject)=>({
    roll_number:roll_number,
    subject_code:subject
  }))

  await Attendance.insertMany(attendanceSubs);

  const createdStudent = await Student.findById(newStudent._id).select("-password -refreshToken");
  if(!createdStudent) throw new apiError(500,"Error creating student ");

  res.status(201).json(new apiResponse(201,"Student created successfully",createdStudent));
  
})

export const loginStudent = asyncHandler(async(req,res,next)=>{
  const {email,password}=req.body;
  if(!email) throw new apiError(400,"Please provide email");
  if(!password) throw new apiError(400,"Please provide password");
  const student = await Student.findOne({email:email});
  if(!student) throw new apiError(404,"Student not found");
  const isPasswordCorrect = await student.isPasswordCorrect(password);
  if(!isPasswordCorrect) throw new apiError(400,"Please enter correct password");
  const {at,rt}=await generateAccessAndRefreshToken(student._id);
  const loggedInStudent = await Student.findById(student._id).select("-password -refreshToken");

  const options={
    httpOnly:true,
    secure:true,
    sameSite:"None",
  }
  return res.status(200)
  .cookie("accessToken",at,options)
  .cookie("refreshToken",rt,options)
  .json(new apiResponse(200,{user:loggedInStudent,accessToken:at,refreshToken:rt},"Login successful"));

})

export const logoutStudent = asyncHandler(async (req, res, next) => {
  try {
    console.log("Logout Request User:", req.user);

    if (!req.user || !req.user._id) {
      return res.status(401).json(new apiResponse(401, {}, "Unauthorized: No user found"));
    }

    await Student.findByIdAndUpdate(req.user._id, {
      $set: { refreshToken: undefined },
    }, { new: true });

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "None",
    };

    res.status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new apiResponse(200, {}, "User logged out successfully"));
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json(new apiResponse(500, {}, "Internal Server Error"));
  }
});

export const getCurrentStudent = asyncHandler(async (req, res, next) => {
  const studentId = req.user._id;

  const student = await Student.findById(studentId).select("-password -refreshToken");
  if (!student) throw new apiError(404, "Student not found");

  res.status(200).json(new apiResponse(200, { user: student }, "Student profile fetched successfully"));
});


export const updateStudent = asyncHandler(async (req, res, next) => {
  const studentId = req.user._id;

 // destructure only the fields you allow to change
  const {
    name,
    email,
    degree,
    department,
    section,
    roll_number,
    bio,
    year,
    passout_year,
    phone_number,
  } = req.body;

  const exists = await Student.findById(studentId);
  if (!exists) throw new apiError(404, "Student not found");
  
  const student = await Student.findByIdAndUpdate(
    studentId,
    {
      name,
      email,
      degree,
      department,
      section,
      roll_number,
      bio,
      year,
      passout_year,
      phone_number,
    },
    { new: true }
  ).select("-password -refreshToken");

  res
    .status(200)
    .json(new apiResponse(200, "Student updated successfully", student));
});


export const changePassword = asyncHandler(async(req,res,next)=>{
  const studentId = req.user._id
  const {old_password,new_password}=req.body;
  if(!old_password || !new_password) throw new apiError(400,"Please provide old and new password");
  const student = await Student.findById(studentId);
  if(!student) throw new apiError(404,"Student not found");
  const isPasswordCorrect = await student.isPasswordCorrect(old_password);
  if(!isPasswordCorrect) throw new apiError(400,"Please enter correct old password");
  student.password=new_password;
  await student.save();
  res.status(200).json(new apiResponse(200,"Password changed successfully",student));
})

export const requestPasswordReset=asyncHandler(async(req,res,next)=>{
  const {email}= req.body
  const student =await  Student.findOne({email:email})
  if(!student) throw new apiError(404,"Student not found");
  const secret = process.env.JWT + student.password
  const token = jwt.sign({
    id:student._id,
    email:student.email,
  },secret,{expiresIn:'1h'})

  const host = req.get('host'); // Dynamically retrieves the host
  if(!host) throw new apiError(400,"Host not found");
  const resetURL = `${process.env.FRONTEND_URL}/passwordReset?id=${student._id}&token=${token}`;

  const transporter= nodemailer.createTransport({
    service:"gmail",
    auth:{
     user:process.env.EMAIL,
     pass:process.env.PASSWORD
    }
  })
  await transporter.verify().then(() => {
    console.log("Transporter verified successfully!");
  }).catch(error => {
    console.error("Error verifying transporter:", error);
  });
  
  
  const mailOption = {
    to:student.email,
    from :process.env.EMAIL,
    subject:"ACADEMIX - Password Reset Request",
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
      Please click on the following link, or paste this into your browser to complete the process:\n\n
      ${resetURL}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
  }
  await transporter.sendMail(mailOption);
  res.status(200).json(new apiResponse(200,"Password reset link sent to email"));
  

})


export const passwordReset = asyncHandler(async(req,res,next)=>{
  const {id,token}=req.query;
  const {password}=req.body
  
  const student = await Student.findOne({
    _id:id
  })
  if(!student) throw new apiError(404,"Student not found"); 
  const secret = process.env.JWT + student.password
  const verify = jwt.verify(token,secret)
  if(!verify) throw new apiError(400,"Invalid or expired token");
  const encrpytedPassword = await bcrypt.hash(password,10);
  await Student.findByIdAndUpdate(id,{
    password:encrpytedPassword
  })
  
  res.status(200).json(new apiResponse(200,"Password reset successfully"));
})

export const updateProfileImage = asyncHandler(async(req,res,next)=>{
  const studentId = req.user._id
  const localProfileImage = req.file.path;
  if(!localProfileImage) throw new apiError(400,"Please upload an image");
  const cloudinary_img= await uploadToCloudinary(localProfileImage);
  if(!cloudinary_img) throw new apiError(500,"Error uploading image");
  
  
  const student =await Student.findByIdAndUpdate(studentId,{
    $set:{
      image_url:cloudinary_img
    }

  },{new:true}).select("-password -refreshToken");
  

  //update in coding model as well for all the coding platforms
  await Coding.updateMany({roll_number:student.roll_number},{
    $set:{
      image_url:cloudinary_img
    }
  })

  if(!student) throw new apiError(500,"Error updating student");
  res.status(200).json(new apiResponse(200,"Profile image updated successfully",student));

})










