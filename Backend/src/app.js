import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import {studentRouter} from "../src/routes/student.route.js"
import { weatherRouter } from "../src/routes/weather.route.js"

export const app =express();

app.use(cookieParser());
app.use(express.json({limit: "30mb", extended: true}));
app.use(express.urlencoded({limit: "30mb", extended: true}));
app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.static("public"))


//routes
app.use('/api/v1/student',studentRouter);
app.use('/api/v1/weather',weatherRouter);  





