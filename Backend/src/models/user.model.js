import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    googleId:String,
    accessToken:String,
    refreshToken:String
},{timestamps:true})


export const User = mongoose.model("User", userSchema);