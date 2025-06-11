import mongoose from "mongoose";
const documentSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    url:{
        type:String,
        required:true,
        trim:true
    },
    
},
{
    timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})
export const Document = mongoose.model("Document", documentSchema);