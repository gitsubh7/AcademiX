import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./login/Login.jsx";
import SignUp from "./register/SignUp.jsx";
import Home from "./home/Home.jsx";
import ForgotPass from "./forgot-password/page.jsx";
import ResetPass from "./passwordReset/page.jsx";
import FaceLogin from "./face-login/Face-Login.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPass />} />
      <Route path="/api/v1/student/passwordReset" element={<ResetPass />} />
      <Route path="/face-login" element={<FaceLogin />} />
    </Routes>
  );  
}








