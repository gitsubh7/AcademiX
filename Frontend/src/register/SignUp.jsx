import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/userContext.jsx";
import v2 from "../assets/v2.png";
import logo from "../assets/Logo.png";
import axios from "axios";

const SignUp = () => {
  const navigate = useNavigate();
  const { userState, handlerUserInput, resetUserState } = useUserContext();
  const [inputReady, setInputReady] = useState(false);

  useEffect(() => {
    resetUserState();
    setTimeout(() => setInputReady(true), 50);
  }, []);

  const {
    name,
    email,
    degree,
    department,
    section,
    password,
    roll_number,
    bio,
    year,
    passout_year,
    phone_number,
    subjects_enrolled,
    image_url,
  } = userState;

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("degree", degree);
    formData.append("department", department);
    formData.append("section", section);
    formData.append("password", password);
    formData.append("roll_number", roll_number);
    formData.append("bio", bio);
    formData.append("year", year);
    formData.append("passout_year", passout_year);
    formData.append("phone_number", phone_number);

    subjects_enrolled
      .split(",")
      .map((subj) => subj.trim())
      .forEach((subj) => formData.append("subjects_enrolled", subj));

    if (image_url) {
      formData.append("image_url", image_url);
    }

    try {
      const res = await axios.post("http://localhost:3000/api/v1/student/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Registered successfully:", res.data);
      navigate("/login");
    } catch (err) {
      console.error("Registration failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen">
      <div className="w-full md:w-1/2 bg-gradient-to-b from-[#00255A] to-[#013580] p-10 md:p-20 flex flex-col justify-center text-white">
        <div className="flex items-center justify-between mb-6 md:hidden">
          <h1 className="text-4xl font-bold">Welcome to AcademiX</h1>
          <img src={logo} alt="Logo" className="w-16" />
        </div>

        <h1 className="text-3xl md:text-5xl font-bold mb-6 text-center md:text-left">Sign Up</h1>

        <form onSubmit={handleSubmit} autoComplete="off" className="flex flex-col gap-4 md:gap-6 w-full">
          <input type="text" name="name" autoComplete="off" value={name} onChange={handlerUserInput("name")} className="input" placeholder="Full Name" required />
          <input  readOnly={!inputReady} type="email" name="email" autoComplete="off" value={email} onChange={handlerUserInput("email")} className="input" placeholder="Email" required />
          <select name="degree" value={degree} autoComplete="off" onChange={handlerUserInput("degree")} className="input text-black bg-white">
            <option value="">Degree</option>
            <option value="B.Tech">B.Tech</option>
            <option value="M.Tech">M.Tech</option>
            <option value="BCA">BCA</option>
            <option value="Phd">PhD</option>
          </select>
          <select name="department" value={department} onChange={handlerUserInput("department")} className="input text-black bg-white">
            <option value="">Select Department</option>
            <option value="Computer Science and Engineering">Computer Science and Engineering</option>
            <option value="Electronics and Communication Engineering">Electronics and Communication Engineering</option>
            <option value="Mechanical Engineering">Mechanical Engineering</option>
            <option value="Electrical Engineering">Electrical Engineering</option>
            <option value="Chemical Science and Technology">Chemical Science and Technology</option>
            <option value="Mathematics and Computing Technology">Mathematics and Computing Technology</option>
            <option value="Architecture & Planning">Architecture & Planning</option>
            <option value="Humanities & Social Science">Humanities & Social Sciences</option>
            <option value="Applied Physics and Materials Engineering">Applied Physics and Materials Engineering</option>
            <option value="civil Engineering">Civil Engineering</option>

          </select>

          <select name="section" value={section} onChange={handlerUserInput("section")} className="input text-black bg-white">
            <option value="">Select Section</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>

          <div className="relative">
            <input
             readOnly={!inputReady}
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              autoComplete="off"
              onChange={handlerUserInput("password")}
              className="input"
              placeholder="Password"
              required
            />
            <button type="button" onClick={togglePassword} className="absolute right-3 top-3 text-white text-sm">
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>

          <input type="text" name="roll_number" value={roll_number} onChange={handlerUserInput("roll_number")} className="input" placeholder="Roll Number" />
          <textarea name="bio" value={bio} onChange={handlerUserInput("bio")} className="input" placeholder="Bio" />

          <select name="year" value={year} onChange={handlerUserInput("year")} className="input text-black bg-white">
            <option value="">Select Year</option>
            <option value="1st">1st</option>
            <option value="2nd">2nd</option>
            <option value="3rd">3rd</option>
            <option value="4th">4th</option>
            <option value="5th">5th</option>
          </select>

          <input type="text" name="passout_year" value={passout_year} onChange={handlerUserInput("passout_year")} className="input" placeholder="Graduation Year" />
          <input type="text" name="phone_number" value={phone_number} onChange={handlerUserInput("phone_number")} className="input" placeholder="Phone Number" />
          <input type="text" name="subjects_enrolled" value={subjects_enrolled} onChange={handlerUserInput("subjects_enrolled")} className="input" placeholder="e.g., CS101, MA102" />

          <div>
            <label className="block text-sm md:text-base mb-1">Upload Passport-Size Photo</label>
            <div className="relative w-full">
              <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files[0];
    if (file) {
      handlerUserInput("image_url")({ target: { value: file } });
    }
  }}
  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
/>

              <div className="flex items-center justify-between p-2 rounded-md border border-white/50 bg-transparent text-white cursor-pointer">
                {image_url ? image_url.name : "Choose Photo"}
              </div>
            </div>
            {image_url instanceof Blob && (
  <img src={URL.createObjectURL(image_url)} alt="Preview" className="w-20 h-20 object-cover mt-2 rounded-full" />
)}

          </div>

          <button type="submit" className="w-full bg-gray-300 text-[#001B41] font-bold p-2 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50">
            Sign Up
          </button>

          <p className="text-center text-gray-300">
            Already have an account?{" "}
            <button type="button" className="text-white font-bold cursor-pointer hover:underline" onClick={() => navigate("/login")}>
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
