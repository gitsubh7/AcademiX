
import { Student } from "../models/student.model.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {apiResponse} from "../utils/apiResponse.js"
import { apiError } from "../utils/apiError.js";
import {Attendance} from "../models/attendance.model.js"

export const removeCourse = asyncHandler(async(req,res,next)=>{
  const studentId=  req.user._id;
  const student = await Student.findById(studentId);
  if(!student) throw new apiError(404,"Student not found");
  const {subject_code}=req.body;
  if(!subject_code) throw new apiError(400,"Please provide subject code");
  const index = student.subjects_enrolled.indexOf(subject_code);
  if(index===-1) throw new apiError(404,"Course not found");
  student.subjects_enrolled.splice(index,1);
  await student.save();
  await Attendance.deleteOne({roll_number:student.roll_number,subject_code:subject_code});
  res.status(200).json(new apiResponse(200,"Course removed successfully",student));

  
  

})

export const addCourse = asyncHandler(async(req,res,next)=>{
  const studentId=  req.user._id;
  const student = await Student.findById(studentId);
  if(!student) throw new apiError(404,"Student not found");
  const {subject_code}=req.body;
  if(!subject_code) throw new apiError(400,"Please provide subject code");
  student.subjects_enrolled.push(subject_code);
  await student.save();
  await Attendance.create({
  roll_number : student.roll_number,
   subject_code,
   present     : 0,
   absent      : 0,
 });

 // 3️⃣ return the row we just created so UI can show correct counters
 const freshAttendance = await Attendance.findOne({
   roll_number : student.roll_number,
   subject_code,
 });

  res.status(200).json(new apiResponse(200,"Course added successfully",freshAttendance));
})

export const editCourse = asyncHandler(async(req,res,next)=>{
  const studentId=  req.user._id;
  const student = await Student.findById(studentId);
  if(!student) throw new apiError(404,"Student not found");
  const {old_subject_code,new_subject_code}=req.body;
  if(!old_subject_code || !new_subject_code) throw new apiError(400,"Please provide old and new subject code");
  const index = student.subjects_enrolled.indexOf(old_subject_code);
  if(index===-1) throw new apiError(404,"Course not found");
  student.subjects_enrolled[index]=new_subject_code;
  await student.save();
  const attendance = await Attendance.findOne({roll_number:student.roll_number,subject_code:old_subject_code});
  if(!attendance) throw new apiError(404,"Attendance not found");
  attendance.subject_code=new_subject_code;
  attendance.save()
  res.status(200).json(new apiResponse(200,"Course edited successfully",student));
})

export const markAbsent =asyncHandler(async(req,res,next)=>{
  const {subject_code,roll_number}=req.body;
  const attendance = await Attendance.findOneAndUpdate(
   { roll_number, subject_code },
   { $inc: { absent: 1 } },
   { new: true, upsert: true, setDefaultsOnInsert: true }
 );
  res.status(200).json(new apiResponse(200,"Absent marked successfully",attendance));
})

export const markPresent =asyncHandler(async(req,res,next)=>{  
  const {subject_code,roll_number}=req.body;
  const attendance = await Attendance.findOneAndUpdate(
   { roll_number, subject_code },
   { $inc: { present: 1 } },
   { new: true, upsert: true, setDefaultsOnInsert: true }
 );
  res.status(200).json(new apiResponse(200,"Present marked successfully",attendance))
})

export const getAttendance =asyncHandler(async(req,res,next)=>{
  const {roll_number}=req.query 
  if(!roll_number) throw new apiError(400,"Please provide roll number");
  const attendance = await Attendance.find({roll_number:roll_number}).select("subject_code present absent total percentage");
  if(!attendance) throw new apiError(404,"Attendance not found");
  res.status(200).json(new apiResponse(200,"Attendance fetched successfully",attendance))
})
