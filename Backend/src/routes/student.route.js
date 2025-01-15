import { Router } from "express";
import {upload} from "../middlewares/multer.js"
import {registerStudent,loginStudent,logoutStudent, updateStudent, updateProfileImage,markAbsent,markPresent,getAttendance,removeCourse,editCourse,addCourse} from "../controllers/student.controller.js"
import {verifyJWT} from "../middlewares/auth.js"

export const studentRouter = Router();
studentRouter.route("/register").post(
    upload.single("image_url"),registerStudent
)
studentRouter.route("/login").post(loginStudent)
studentRouter.route('/logout').post(verifyJWT,logoutStudent)
studentRouter.route("/updateStudent").post(verifyJWT,updateStudent)
studentRouter.route("/updateProfileImage").post(verifyJWT,upload.single("image_url"),updateProfileImage)
studentRouter.route("/addCourse").post(verifyJWT,addCourse)
studentRouter.route("/editCourse").post(verifyJWT,editCourse)
studentRouter.route("/removeCourse").post(verifyJWT,removeCourse)
// studentRouter.route("/changePassword").post(changePassword)
studentRouter.route("/markAbsent").post(markAbsent)
studentRouter.route("/markPresent").post(markPresent)   
studentRouter.route("/getAttendance").get(getAttendance)