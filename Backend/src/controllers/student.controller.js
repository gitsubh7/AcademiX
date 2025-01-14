import jwt from "jsonwebtoken";
import { Student } from "../models/student.model.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {apiResponse} from "../utils/apiResponse.js"
import { apiError } from "../utils/apiError.js";
import bcrypt from "bcrypt";
import {uploadToCloudinary} from "../utils/cloudinary.js"
import {Attendance} from "../models/attendance.model.js"

function isValidNitpEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@nitp\.ac\.in$/;
    return emailRegex.test(email);
}

const generateAccessAndRefreshToken = async(studentId)=>{
    try {
      const student = await Student.findById(studentId);
      if(!student) throw new apiError(404,"Student not found");
      const at = student.generateAccessToken();
      const rt = student.generateRefreshToken();
      student.refreshToken = rt;
      await student.save({validateBeforeSave:false});
      return {at,rt};
    } catch (error) {
      throw new apiError(500,"Error generating tokens");
    }
}

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
//change password


//update details



//mark absent

export const markAbsent =asyncHandler(async(req,res,next)=>{
  const {subject_code,roll_number}=req.body;
  const attendance= await Attendance.findOne({subject_code:subject_code,roll_number:roll_number});
  if(!attendance) throw new apiError(404,"Attendance not found");
  attendance.absent+=1;
  // attendance.total+=1;
  await attendance.save();
  res.status(200).json(new apiResponse(200,"Absent marked successfully",attendance));
})

//mark present
export const markPresent =asyncHandler(async(req,res,next)=>{  
  const {subject_code,roll_number}=req.body;
  const attendance= await Attendance.findOne({subject_code:subject_code,roll_number:roll_number});
  if(!attendance) throw new apiError(404,"Attendance not found");
  attendance.present+=1;
  await attendance.save();
  res.status(200).json(new apiResponse(200,"Present marked successfully",attendance))
})


//get attendance
export const getAttendance =asyncHandler(async(req,res,next)=>{
  const {roll_number}=req.body
  console.log(roll_number);
  
  if(!roll_number) throw new apiError(400,"Please provide roll number");
  const attendance = await Attendance.find({roll_number:roll_number}).select("subject_code present absent total percentage");
  if(!attendance) throw new apiError(404,"Attendance not found");
  res.status(200).json(new apiResponse(200,"Attendance fetched successfully",attendance))
})




