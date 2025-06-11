import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    roll_number:{
        type:String,
        required:true,
        ref:"Student"
    },
    subject_code:{
        type:String,
        required:true
    },
    present:{
        type:Number,
        default:0

    },
    absent:{
        type:Number,
        default:0  
    }
},{timestamps:true,toJSON:{virtuals:true},toObject:{virtuals:true}})

attendanceSchema.virtual("total").get(function(){
    return this.present+this.absent
})

attendanceSchema.virtual("percentage").get(function(){
    if(this.total==0) return 0
    return (this.present/this.total)*100;
})

export const Attendance  = mongoose.model("Attendance",attendanceSchema);
