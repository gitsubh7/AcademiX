// src/services/axiosInstance.js
import axios from "axios";
import { getAccessToken } from "../utils/auth";      // ←  already in utils

export const axiosSecure = axios.create({
  baseURL: "http://localhost:3000/api" || "/api",
});

axiosSecure.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
