
import axios from "axios";
import { getAccessToken, getRefreshToken } from "./utils/auth";  


export const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/v1/student`,
  withCredentials: true, 
});


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
   3. Tiny helpers
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

// export default api;
