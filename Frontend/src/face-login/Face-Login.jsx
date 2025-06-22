import React, { useRef, useState } from 'react'; 
import Webcam from 'react-webcam'; 
import v1 from "../assets/v1.png"; 
import Logo from "../assets/Logo.png"; 
import { useNavigate } from "react-router-dom"; 

const FaceLogin = () => {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');


  const captureAndLogin = async () => {
    if (!webcamRef.current) return;

    const screenshot = webcamRef.current.getScreenshot();
    if (!screenshot) {
      setMessage('Unable to capture image');
      return;
    }

    if (!email) {
      setMessage('Please enter your email');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Convert base64 to blob
      const blob = await (await fetch(screenshot)).blob();

      // Prepare form data
      const formData = new FormData();
      formData.append('image', blob, 'capture.jpg');
      formData.append('email', email.trim().toLowerCase());

      const response = await fetch('http://192.168.15.142:8000/face_recog', {
        method: 'POST',
        body: formData,
      });
      

      const data = await response.json();
      if (response.ok) {
        setMessage(`✅ ${data.message || 'Login successful'}`);
        // You can also navigate to dashboard or home here
        setTimeout(() => {
    navigate('/home');
  }, 1500); 
      } else {
        setMessage(`❌ ${data.message || 'Login failed'}`);
      }
    } catch (error) {
      setMessage('❌ Error connecting to server');
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div className="flex h-screen font-sans">
      {/* Left */}
      <div className="w-1/2 bg-gradient-to-b from-[#002F6C] to-[#003366] text-white flex flex-col justify-center items-center p-10">
        <h1 className="text-7xl font-bold mb-10 text-left w-full">Welcome<br />Back!</h1>
        <div className="w-72">
          <img src={v1} alt="Illustration" />
        </div>
      </div>

      {/* Right */}
      <div className="w-1/2 bg-[#B3D4F1] p-10 flex flex-col justify-center">
        <div className="mb-6 text-right">
          <img src={Logo} alt="Logo" className="h-24 inline-block" />
        </div>

        <h2 className="text-4xl font-bold mb-3">Login</h2>
        <p className="text-gray-600 mb-6">Welcome Back! Please login to your account.</p>

        <label className="text-gray-700 mb-1 block">User Email</label>
        <input
          type="email"
          placeholder="testmail@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded border mb-6"
        />

        {/* Webcam */}
       <div className="w-full max-w-2xl aspect-[4/3] mb-6 bg-black flex justify-center items-center rounded overflow-hidden mx-auto">
  <Webcam
    audio={false}
    ref={webcamRef}
    screenshotFormat="image/jpeg"
    videoConstraints={{
      width: 640,
      height: 480,
      facingMode: 'user',
    }}
    className="w-full h-full object-contain"
  />
</div>

        <button
          className="w-full bg-[#174C8C] text-white py-3 rounded mb-4"
          onClick={captureAndLogin}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {message && (
          <div className="text-center text-sm text-gray-700 mb-4">{message}</div>
        )}

        <div className="text-center text-gray-500 mb-4">OR</div>
        <button 
          onClick={() => navigate("/login")}
          className="w-full bg-[#174C8C] text-white py-3 rounded font-bold"
        >
          Login using Password!
        </button>

        <div className="text-left mt-4">
          <span className="text-gray-600 text-[0.9rem] md:text-lg">New User?</span>
          <span
            className="text-blue-600 cursor-pointer font-semibold ml-1 text-[0.9rem] md:text-lg"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </span>
        </div>
      </div>
    </div>
  );
};

export default FaceLogin;
