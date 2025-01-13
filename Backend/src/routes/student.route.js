import { Router } from "express";
import {upload} from "../middlewares/multer.js"
import {registerStudent} from "../controllers/student.controller.js"


export const studentRouter = Router();
userRouter.route("/register").post(
    upload.single({
        name: "profile_image",
        maxCount: 1,
    }),registerStudent
)

