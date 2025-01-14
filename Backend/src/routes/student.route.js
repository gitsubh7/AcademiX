import { Router } from "express";
import {upload} from "../middlewares/multer.js"
import {registerStudent,loginStudent,logoutStudent, markAbsent,markPresent,getAttendance} from "../controllers/student.controller.js"
import {verifyJWT} from "../middlewares/auth.js"

export const studentRouter = Router();
studentRouter.route("/register").post(
    upload.single("image_url"),registerStudent
)
studentRouter.route("/login").post(loginStudent)
studentRouter.route('/logout').post(verifyJWT,logoutStudent)
studentRouter.route("/markAbsent").post(markAbsent)
studentRouter.route("/markPresent").post(markPresent)   
studentRouter.route("/getAttendance").get(getAttendance)