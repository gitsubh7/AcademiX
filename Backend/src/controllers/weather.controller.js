import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const  getWeatherDetails= asyncHandler(async(req,res,next)=>{
    const userIp=req.clientIp;
    const result = await fetch(`http://ip-api.com/json/${userIp}`);
    if(!result) throw new Error("Unable to fetch location");
    const data = await result.json();
    res.status(200).json(new apiResponse(200,"Location fetched successfully",data));
})