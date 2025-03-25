import React, { useState } from "react";
import v2 from "../assets/v2.png";
import logo from "../assets/logo.png";

const SignUp = () => {
  const [photo, setPhoto] = useState(null);

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen">
      {/* Left Section (Sign-Up Form) */}
      <div className="w-full md:w-1/2 bg-gradient-to-b from-[#00255A] to-[#013580] p-10 md:p-20 flex flex-col justify-center text-white">
        <div className="flex items-center justify-between mb-6 md:hidden">
          <h1 className="text-4xl font-bold">Welcome to AcademiX</h1>
          <img src={logo} alt="Logo" className="w-16" />
        </div>

        <h1 className="text-3xl md:text-5xl font-bold mb-6 text-center md:text-left">Sign Up</h1>

        <form className="space-y-4 md:space-y-6">
          <div>
            <label className="block text-sm md:text-base">Full Name</label>
            <input
              type="text"
              className="w-full p-2 rounded-md border border-white/50 text-white bg-transparent placeholder-gray-300"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm md:text-base">Email Address</label>
            <input
              type="email"
              className="w-full p-2 rounded-md border border-white/50 text-white bg-transparent placeholder-gray-300"
              placeholder="Your email"
            />
          </div>
          <div>
            <label className="block text-sm md:text-base">Degree</label>
            <input
              type="text"
              className="w-full p-2 rounded-md border border-white/50 text-white bg-transparent placeholder-gray-300"
              placeholder="Your degree"
            />
          </div>
          <div>
            <label className="block text-sm md:text-base">Department</label>
            <select className="w-full p-2 rounded-md border border-white/50 text-black bg-transparent placeholder-gray-300">
              <option>Select Department</option>
              <option>Computer Science</option>
              <option>Electronics</option>
              <option>Mechanical</option>
            </select>
          </div>
          <div>
            <label className="block text-sm md:text-base">Section</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input type="radio" name="section" className="mr-2" /> A
              </label>
              <label className="flex items-center">
                <input type="radio" name="section" className="mr-2" /> B
              </label>
              <label className="flex items-center">
                <input type="radio" name="section" className="mr-2" /> C
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm md:text-base">Roll Number</label>
            <input
              type="text"
              className="w-full p-2 rounded-md border border-white/50 text-white bg-transparent placeholder-gray-300"
              placeholder="Your roll number"
            />
          </div>
          <div>
            <label className="block text-sm md:text-base">Semester</label>
            <select className="w-full p-2 rounded-md border border-white/50 text-black bg-transparent placeholder-gray-300">
              <option>Select Semester</option>
              <option>1st</option>
              <option>2nd</option>
              <option>3rd</option>
            </select>
          </div>
          <div>
            <label className="block text-sm md:text-base">Graduation Year</label>
            <input
              type="text"
              className="w-full p-2 rounded-md border border-white/50 text-white bg-transparent placeholder-gray-300"
              placeholder="Your passout year"
            />
          </div>
          <div>
            <label className="block text-sm md:text-base">Phone Number</label>
            <input
              type="text"
              className="w-full p-2 rounded-md border border-white/50 text-white bg-transparent placeholder-gray-300"
              placeholder="Your phone number"
            />
          </div>
          <div>
            <label className="block text-sm md:text-base">Bio</label>
            <textarea
              className="w-full p-2 rounded-md border border-white/50 text-white bg-transparent placeholder-gray-300"
              placeholder="Tell us about yourself"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm md:text-base">Subjects Enrolled</label>
            <input
              type="text"
              className="w-full p-2 rounded-md border border-white/50 text-white bg-transparent placeholder-gray-300"
              placeholder="Your subjects"
            />
          </div>
          <div>
            <label className="block text-sm md:text-base">Upload Passport-Size Photo</label>
            <div className="relative w-full">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex items-center justify-between p-2 rounded-md border border-white/50 bg-transparent text-white cursor-pointer">
                {photo ? "Photo Selected" : "Choose Photo"}
              </div>
            </div>
            {photo && <img src={photo} alt="Preview" className="mt-4 w-32 h-32 object-cover rounded-md" />}
          </div>

          <button className="w-full bg-gray-300 text-[#001B41] font-bold p-2 rounded-md">
            Sign Up
          </button>

          <p className="text-center text-gray-300">
            Already have an account?{' '}
            <span className="text-white font-bold cursor-pointer">Login</span>
          </p>
        </form>
      </div>
      
      <div className="hidden md:flex md:w-1/2 bg-[#CEE5F5] flex-col justify-center items-center text-[#00255A] p-10 relative">
      <div className="absolute top-20 left-10">
        <h1 className="text-5xl lg:text-7xl font-bold">Welcome to</h1>
        <h1 className="text-5xl lg:text-7xl font-bold">AcademiX!</h1>
      </div>
        <img src={v2} alt="Students" className="w-2/3 mt-6" />
        <img src={logo} alt="Logo" className="absolute top-8 right-8 w-20" />
      </div>
    </div>
  );
};

export default SignUp;


