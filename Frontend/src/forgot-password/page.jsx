import React, { useEffect, useState } from "react";
import { useUserContext } from "../context/userContext.jsx";
import { useNavigate } from "react-router-dom";

const ForgotPass = () => {
  const { forgotPasswordEmail } = useUserContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Remove TypeScript syntax (React.ChangeEvent) for pure JSX file
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError("Please enter your email");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setIsLoading(true);
      await forgotPasswordEmail(email);
      setEmail("");
    } catch (err) {
      setError(err.message || "Failed to send reset link. Please try again.");
    } finally {
      setIsLoading(false);
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
            Enter email to reset password
          </h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
              {success}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-gray-800 font-medium">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              id="email"
              name="email"
              placeholder="your@email.com"
              className="w-full px-4 py-3 border-2 border-gray-400 rounded-md text-gray-900 focus:outline-none focus:border-[#1B4F83] focus:ring-1 focus:ring-[#1B4F83]"
              required
              autoComplete="email"
              disabled={isLoading}
            />
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

export default ForgotPass;
