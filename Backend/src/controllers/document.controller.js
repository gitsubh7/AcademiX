import { Student } from "../models/student.model.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {apiResponse} from "../utils/apiResponse.js"
import { apiError } from "../utils/apiError.js";
import {uploadToCloudinary} from "../utils/cloudinary.js"
import { Document } from "../models/documents.model.js";
import {extractPublicId} from "cloudinary-build-url"
import  cloudinary  from "cloudinary"
import mongoose from "mongoose";
import { unlink } from "fs/promises";

export const uploadDocument = asyncHandler(async (req, res) => {
  const studentId = req.user._id;

  /* ------------------------------------------------------------------
     1. Guards
  ------------------------------------------------------------------ */
  if (!req.file) throw new apiError(400, "Please upload a document");
  if (!req.body.name?.trim())
    throw new apiError(400, "Document name is required");

  /* ------------------------------------------------------------------
     2. Upload temp file to Cloudinary
        - your helper should resolve to { secure_url, public_id, ... }
        - if it only returns the URL string, adapt as noted
  ------------------------------------------------------------------ */
  /* 2. Upload temp file to Cloudinary --------------------------------- */
let secureUrl;

try {
  const cloudinaryResp = await uploadToCloudinary(req.file.path, {
    resource_type: "auto",
    folder: "academix/documents",
  });

  // helper might return an object *or* a plain string
  secureUrl =
    typeof cloudinaryResp === "string"
      ? cloudinaryResp                    // helper returns URL string
      : cloudinaryResp?.secure_url;       // helper returns full object

  if (!secureUrl) throw new Error("No secure URL returned from Cloudinary");
} catch (cloudErr) {
  console.error("Cloudinary upload failed:", cloudErr);
  throw new apiError(500, "Error uploading document to Cloudinary");
}
 finally {
    /* --------------------------------------------------------------
       2b. ALWAYS try to remove the temp file, even if Cloudinary fails
    -------------------------------------------------------------- */
    try {
      await unlink(req.file.path); // cleanup ./public/temp/...
    } catch (fsErr) {
      // non‑fatal, just log
      console.warn("Temp‑file cleanup failed:", fsErr.message);
    }
  }

  /* ------------------------------------------------------------------
     3.  Create the Document with ownership
  ------------------------------------------------------------------ */
  const document = await Document.create({
    name: req.body.name.trim(),
    url: secureUrl,
    student: studentId,
    originalName: req.file.originalname,          // optional: store original
    mimeType: req.file.mimetype,                  // optional: easy filtering
    size: req.file.size,                          // optional: analytics
  });

  /* ------------------------------------------------------------------
     4.  Push the reference into the Student doc (no need for the whole doc)
  ------------------------------------------------------------------ */
  await Student.findByIdAndUpdate(studentId, {
    $push: { documents: document._id },
  });

  /* ------------------------------------------------------------------
     5.  Done!
  ------------------------------------------------------------------ */
  res.status(201).json(
    new apiResponse(201, "Document added successfully", {
      id: document._id,
      name: document.name,
      url: document.url,
      createdAt: document.createdAt,
    })
  );
});


export const getAllDocuments = asyncHandler(async (req, res) => {
  /* ---------------------------------------------------------
     We no longer need to load the whole Student doc and populate.
     Just pull this user’s docs directly from the Document collection.
  --------------------------------------------------------- */
  const studentId = req.user._id;

  const documents = await Document.find({ student: studentId })   // <-- new field
    .lean({ virtuals: true })          // keeps the “id” virtual we added
    .select("id name url createdAt");  // you can add/remove fields as you like

  /* ---------------------------------------------------------
     Send them back inside a single  "documents"  array.
     -->  response.data.documents  on the client.
  --------------------------------------------------------- */
  res
    .status(200)
    .json(
      new apiResponse(200, "Documents fetched successfully", {
        documents
      })
    );
});

export const deleteDocument = asyncHandler(async (req, res) => {
  const studentId  = req.user._id;
  const documentId = req.params.id;

  /* ---- 1. Sanity -------------------------------------------------- */
  if (!mongoose.Types.ObjectId.isValid(documentId)) {
    throw new apiError(400, "Invalid document id");
  }

  /* ---- 2. Verify ownership --------------------------------------- */
  const document = await Document.findOne({ _id: documentId, student: studentId });
  if (!document) throw new apiError(404, "Document not found");

  /* ---- 3. Delete from Cloudinary --------------------------------- */
  const publicId = extractPublicId(document.url);   // "folder/file"
  if (!publicId) throw new apiError(400, "Invalid Cloudinary URL");

  // we stored images *and* PDFs, so use resource_type:auto
  const cloudResp = await cloudinary.uploader.destroy(publicId, {
    resource_type: "auto",
  });

  // treat "not found" the same as success (idempotent deletes)
  if (!["ok", "not found"].includes(cloudResp.result)) {
    throw new apiError(500, "Cloudinary deletion failed");
  }

  /* ---- 4. MongoDB cleanup ---------------------------------------- */
  await Promise.all([
    // remove the ref from student.docs array
    Student.updateOne({ _id: studentId }, { $pull: { documents: documentId } }),
    // remove the actual document
    Document.deleteOne({ _id: documentId }),
  ]);

  /* ---- 5. Respond ------------------------------------------------- */
  res
    .status(200)
    .json(new apiResponse(200, "Document deleted successfully", { id: documentId }));
});