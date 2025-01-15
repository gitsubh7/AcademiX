import { Router } from "express";
import {getWeatherDetails} from "../controllers/weather.controller.js"
export const weatherRouter = Router();
weatherRouter.route("/").get(getWeatherDetails)