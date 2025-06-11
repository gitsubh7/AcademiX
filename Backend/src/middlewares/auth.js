import {Student} from "../models/student.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js"
import { apiResponse } from "../utils/apiResponse.js"
import jwt from "jsonwebtoken"


export const verifyJWT=asyncHandler(async (req,res,next)=> {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
    console.log(token);
    
    if(!token) throw new apiError(401,"Unauthorized");
    
    
    const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)  
    
    const user  =await Student.findById(decodedToken._id).select("-password -refreshToken")
    if(!user) throw new apiError(401,"Unauthorized");
    req.user= user
    console.log("Hi");
    
    next()


})