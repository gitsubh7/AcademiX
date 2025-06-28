import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import {studentRouter} from "../src/routes/student.route.js"
import { weatherRouter } from "../src/routes/weather.route.js"

const allowedOrigins = [
  "http://localhost:3001",                // Local dev
  "https://academixportal.vercel.app"   // Vercel frontend
];


export const app =express();

app.use(cookieParser());
app.use(express.json({limit: "30mb", extended: true}));
app.use(express.urlencoded({limit: "30mb", extended: true}));

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
app.use(express.static("public"))


//routes
app.use('/api/v1/student',studentRouter);
app.use('/api/v1/weather',weatherRouter);  





