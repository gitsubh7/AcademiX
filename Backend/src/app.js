import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

export const app =express();

app.use(cookieParser());
app.use(express.json({limit: "30mb", extended: true}));
app.use(express.urlencoded({limit: "30mb", extended: true}));
app.use(cors({
    origin:process.env.CORS_ORIGIN
}));
app.use(express.static("public"))


//routes






