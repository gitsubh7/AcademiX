import { Student } from "../models/student.model.js";
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
import axios from "axios"

export const registerStudent=asyncHandler(async(req,res,next)=>{
      const {name,email,degree,department,section, password,roll_number,bio,year,passout_year,phone_number}=req.body;
      if(!isValidNitpEmail(email)){
          throw new apiError(400,"Invalid Email, use NITP email-address");
      }
      const {subjects_enrolled} = req.body;    
      const image_url = req.file.path
      if(!image_url) throw new apiError(400,"Please upload an image");
      // console.log(req.body);
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
  console.log(at);
  console.log(rt);
  
  
  const options={
    httpOnly:true,
    secure:true,
  }
  return res.status(200)
  .cookie("accesstoken",at,options)
  .cookie("refreshtoken",rt,options)
  .json(new apiResponse(200,{user:loggedInStudent,accessToken:at,refreshToken:rt},"Login successful"));


})

export const logoutStudent = asyncHandler(async(req,res,next)=>{
  await Student.findByIdAndUpdate(req.user._id,{
    $set:{
      refreshToken:undefined
    }},
    {new:true})
  const options={
    httpOnly:true,
    secure:true
  }
  res.status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(new apiResponse(200,{},"User logged out successfully"))


})

export const updateStudent=asyncHandler(async(req,res,next)=>{
  const studentId = req.user._id
  if(!student) throw new apiError(404,"Student not found");
  const {name,email,degree,department,section,roll_number,bio,year,passout_year,phone_number}=req.body;
  const student = Student.findByIdAndUpdate(studentId,{
    name,email,degree,department,section,roll_number,bio,year,passout_year,phone_number
  },{new:true}).select("-password -refreshToken");
  if(!student) throw new apiError(500,"Error updating student");
  res.status(200).json(new apiResponse(200,"Student updated successfully",student));

})

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
  const resetURL = `${req.protocol}://${host}/api/v1/student/passwordReset?id=${student._id}&token=${token}`;

    
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
  const {id,token}=req.query
  const {password}=req.body
  console.log(id);
  
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
  
  if(!student) throw new apiError(500,"Error updating student");
  res.status(200).json(new apiResponse(200,"Profile image updated successfully",student));

})

export const removeCourse = asyncHandler(async(req,res,next)=>{
  const studentId=  req.user._id;
  const student = await Student.findById(studentId);
  if(!student) throw new apiError(404,"Student not found");
  const {subject_code}=req.body;
  if(!subject_code) throw new apiError(400,"Please provide subject code");
  const index = student.subjects_enrolled.indexOf(subject_code);
  if(index===-1) throw new apiError(404,"Course not found");
  student.subjects_enrolled.splice(index,1);
  await student.save();
  await Attendance.deleteOne({roll_number:student.roll_number,subject_code:subject_code});
  res.status(200).json(new apiResponse(200,"Course removed successfully",student));

  
  

})

export const addCourse = asyncHandler(async(req,res,next)=>{
  const studentId=  req.user._id;
  const student = await Student.findById(studentId);
  if(!student) throw new apiError(404,"Student not found");
  const {subject_code}=req.body;
  if(!subject_code) throw new apiError(400,"Please provide subject code");
  student.subjects_enrolled.push(subject_code);
  await student.save();
  await Attendance.create({
    roll_number:student.roll_number,subject_code:subject_code 
  })

  res.status(200).json(new apiResponse(200,"Course added successfully",student));
})

export const editCourse = asyncHandler(async(req,res,next)=>{
  const studentId=  req.user._id;
  const student = await Student.findById(studentId);
  if(!student) throw new apiError(404,"Student not found");
  const {old_subject_code,new_subject_code}=req.body;
  if(!old_subject_code || !new_subject_code) throw new apiError(400,"Please provide old and new subject code");
  const index = student.subjects_enrolled.indexOf(old_subject_code);
  if(index===-1) throw new apiError(404,"Course not found");
  student.subjects_enrolled[index]=new_subject_code;
  await student.save();
  const attendance = await Attendance.findOne({roll_number:student.roll_number,subject_code:old_subject_code});
  if(!attendance) throw new apiError(404,"Attendance not found");
  attendance.subject_code=new_subject_code;
  attendance.save()
  res.status(200).json(new apiResponse(200,"Course edited successfully",student));
})

export const markAbsent =asyncHandler(async(req,res,next)=>{
  const {subject_code,roll_number}=req.body;
  const attendance= await Attendance.findOne({subject_code:subject_code,roll_number:roll_number});
  if(!attendance) throw new apiError(404,"Attendance not found");
  attendance.absent+=1;
  // attendance.total+=1;
  await attendance.save();
  res.status(200).json(new apiResponse(200,"Absent marked successfully",attendance));
})

export const markPresent =asyncHandler(async(req,res,next)=>{  
  const {subject_code,roll_number}=req.body;
  const attendance= await Attendance.findOne({subject_code:subject_code,roll_number:roll_number});
  if(!attendance) throw new apiError(404,"Attendance not found");
  attendance.present+=1;
  await attendance.save();
  res.status(200).json(new apiResponse(200,"Present marked successfully",attendance))
})

export const getAttendance =asyncHandler(async(req,res,next)=>{
  const {roll_number}=req.body
  console.log(roll_number);
  
  if(!roll_number) throw new apiError(400,"Please provide roll number");
  const attendance = await Attendance.find({roll_number:roll_number}).select("subject_code present absent total percentage");
  if(!attendance) throw new apiError(404,"Attendance not found");
  res.status(200).json(new apiResponse(200,"Attendance fetched successfully",attendance))
})





export const getGithubProfile = asyncHandler(async (req, res, next) => {
  const { username } = req.params;
  const url = `https://api.github.com/users/${username}`;

    const response = await axios.get(url);
    if (!response.data) throw new apiError(404, "GitHub profile not found");


    const reposResponse = await axios.get(response.data.repos_url);
    const repositories = reposResponse.data;

    let commits = 0;

    for (const repo of repositories) {
      try {
        const commitResponse = await axios.get(`https://api.github.com/repos/${username}/${repo.name}/commits`);
        commits += commitResponse.data.length;
      } catch (err) {
        console.error(`Error fetching commits for repo: ${repo.name}`);
      }
    }
    const profile = {
      username: response.data.login,
      name: response.data.name,
      bio: response.data.bio,
      followers: response.data.followers,
      following: response.data.following,
      public_repos: response.data.public_repos,
      commits: commits,
    };

    res.status(200).json(new apiResponse(200, "GitHub profile fetched successfully", profile));
  
});
