import { Router } from "express";
import {upload} from "../middlewares/multer.js"
import {registerStudent,markAbsent,markPresent,getAttendance} from "../controllers/student.controller.js"



export const studentRouter = Router();
studentRouter.route("/register").post(
    upload.single("image_url"),registerStudent
)

// studentRouter.route("/attendance").get(getAttendance)

studentRouter.route("/markAbsent").post(markAbsent)
studentRouter.route("/markPresent").post(markPresent)   
studentRouter.route("/getAttendance").get(getAttendance)