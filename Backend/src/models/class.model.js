import mongoose from 'mongoose';
const classSchema = new mongoose.Schema({
    rollNumber:{
        type:String,
        required:true,
        ref:"Student"
    },
    classRoom:{
        type:String,
        required:true
    },
    subject:{
        type:String,
        required:true
    },
    days:[{
        type:String,
        required:true
    }],
    startTime:{
        type:String,
        required:true
    },
    endTime:{
        type:String,
        required:true
    },
    recurrenceEnd:{
        type:String,
        required:true
    }
},{timestamps:true})
export const Class = mongoose.model('Class',classSchema);