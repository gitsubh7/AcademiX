import { Router } from "express";
import {upload} from "../middlewares/multer.js"
import {verifyJWT} from "../middlewares/auth.js"


import { registerStudent, loginStudent, logoutStudent, updateStudent, updateProfileImage,changePassword,requestPasswordReset,passwordReset,getCurrentStudent} from "../controllers/student.controller.js";
import { addCourse, editCourse, removeCourse ,markAbsent,markPresent,getAttendance} from "../controllers/attendance.controller.js";
import { getAllDocuments,deleteDocument,uploadDocument } from "../controllers/document.controller.js";
import { googleAuth,redirectGoogleAuth,addClass } from "../controllers/calendar.controller.js";
import { getGithubProfile, getCodeforcesProfile, getLeetCodeProfile,getLeetCodeRankingsC,getCodeForcesRankings,getLeetCodeRankingsQ } from "../controllers/coding.controller.js";



export const studentRouter = Router();
studentRouter.route("/register").post(
    upload.single("image_url"),registerStudent
)


//login,logout
studentRouter.route("/login").post(loginStudent)
studentRouter.route('/logout').post(verifyJWT,logoutStudent)


//update student routes
studentRouter.route("/me") .get(verifyJWT, getCurrentStudent);
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
studentRouter.route("/codeforces/:username").get(verifyJWT,getCodeforcesProfile)
studentRouter.route("/leetcode/:username").get(verifyJWT,getLeetCodeProfile);


//adding class to router
studentRouter.route("/google").get(googleAuth)
studentRouter.route("/google/redirect").get(redirectGoogleAuth)
studentRouter.route("/addClass").post(addClass)


//document routes
studentRouter.route("/uploadDocument").post(verifyJWT,upload.single("localDocument"),uploadDocument)
studentRouter.route("/getAllDocuments").get(verifyJWT,getAllDocuments)  
studentRouter.route("/deleteDocument/:id").delete(verifyJWT,deleteDocument)


//ranking routes

studentRouter.route("/codeForcesRankings").get(getCodeForcesRankings)
studentRouter.route("/leetcodeRankingsC").get(getLeetCodeRankingsC)
studentRouter.route("/leetcodeRankingsQ").get(getLeetCodeRankingsQ)
