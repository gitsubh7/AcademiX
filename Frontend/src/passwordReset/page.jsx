import React, { useState } from "react";
import { useUserContext } from "../context/userContext.jsx";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";

const ResetPass = () => {
  const { resetPassword } = useUserContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const id = searchParams.get("id");
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!id || !token) {
    console.error("Invalid reset link");
    return <p className="text-center mt-4 text-red-500">Invalid or expired link.</p>;
  }

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      await resetPassword(id, token, password);
      toast.success("Password reset successful!");
      navigate("/login");
    } catch (error) {
      toast.error("Failed to reset password. Try again!");
    }
  };

  return (
    <div className="bg-[#00255A] w-full min-h-screen flex justify-center items-center p-4">
      <form 
        onSubmit={handleSubmit} 
        className="bg-[#CEE5F5] m-[2rem] px-6 py-10 sm:px-10 sm:py-14 rounded-lg max-w-[520px] w-full shadow-lg"
      >
        <div className="relative z-10">
          <h1 className="mb-6 text-center text-xl sm:text-[1.35rem] font-semibold text-gray-800">
            Reset Your Password
          </h1>

          <div className="mb-4 relative">
            <label htmlFor="password" className="block mb-2 text-gray-800 font-medium">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                placeholder="*********"
                className="w-full px-4 py-3 border-2 border-gray-400 rounded-md text-gray-900 focus:outline-none focus:border-[#1B4F83] focus:ring-1 focus:ring-[#1B4F83]"
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

          <div className="mb-4 relative">
            <label htmlFor="confirmPassword" className="block mb-2 text-gray-800 font-medium">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                id="confirmPassword"
                placeholder="*********"
                className="w-full px-4 py-3 border-2 border-gray-400 rounded-md text-gray-900 focus:outline-none focus:border-[#1B4F83] focus:ring-1 focus:ring-[#1B4F83]"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                onClick={toggleConfirmPassword}
              >
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              type="submit"
              className="flex-1 px-4 py-3 font-bold bg-[#1B4F83] text-white rounded-md hover:bg-[#00255A] transition-colors disabled:opacity-70"
            >
              Reset Password
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ResetPass;