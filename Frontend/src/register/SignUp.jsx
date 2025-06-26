import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/userContext.jsx";
import v2 from "../assets/v2.png";
import logo from "../assets/Logo.png";
import axios from "axios";

const SignUp = () => {
  const navigate = useNavigate();
  const { userState, handlerUserInput, resetUserState } = useUserContext();

  /** 🔹 NEW: keep the real File locally */
  const [photoFile, setPhotoFile]   = useState(null);
  const [photoPreview, setPreview]  = useState(null);

  const [inputReady, setInputReady] = useState(false);
  useEffect(() => { resetUserState(); setTimeout(() => setInputReady(true), 50); }, []);

  const {
    name, email, degree, department, section, password,
    roll_number, bio, year, passout_year, phone_number,
    subjects_enrolled                       // keep as comma list in context
  } = userState;

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(!showPassword);

  /* -----------------------------  SUBMIT  ----------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    // 1️⃣ scalar fields
    Object.entries({
      name, email, degree, department, section, password,
      roll_number, bio, year, passout_year, phone_number
    }).forEach(([k, v]) => formData.append(k, v));

    // 2️⃣ subjects_enrolled → array
    subjects_enrolled
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((s) => formData.append("subjects_enrolled", s));

    // 3️⃣ image as real File
    if (photoFile) formData.append("image_url", photoFile);

    try {
      await axios.post(
        "http://localhost:3000/api/v1/student/register",
        formData            // let axios add the multipart boundary
      );
      navigate("/login");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Registration failed");
    }
  };
  const baseInput =
    "w-full bg-transparent text-white placeholder-white/60 " +
    "border border-white/30 rounded-md px-4 py-2 " +
    "focus:outline-none focus:border-white/70 focus:ring-2 focus:ring-white/60";

  /* same but with extra right padding for the eye icon */
  const pwdInput = baseInput + " pr-10";

  /* dropdown classes */
  const selectInput =
    baseInput + " appearance-none pr-10";

  /* inline SVG arrow in white for <select> */
  const whiteArrow = {
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='white' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 10l5 5 5-5H7z'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 0.75rem center",
    backgroundSize: "0.8rem",
  };


 return (
    <div className="flex flex-col md:flex-row w-full min-h-screen">
      {/* -------------------- LEFT / FORM SIDE -------------------- */}
      <div className="w-full md:w-1/2 bg-gradient-to-b from-[#00255A] to-[#013580] p-10 md:p-20 flex flex-col justify-center text-white">

        {/* Mobile header */}
        <div className="flex items-center justify-between mb-6 md:hidden">
          <h1 className="text-4xl font-bold">Welcome to AcademiX</h1>
          <img src={logo} alt="logo" className="w-16" />
        </div>

        <h1 className="text-3xl md:text-5xl font-bold mb-8 md:mb-10 text-center md:text-left">
          Sign Up
        </h1>

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-6">
          {/* ---------- Name ---------- */}
          <div>
            <label htmlFor="name" className="block text-sm mb-1">Name</label>
            <input id="name" type="text" value={name}
                   onChange={handlerUserInput("name")}
                   className={baseInput} required />
          </div>

          {/* ---------- Email ---------- */}
          <div>
            <label htmlFor="email" className="block text-sm mb-1">Email</label>
            <input id="email" type="email" value={email} readOnly={!inputReady}
                   onChange={handlerUserInput("email")}
                   className={baseInput} required />
          </div>

          {/* ---------- Degree ---------- */}
          <div>
            <label htmlFor="degree" className="block text-sm mb-1">Degree</label>
            <select id="degree" value={degree}
                    onChange={handlerUserInput("degree")}
                    className="w-full bg-white text-black text-sm rounded-md px-4 py-2 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/60"
>
              <option value="">Select Degree</option>
              <option value="B.Tech">B.Tech</option>
              <option value="M.Tech">M.Tech</option>
              <option value="BCA">BCA</option>
              <option value="Phd">PhD</option>
            </select>
          </div>

          {/* ---------- Department ---------- */}
          <div>
            <label htmlFor="department" className="block text-sm mb-1">Department</label>
            <select id="department" value={department}
                    onChange={handlerUserInput("department")}
                    className="w-full bg-white text-black text-sm rounded-md px-4 py-2 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/60"
>
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
              <option value="Civil Engineering">Civil Engineering</option>
            </select>
          </div>

          {/* ---------- Section ---------- */}
          <div>
            <label htmlFor="section" className="block text-sm mb-1">Section</label>
            <select id="section" value={section}
                    onChange={handlerUserInput("section")}
                    className="w-full bg-white text-black text-sm rounded-md px-4 py-2 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/60"
>
              <option value="">Select Section</option>
              <option value="1">A</option>
              <option value="2">B</option>
              <option value="3">C</option>
            </select>
          </div>

          {/* ---------- Password ---------- */}
          <div>
            <label htmlFor="password" className="block text-sm mb-1">Password</label>
            <div className="relative">
              <input id="password"
                     type={showPassword ? "text" : "password"}
                     value={password} readOnly={!inputReady}
                     onChange={handlerUserInput("password")}
                     className={pwdInput} required />
              <button type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white text-sm">
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          {/* ---------- Roll Number ---------- */}
          <div>
            <label htmlFor="roll_number" className="block text-sm mb-1">Roll Number</label>
            <input id="roll_number" type="text" value={roll_number}
                   onChange={handlerUserInput("roll_number")}
                   className={baseInput} />
          </div>

          {/* ---------- Semester ---------- */}
          <div>
            <label htmlFor="year" className="block text-sm mb-1">Year</label>
            <select id="year" value={year}
                    onChange={handlerUserInput("year")}
                    className="w-full bg-white text-black text-sm rounded-md px-4 py-2 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/60"
>
              <option value="">Select Year</option>
              <option value="1st">1st</option>
              <option value="2nd">2nd</option>
              <option value="3rd">3rd</option>
              <option value="4th">4th</option>
              <option value="5th">5th</option>
            </select>
          </div>

          {/* ---------- Passout Year ---------- */}
          <div>
            <label htmlFor="passout_year" className="block text-sm mb-1">Passout Year</label>
            <input id="passout_year" type="text" value={passout_year}
                   onChange={handlerUserInput("passout_year")}
                   className={baseInput} />
          </div>

          {/* ---------- Phone ---------- */}
          <div>
            <label htmlFor="phone_number" className="block text-sm mb-1">Phone Number</label>
            <input id="phone_number" type="text" value={phone_number}
                   onChange={handlerUserInput("phone_number")}
                   className={baseInput} />
          </div>

          {/* ---------- Bio ---------- */}
          <div>
            <label htmlFor="bio" className="block text-sm mb-1">Bio</label>
            <textarea id="bio" rows={4} value={bio}
                      onChange={handlerUserInput("bio")}
                      className={baseInput + " resize-none"} />
          </div>

          {/* ---------- Subjects ---------- */}
          <div>
            <label htmlFor="subjects_enrolled" className="block text-sm mb-1">Subject Enrolled</label>
            <input id="subjects_enrolled" type="text" value={subjects_enrolled}
                   onChange={handlerUserInput("subjects_enrolled")}
                   className={baseInput}
                   placeholder="e.g. CS101, MA102" />
          </div>

          {/* ---------- Photo Upload ---------- */}
          <div>
            <label className="block text-sm mb-1">Passport-size Photograph</label>
            <div className="relative">
              <input type="file" accept="image/*"
                     onChange={(e) => {
                       const file = e.target.files?.[0];
                       if (!file) return;
                       setPhotoFile(file);
                       setPreview(URL.createObjectURL(file));
                     }}
                     className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <div
                className={
                  baseInput +
                  " !border-dashed flex items-center justify-between cursor-pointer"
                }>
                {photoFile ? photoFile.name : "Choose Photo"}
              </div>
            </div>
            {photoPreview && (
              <img src={photoPreview} alt="preview"
                   className="w-20 h-20 object-cover mt-2 rounded-full border border-white/30" />
            )}
          </div>

          {/* ---------- Submit ---------- */}
          <button type="submit"
                  className="w-full bg-gray-200/90 text-[#001B41] font-bold py-2 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50">
            Sign Up
          </button>

          {/* ---------- Login link ---------- */}
          <p className="text-center text-gray-300">
            Already have an account?{" "}
            <button type="button"
                    onClick={() => navigate("/login")}
                    className="text-white font-bold hover:underline">
              Login
            </button>
          </p>
        </form>
      </div>

      {/* -------------------- RIGHT / ILLUSTRATION SIDE -------------------- */}
     <div className="hidden md:flex md:w-1/2 bg-[#B3D4F1] flex-col justify-center items-center text-[#00255A] p-10 relative">
  {/* Logo in top-right */}
  <img src={logo} alt="logo" className="absolute top-8 right-8 w-20" />

  {/* Horizontally centered, vertically same as before */}
  <h1 className="text-5xl lg:text-7xl font-bold absolute top-20 left-1/2 transform -translate-x-1/2 text-center">
    Welcome to AcademiX!
  </h1>

  {/* Uplifted image */}
  <img src={v2} alt="students" className="w-2/3 mt-2" />
</div>


    </div>
  );
};

export default SignUp;
