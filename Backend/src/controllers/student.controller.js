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
    const createdStudent = await Student.findById(newStudent._id).select("-password -refreshToken");
    if(!createdStudent) throw new apiError(500,"Error creating student ");

    res.status(201).json(new apiResponse(201,"Student created successfully",createdStudent));




    
})