import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {useUserContext} from "../context/userContext.jsx";
import v2 from "../assets/v2.png";
import logo from "../assets/Logo.png";

const SignUp = () => {
  const navigate = useNavigate();
  const {registerUser,userState,handlerUserInput} = useUserContext();
  const {name,email,degree,department,section,password,roll_number,bio,year,passout_year,phone_number,subjects_enrolled,image_url} = userState;
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen">
      {/* Left Section (Sign-Up Form) */}
      <div className="w-full md:w-1/2 bg-gradient-to-b from-[#00255A] to-[#013580] p-10 md:p-20 flex flex-col justify-center text-white">
        <div className="flex items-center justify-between mb-6 md:hidden">
          <h1 className="text-4xl font-bold">Welcome to AcademiX</h1>
          <img src={logo} alt="Logo" className="w-16" />
        </div>

        <h1 className="text-3xl md:text-5xl font-bold mb-6 text-center md:text-left">Sign Up</h1>
        <form onSubmit={registerUser} className="space-y-4 md:space-y-6">
          <div>
            <label className="block text-sm md:text-base">Full Name</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={handlerUserInput("name")}
              className="w-full p-2 rounded-md border border-white/50 text-white bg-transparent placeholder-gray-300"
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <label className="block text-sm md:text-base">Email Address</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handlerUserInput("email")}
              className="w-full p-2 rounded-md border border-white/50 text-white bg-transparent placeholder-gray-300"
              placeholder="Your email"
              required
            />
          </div>
          <div>
            <label className="block text-sm md:text-base">Degree</label>
            <input
              type="text"
              name="degree"
              value={degree}
              onChange={handlerUserInput("degree")}
              className="w-full p-2 rounded-md border border-white/50 text-white bg-transparent placeholder-gray-300"
              placeholder="Your degree"
            />
          </div>

          <div>
            <label className="block text-sm md:text-base">Department</label>
            <select
              name="department"
              value={department}
              onChange={handlerUserInput("department")}
              className="w-full p-2 rounded-md border border-white/50 text-black bg-white"
            >
              <option value="">Select Department</option>
              <option value="Computer Science and Engineering">Computer Science and Engineering</option>
              <option value="Electronics and Communication Engineering">Electronics and Communication Engineering</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
            </select>
          </div>
          <div>
            <label className="block text-sm md:text-base">Section</label>
            <select
              name="section"
              value={section} 
              onChange={handlerUserInput("section")}
              className="w-full p-2 rounded-md border border-white/50 text-black bg-white"
            >
            <option value="">Select Section</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            </select>
          </div>
          <div className="relative">
            <label className="block text-sm md:text-base">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={handlerUserInput("password")}
              className="w-full p-2 rounded-md border border-white/50 text-white bg-transparent placeholder-gray-300"
              placeholder="Your password"
              required
            />
            <button
              type="button"
              className="absolute right-2 top-8 text-white"
              onClick={togglePassword}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
          <div>
            <label className="block text-sm md:text-base">Roll Number</label>
            <input
              type="text"
              name="roll_number"
              value={roll_number}
              onChange={handlerUserInput("roll_number")}
              className="w-full p-2 rounded-md border border-white/50 text-white bg-transparent placeholder-gray-300"
              placeholder="Your roll number"
            />
          </div>
          <div>
            <label className="block text-sm md:text-base">Bio</label>
            <textarea
              name="bio"
              value={bio}
              onChange={handlerUserInput("bio")}
              className="w-full p-2 rounded-md border border-white/50 text-white bg-transparent placeholder-gray-300"
              placeholder="Bio"
            />
          </div>
          <div>
            <label className="block text-sm md:text-base">Year</label>
            <select
              name="year"
              value={year} 
              onChange={handlerUserInput("year")}
              className="w-full p-2 rounded-md border border-white/50 text-black bg-white"
            >
            <option value="">Select Year</option>
            <option value="1st">1st</option>
            <option value="2nd">2nd</option>
            <option value="3rd">3rd</option>
            <option value="4th">4th</option>
            <option value="5th">5th</option>
            </select>
          </div>
          <div>
            <label className="block text-sm md:text-base">Graduation Year</label>
           <input
                type="text"
                name="passout_year"
                value={passout_year}
                onChange={handlerUserInput("passout_year")}
                className="w-full p-2 rounded-md border border-white/50 text-white bg-transparent placeholder-gray-300"
                placeholder="Your passout year"
              />
          </div>

          <div>
            <label className="block text-sm md:text-base">Phone Number</label>
            <input
              type="text"
              name="phone_number"
              value={phone_number}
              onChange={handlerUserInput("phone_number")}
              className="w-full p-2 rounded-md border border-white/50 text-white bg-transparent placeholder-gray-300"
              placeholder="Your phone number"
            />
           </div>
           <div>
            <label className="block text-sm md:text-base">Subjects Enrolled</label>
            <input
              type="text"
              name="subjects_enrolled"
              value={subjects_enrolled} 
              onChange={handlerUserInput("subjects_enrolled")}
              className="w-full p-2 rounded-md border border-white/50 text-white bg-transparent placeholder-gray-300"
              placeholder="e.g., CS101, MA102, PH103"
            />
          </div>
          <div>
            <label className="block text-sm md:text-base">Upload Passport-Size Photo</label>
            <div className="relative w-full">
              <input
                type="file"
                accept="image/*"
                onChange={handlerUserInput("image_url")}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex items-center justify-between p-2 rounded-md border border-white/50 bg-transparent text-white cursor-pointer">
                {image_url ? image_url.name : "Choose Photo"}
              </div>
            </div>
            {image_url && (
              <img
                src={URL.createObjectURL(image_url)}
                alt="Preview"
                className="w-20 h-20 object-cover mt-2 rounded-full"
              />
            )}
          </div>
          <button
            type="submit"
            disabled={!name || !email || !password}
            className="w-full bg-gray-300 text-[#001B41] font-bold p-2 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Sign Up
          </button>

          <p className="text-center text-gray-300">
            Already have an account?{" "}
            <button
              type="button"
              className="text-white font-bold cursor-pointer hover:underline"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </p>
        </form>
      </div>

      <div className="hidden md:flex md:w-1/2 bg-[#CEE5F5] flex-col justify-center items-center text-[#00255A] p-10 relative">
        <h1 className="text-5xl lg:text-7xl font-bold absolute top-20 left-10">Welcome to AcademiX!</h1>
        <img src={v2} alt="Students" className="w-2/3 mt-6" />
        <img src={logo} alt="Logo" className="absolute top-8 right-8 w-20" />
      </div>
    </div>
  );
};

export default SignUp;




