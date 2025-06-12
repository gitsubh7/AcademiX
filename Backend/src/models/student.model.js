import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    degree: {
      type: String,
      required: true,
      enum: ["B.Tech", "M.Tech", "MCA", "PhD"],
    },
    department: {
      type: String,
      required: true,
      enum: [
        "Applied Physics and Materials Engineering",
        "Architecture & Planning",
        "Chemical Science and Technology",
        "Civil Engineering",
        "Computer Science and Engineering",
        "Electrical Engineering",
        "Electronics and Communication Engineering",
        "Humanities & Social Sciences",
        "Mathematics and Computing Technology",
        "Mechanical Engineering",
      ],
    },
    section: {
      type: String,
      required: true,
      enum: ["1", "2", "3"],
    },
    password: {
      type: String,
      required: true,
    },
    roll_number: {
      type: String,
      required: true,
      unique: true,
    },
    subjects_enrolled: [ //array of course codes
      {
        type: String,
        required: true,
      },
    ],
    image_url: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: null,
      trim: true,
    },
    year: { // 1st, 2nd, 3rd..
      type: String,
      required: true,
    },
    passout_year: { // passout year
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
    refreshToken:{
      type:String,
  
    },
    documents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
      },
    ],
    attendance: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attendance",
      },
    ],
    
  },
  {
    timestamps: true, 
  }
);

studentSchema.pre("save", async function (next) {
  const student = this;
  if (student.isModified("password")) {
    student.password = await bcrypt.hash(student.password, 8);
  }
  next();
});



studentSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password,this.password);
}
studentSchema.methods.generateAccessToken = function(){
  return jwt.sign({
    _id:this._id,
    email:this.email,
    name:this.name,
    roll_number:this.roll_number,
  },process.env.ACCESS_TOKEN_SECRET,{expiresIn:process.env.ACCESS_TOKEN_EXPIRY})
}

studentSchema.methods.generateRefreshToken = function(){
  return jwt.sign({
    _id:this._id,
  },process.env.REFRESH_TOKEN_SECRET,{expiresIn:process.env.REFRESH_TOKEN_EXPIRY})
}

export const Student = mongoose.model("Student", studentSchema);
