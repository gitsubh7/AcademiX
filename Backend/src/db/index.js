import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
export const connectDB=async ()=>{
    try {
        const instance = await mongoose.connect(`${process.env.MONGODB_URI}${DB_NAME}`)
        console.log(`Connected to ${instance.connection.host}`);
        // console.log("CONNECTED")
    } catch (error) {
        console.log(error);
    }
}