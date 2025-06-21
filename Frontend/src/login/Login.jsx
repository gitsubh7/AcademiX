import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {useUserContext} from "../context/userContext.jsx";
import logo from "../assets/Logo.png";

const Login = () => {
  const {loginUser,userState,handlerUserInput,resetUserState} = useUserContext();
  const {email,password} = userState;
  const [inputReady, setInputReady] = useState(false);

const navigate = useNavigate();
 useEffect(() => {
  resetUserState();
  setTimeout(() => setInputReady(true), 50);
}, []);
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(!showPassword);
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="hidden md:flex w-1/2 bg-gradient-to-r from-[#00255A] to-[#084297] p-10 flex-col justify-between items-center relative">
        <div className="absolute top-20 left-10 text-white">
          <h1 className="text-5xl lg:text-7xl font-bold">Welcome</h1>
          <h1 className="text-5xl lg:text-7xl font-bold">Back!</h1>
        </div>
      </div>

      <div className="flex flex-col w-full md:w-1/2 justify-center items-center bg-[#B3D4F1] px-10 py-10 md:px-20 relative">
        <div className="absolute right-2 top-2 md:right-8 md:top-8">
          <img src={logo} alt="Logo" className="w-14 md:w-16 lg:w-20" />
        </div>

        <div className="w-full">
          <h1 className="text-[1.6rem] md:text-4xl font-bold mb-4 text-left">Login</h1>
          <p className="text-gray-600 mb-6 text-[0.9rem] md:text-lg">
            Welcome Back! Please login to your account.
          </p>
          <form onSubmit={loginUser} className="space-y-6" autoComplete="off">
            <div>
              <label className="block text-gray-700 text-[0.9rem] md:text-lg">
                User Email
              </label>
              <input
                readOnly={!inputReady}
                type="email"
                value={email}
                autoComplete="off"
                onChange={handlerUserInput("email")}
                placeholder="testmail@gmail.com"
                className="w-full p-3 border border-gray-400 rounded-lg text-[0.9rem] md:text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div className="mb-2 relative">
            <label htmlFor="password" className="block text-gray-700 text-[0.9rem] md:text-lg">
              Password
            </label>
            <div className="relative">
              <input
              readOnly={!inputReady}
                type={showPassword ? "text" : "password"}
                
                value={password}
                autoComplete="off"
                onChange={handlerUserInput("password")}
                id="password"
                placeholder="*********"
                className="w-full p-3 border border-gray-400 rounded-lg text-[0.9rem] md:text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                onClick={togglePassword}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>
                        <div 
              className="text-right"
            >
              <button
                onClick={() => navigate("/forgot-password")}
                className="
                  text-blue-600 hover:text-blue-800 
                  text-sm md:text-base 
                  transition-colors duration-200
                  focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50
                  rounded-md px-1 py-0.5
                  cursor-pointer
                "
                aria-label="Forgot password? Click to reset"
              >
                Forgot Password?
              </button>
            </div>

            <div className="flex flex-col space-y-4">
              <button
              type="submit"
              className="w-full bg-[#1B4F83] text-white py-3 rounded-lg text-[0.9rem] md:text-lg font-semibold hover:bg-[#163b6a] transition-all"
              // disabled={loading}
            >
              Login
            </button>
              <div className="flex items-center justify-center text-gray-600 font-semibold">
                <hr className="w-1/3 border-gray-400" />
                <span className="mx-4">OR</span>
                <hr className="w-1/3 border-gray-400" />
              </div>
              <button
                onClick={() => navigate("/face-login")}
                className="w-full bg-[#1B4F83] text-white py-3 rounded-lg text-[0.9rem] md:text-lg font-semibold hover:bg-[#163b6a] transition-all"
              >
                Login using Facial Recognition!
              </button>
            </div>
            <div className="text-left mt-4">
              <span className="text-gray-600 text-[0.9rem] md:text-lg">New User?</span>
              <span
                className="text-blue-600 cursor-pointer font-semibold ml-1 text-[0.9rem] md:text-lg"
                onClick={() => navigate("/register")}
              >
                Sign Up
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;


