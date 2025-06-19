// src/services/studentApi.js
import { axiosSecure } from "./axiosInstance";

export const updateProfile = (data) => axiosSecure.post("/v1/student/updateStudent", data);

export const changePassword = (data) =>
  axiosSecure.post("/v1/student/changePassword", data);
