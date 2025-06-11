import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import axios from "axios";
import {apiError} from "../utils/apiError.js"

export const  getWeatherDetailsPatna= asyncHandler(async(req,res,next)=>{
    const BASE_URL = 'https://api.open-meteo.com/v1/forecast';
    const response = await axios.get(BASE_URL,{
        params:{
            latitude:25.5941,
            longitude:85.1376,
            current_weather:true
        }
         
    })
    const data = response.data;
    if(!data) throw new apiError(404,"Data not found")
    res.status(200).json(new apiResponse(200,"Data fetched successfully",data.current_weather.temperature   ))
})

export const getWeatherDetailsBihta = asyncHandler(async(req,res,next)=>{
    const BASE_URL = 'https://api.open-meteo.com/v1/forecast';
    const response = await axios.get(BASE_URL,{
        params:{
            latitude:25.5536,
            longitude:84.8693,
            current_weather:true
        }
         
    })
    const data = response.data;
    if(!data) throw new apiError(404,"Data not found")
    res.status(200).json(new apiResponse(200,"Data fetched successfully",data.current_weather.temperature   ))
})