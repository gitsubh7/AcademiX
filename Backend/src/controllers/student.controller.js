import jwt from "jsonwebtoken";
import { Student } from "../models/student.model.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {apiResponse} from "../utils/apiResponse.js"
import { apiError } from "../utils/apiError.js";
import bcrypt from "bcryptjs";
import {uploadToCloudinary} from "../utils/cloudinary.js"



export const registerStudent=asyncHandler(async(req,res,next)=>{
    
})