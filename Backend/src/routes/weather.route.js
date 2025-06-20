import { Router } from "express";
import {getWeatherDetailsPatna,getWeatherDetailsBihta} from "../controllers/weather.controller.js"

export const weatherRouter = Router();

weatherRouter.route("/patna").get(getWeatherDetailsPatna)
weatherRouter.route("/bihta").get(getWeatherDetailsBihta)
