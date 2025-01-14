import jwt from "jsonwebtoken";
import { Student } from "../models/student.model.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {apiResponse} from "../utils/apiResponse.js"
import { apiError } from "../utils/apiError.js";
import bcrypt from "bcrypt";
import {uploadToCloudinary} from "../utils/cloudinary.js"


function isValidNitpEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@nitp\.ac\.in$/;
    return emailRegex.test(email);
  }
export const registerStudent=asyncHandler(async(req,res,next)=>{
    const {name,email,degree,department,password,roll_number,bio,year,passout_year,phone_number}=req.body;
    if(!isValidNitpEmail(email)){
        return new apiError(400,"Invalid Email, use NITP email-address");
    }
    const subjects_enrolled = Array.isArray(req.body.subjects_enrolled)
    ? req.body.subjects_enrolled
    : JSON.parse(req.body.subjects_enrolled );

    // Validate the array
    if (!Array.isArray(subjects_enrolled) || subjects_enrolled.length === 0) {
    return next(new apiError(400, "Please provide at least one subject in subjects_enrolled."));
    }

    console.log(subjects_enrolled);
    console.log(typeof subjects_enrolled);
    
    
    if (!name ||!email ||!degree ||!department || !section ||!password ||!roll_number || !subjects_enrolled ||!year ||!passout_year ||!phone_number) {
        return new apiError(400,"Please fill in all Mandatory fields"); 
      }
      
    //checking if student exists
    const studentExists = await Student.findOne({email:email})
    if(studentExists){
    return new apiError(400,"Student already exists");
    }
    //handle  user imagee
    const image_url = req.files?.image_url[0]?.path
    if(!image_url) return new apiError(400,"Please upload an image");
    const cloudinary_img= await uploadToCloudinary(image_url);
    if(!cloudinary_img) return new apiError(500,"Error uploading image");

    const newStudent = await User.create({
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
    const createdStudent = await User.findById(newStudent._id).select("-password -refreshToken");
    if(!createdStudent) return new apiError(500,"Error creating student ");

    return new apiResponse(201,createdStudent,"Student created successfully");




    
})