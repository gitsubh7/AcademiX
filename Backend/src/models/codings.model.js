import mongoose from "mongoose";

const codingSchema = new mongoose.Schema({
    image_url:{
        type:String,
        default:null,
        ref:"Student"
    },
    name:{
        type:String,
        required:true,
        ref:"Student"
    },
    roll_number:{
        type:String,
        required:true,
        ref:"Student"
    },
    questions_solved:{
        type:Number,
        default:0
    },
    contest_rating:{
        type:Number,
        default:0
    },
    platform:{
        type:String,
        enum:["codeforces","leetcode"],
        required:true
    },
    
})
export const Coding = mongoose.model("Coding",codingSchema);