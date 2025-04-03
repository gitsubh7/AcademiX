import { Router } from "express";
import {upload} from "../middlewares/multer.js"
import {registerStudent,loginStudent,logoutStudent, updateStudent, updateProfileImage,markAbsent,markPresent,getAttendance,removeCourse,editCourse,addCourse} from "../controllers/student.controller.js"
import {verifyJWT} from "../middlewares/auth.js"
import { changePassword,requestPasswordReset,passwordReset } from "../controllers/student.controller.js"
import {getGithubProfile,getCodeforcesProfile,getLeetCodeProfile} from "../controllers/student.controller.js"
import {googleAuth,redirectGoogleAuth} from "../controllers/student.controller.js"
import {addClass} from "../controllers/student.controller.js"
export const studentRouter = Router();
studentRouter.route("/register").post(
    upload.single("image_url"),registerStudent
)

//login,logout
studentRouter.route("/login").post(loginStudent)
studentRouter.route('/logout').post(verifyJWT,logoutStudent)


//update student routes
studentRouter.route("/updateStudent").post(verifyJWT,updateStudent)
studentRouter.route("/updateProfileImage").post(verifyJWT,upload.single("image_url"),updateProfileImage)


//course routes
studentRouter.route("/addCourse").post(verifyJWT,addCourse)
studentRouter.route("/editCourse").post(verifyJWT,editCourse)
studentRouter.route("/removeCourse").post(verifyJWT,removeCourse)

//password routes
studentRouter.route("/requestPasswordReset").post(requestPasswordReset)
studentRouter.route("/passwordReset").post(passwordReset)
studentRouter.route("/changePassword").post(verifyJWT,changePassword)


//attendance routes
studentRouter.route("/markAbsent").post(markAbsent)
studentRouter.route("/markPresent").post(markPresent)   
studentRouter.route("/getAttendance").get(getAttendance)



//coding profile routes
studentRouter.route("/github/:username").get(getGithubProfile)
studentRouter.route("/codeforces/:username").get(getCodeforcesProfile)
studentRouter.route("/leetcode/:username").get(getLeetCodeProfile);

//adding class to router
studentRouter.route("/google").get(googleAuth)
studentRouter.route("/google/redirect").get(redirectGoogleAuth)
studentRouter.route("/addClass").get(addClass)