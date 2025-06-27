// src/api.js
import axios from "axios";
import { getAccessToken, getRefreshToken } from "./utils/auth";  

/* -------------------------------------------------
   1. Axios instance with your back‑end base URL
   ------------------------------------------------- */
export const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/v1/student`,
 // adjust if you mount router elsewhere
  withCredentials: true, 
});

/* -------------------------------------------------
   2. Interceptor — add auth headers on the fly
   ------------------------------------------------- */
api.interceptors.request.use((config) => {
  const accessToken  = getAccessToken();
  const refreshToken = getRefreshToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
    if (refreshToken) config.headers["x-refresh-token"] = refreshToken;
  }
  return config;
}, (error) => Promise.reject(error));

/* -------------------------------------------------
   3. Tiny helpers — adjust paths to your routes
   ------------------------------------------------- */
export const fetchLeetCode   = (username) => api.get(`/leetcode/${username}`);
export const fetchCodeforces = (username) => api.get(`/codeforces/${username}`);
export const fetchGitHub     = (username) => api.get(`/github/${username}`);
export const getLeetRankByQuestions = () =>
  api.get("/leetcodeRankingsQ");     // returns array of users

export const getLeetRankByRating = () =>
  api.get("/leetcodeRankingsC");

export const getCFRankings = () =>
  api.get("/codeforcesRankings");

/* -------------------------------------------------
   4. (Optional) default export for ad‑hoc calls
   ------------------------------------------------- */
// export default api;
