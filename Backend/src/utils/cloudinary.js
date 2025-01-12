import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({ 
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret:process.env.CLOUDINARY_API_SECRET
});

export const uploadToCloudinary=async (file)=>{
    try {
        if(!file) return nulll
        const res = await cloudinary.uploader.upload(file,{resource_type:"auto"})
        console.log("FILE UPLOADED",res.url);
        fs.unlinkSync(file)
        return res;
         
    } catch (error) {
        fs.unlinkSync(file)
        return null;
    }
}


