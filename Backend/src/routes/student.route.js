import { Router } from "express";
import {upload} from "../middlewares/multer.js"
import {registerStudent} from "../controllers/student.controller.js"


export const studentRouter = Router();
studentRouter.route("/register").post(
    upload.single("image_url"),registerStudent
)

