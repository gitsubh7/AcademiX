import React from "react";
import v1 from "../assets/v1.png";
import logo from "../assets/logo.png";

const Login = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">

      <div className="hidden md:flex w-1/2 bg-gradient-to-r from-[#00255A] to-[#084297] p-10 flex-col justify-between items-center relative">
      <div className="absolute top-20 left-10 text-white">
        <h1 className="text-5xl lg:text-7xl font-bold">Welcome</h1>
        <h1 className="text-5xl lg:text-7xl font-bold">Back!</h1>
      </div>
      </div>

      <div className="flex flex-col w-full md:w-1/2 justify-center items-center bg-[#CEE5F5] px-10 py-10 md:px-20 relative">
        <div className="absolute right-2 top-2 md:right-8 md:top-8">
          <img src={logo} alt="Logo" className="w-14 md:w-16 lg:w-20" />
        </div>

        <div className="w-full">
          <h1 className="text-[1.6rem] md:text-4xl font-bold mb-4 text-left">Login</h1>
          <p className="text-gray-600 mb-6 text-[0.9rem] md:text-lg">Welcome Back! Please login to your account.</p>

          <form className="space-y-6">
            <div>
              <label className="block text-gray-700 text-[0.9rem] md:text-lg">User Name</label>
              <input
                type="email"
                placeholder="testmail@gmail.com"
                className="w-full p-3 border border-gray-400 rounded-lg text-[0.9rem] md:text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-[0.9rem] md:text-lg">Password</label>
              <input
                type="password"
                placeholder="************"
                className="w-full p-3 border border-gray-400 rounded-lg text-[0.9rem] md:text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div className="text-right text-blue-600 cursor-pointer text-[0.9rem] md:text-lg">Forgot Password?</div>

            <div className="flex flex-col space-y-4">
              <button
                type="submit"
                className="w-full bg-[#1B4F83] text-white py-3 rounded-lg text-[0.9rem] md:text-lg font-semibold hover:bg-[#163b6a] transition-all"
              >
                Login
              </button>
              <div className="flex items-center justify-center text-gray-600 font-semibold">
                <hr className="w-1/3 border-gray-400" />
                <span className="mx-4">OR</span>
                <hr className="w-1/3 border-gray-400" />
              </div>
              <button
                className="w-full bg-[#1B4F83] text-white py-3 rounded-lg text-[0.9rem] md:text-lg font-semibold hover:bg-[#163b6a] transition-all"
              >
                Login using Facial Recognition!
              </button>
            </div>

            <div className="text-left mt-4">
              <span className="text-gray-600 text-[0.9rem] md:text-lg">New User?</span>
              <span className="text-blue-600 cursor-pointer font-semibold ml-1 text-[0.9rem] md:text-lg">Sign Up</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;










