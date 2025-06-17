import { Student } from "../models/student.model.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {apiResponse} from "../utils/apiResponse.js"
import { apiError } from "../utils/apiError.js";
import {uploadToCloudinary} from "../utils/cloudinary.js"
import { Document } from "../models/documents.model.js";
import {extractPublicId} from "cloudinary-build-url"
import  cloudinary  from "cloudinary"



export const  uploadDocument = asyncHandler(async(req,res,next)=>{
  const studentId = req.user._id
  console.log(studentId);
  if(!req.file) throw new apiError(400,"Please upload a document");
  const uploadedDocument = req.file.path;
  console.log(uploadedDocument);
  
  const cloudinary_img= await uploadToCloudinary(uploadedDocument);
  if(!cloudinary_img) throw new apiError(500,"Error uploading document");
  
  const document = await Document.create({
    name:req.body.name,
    url:cloudinary_img
  })
  
  const student = await Student.findByIdAndUpdate(studentId,{
    $push:{
      documents:document._id
    }
  },{new:true}).select("-password -refreshToken");
  if(!student) throw new apiError(500,"Error updating student");
  res.status(200).json(new apiResponse(200, "Document added successfully", {
  id: document._id,
  name: document.name,
  url: document.url
}));
  
})
export const getAllDocuments = asyncHandler(async(req,res,next)=>{
  const studentId = req.user._id
  const student = await Student.findById(studentId).populate("documents");
  if(!student) throw new apiError(404,"Student not found");
  const documents = student.documents;
  if(!documents) throw new apiError(404,"Documents not found");
  const documentToSend = {
    documents:documents.map((doc)=>({
      id:doc._id,
      name:doc.name,
      url:doc.url
    }))
  }
  res.status(200).json(new apiResponse(200,"Documents fetched successfully",documentToSend));
  
})
export const deleteDocument = asyncHandler(async (req, res, next) => {
  const studentId = req.user._id;
  const documentId = req.params.id;

  console.log("Student ID:", studentId);
  console.log("Document ID:", documentId);

  if (!documentId) throw new apiError(400, "Please provide document id");

  const student = await Student.findById(studentId);
  if (!student) throw new apiError(404, "Student not found");

  const document = await Document.findById(documentId);
  console.log("Found Document:", document);
  if (!document) throw new apiError(404, "Document not found");

  const cloudinaryUrl = document.url;
  const cloudinaryPublicId = extractPublicId(cloudinaryUrl);
  console.log("Cloudinary Public ID:", cloudinaryPublicId);
  if (!cloudinaryPublicId) throw new apiError(400, "Invalid document URL");

  const cloudinaryResponse = await cloudinary.uploader.destroy(cloudinaryPublicId);
  console.log("Cloudinary response:", cloudinaryResponse);

  if (cloudinaryResponse.result !== "ok") {
    throw new apiError(500, "Error deleting document from Cloudinary");
  }

  const index = student.documents.indexOf(documentId);
  if (index === -1) throw new apiError(404, "Document not found in student's records");

  student.documents.splice(index, 1);
  await student.save();

  await Document.findByIdAndDelete(documentId);

  res.status(200).json(new apiResponse(200, "Document deleted successfully", student));
});
