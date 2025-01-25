import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import {upload} from "../src/middlewares/multer.js";
export const app =express();
import passport from "passport";
import {studentRouter} from "../src/routes/student.route.js"
import { weatherRouter } from "../src/routes/weather.route.js"
app.use(cookieParser());
app.use(express.json({limit: "30mb", extended: true}));
app.use(express.urlencoded({limit: "30mb", extended: true}));
app.use(cors({
    origin:process.env.CORS_ORIGIN
}));
app.use(express.static("public"))


//routes
app.use('/api/v1/student',studentRouter);
app.use('/api/v1/weather',weatherRouter);   





