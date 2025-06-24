import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./login/Login.jsx";
import SignUp from "./register/SignUp.jsx";
import Home from "./home/Home.jsx";
import ForgotPass from "./forgot-password/page.jsx";
import ResetPass from "./passwordReset/page.jsx";
import FaceLogin from "./face-login/Face-Login.jsx";

export default function App() {
  return (
    <Routes>
      {/* Default route goes to Signup */}
      <Route path="/" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Home/>}/>
      <Route path="/register" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPass />} />
      <Route path="/passwordReset" element={<ResetPass />} />
      <Route path="/face-login" element={<FaceLogin />} />

    </Routes>
  );
}
