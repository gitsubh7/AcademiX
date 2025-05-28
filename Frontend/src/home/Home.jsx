import React, { useState } from "react";
import Logo from"../assets/Logo.png";
import Leet from"../assets/Leet.png";
import Geek from"../assets/Geek.png";
import Code from"../assets/Code.png";

const Button = ({ children, className = "", onClick, type = "button" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-[#0C1D4F] hover:bg-[#AAD0E9] text-white hover:text-black font-semibold py-1 px-3 rounded ${className}`}
    >
      {children}
    </button>
  );
};

const AddClassForm = ({ onClose }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#0C1D4F] text-white p-6 rounded-lg w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Add Class to Calendar</h2>
        <form className="flex flex-col gap-3">
          {["Subject Name", "Subject Code", "Classroom", "Professor", "Start Time", "End Time"].map((label, idx) => (
            <label key={idx} className="flex flex-col">
              <span className="mb-1">{label}</span>
              <input
                type={label.toLowerCase().includes("time") ? "time" : "text"}
                name={label.toLowerCase().replace(" ", "")}
                className="p-2 rounded text-white bg-transparent border border-white"
              />
            </label>
          ))}
          <Button type="submit" className="mt-4 bg-[#0C1D4F] w-full py-2">ADD</Button>
          <Button onClick={onClose} className="mt-2 bg-red-500 text-white w-full py-2">Cancel</Button>
        </form>
      </div>
    </div>
  );
};

const AcademiXDashboard = () => {
  const [activePage, setActivePage] = useState("Dashboard");
  const [showAddClass, setShowAddClass] = useState(false);

  const renderMainContent = () => {
    switch (activePage) {
      case "Dashboard":
        return (
          <div>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold text-[#0C1D4F]  ">Welcome to AcademiX!</h1>
                <p className="mt-4 text-lg">Hey, <span className="font-semibold text-black">User name!</span><br />Welcome Back!</p>
              </div>
              <div className="flex flex-col items-end">
                <div className="bg-[#2D2F92] text-white rounded-xl p-4 w-48 text-center">
                  <p className="text-sm">Weather</p>
                  <p className="text-lg font-bold">Sunny</p>
                  <p className="text-4xl font-bold">36°</p>
                  <p className="text-xs mt-2">15:33 MON 04-11</p>
                  <p className="text-xs">Bihta, Bihar</p>
                </div>
                <div className="mt-2 text-black text-sm">User name</div>
              </div>
            </div>
            <p className="mt-6 italic">Never miss a beat—track your attendance with ease ✅</p>

            <div className="flex gap-4 mt-6">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="bg-white p-4 rounded-xl shadow w-40 text-center">
                  <h3 className="text-sm font-semibold">Wireless Tech</h3>
                  <p className="text-sm mt-2">10/15</p>
                  <div className="w-16 h-16 border-4 border-black rounded-full mx-auto mt-4 flex items-center justify-center">
                    <span className="text-lg font-bold">66%</span>
                  </div>
                  <div className="flex justify-center gap-2 mt-4">
                    <Button className="bg-blue-400 text-black w-6 h-6 p-0">+</Button>
                    <Button className="bg-blue-400 text-black w-6 h-6 p-0">-</Button>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-10 italic">Stay ahead, Add Class to Calendar—No Stress! 📝</p>
            <Button onClick={() => setShowAddClass(true)} className="mt-4 bg-[#0C1D4F] rounded-xl px-6 py-3 text-lg">
              Add Class To Calendar
            </Button>
          </div>
        );

      case "Coding Profiles":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Coding Profiles</h2>
            <div className="flex gap-4">
              {[{ img: Leet, name: "LeetCode" }, { img: Geek, name: "GeeksforGeeks" }, { img: Code, name: "Codeforces" }].map(profile => (
                <div key={profile.name} className="bg-[#202060] text-white rounded-lg p-4 w-52 text-center">
                  <img src={profile.img} alt={profile.name} className="w-24 h-24 mx-auto mb-2" />
                  <div className="text-sm">
                    <p>No. of Questions:-</p>
                    <p>No. of Contests:-</p>
                    <p>Rating:-</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-8 italic">Leaderboard unlocked! Are you #1? 🔥</p>
            <div className="grid grid-cols-2 gap-6 mt-4">
              <div>
                <h3 className="font-semibold">LeetCode</h3>
                <div className="mt-2 bg-white rounded-xl p-2">1. 👤 User Name</div>
              </div>
              <div>
                <h3 className="font-semibold">CodeForces</h3>
                <div className="mt-2 bg-white rounded-xl p-2">1. 👤 User Name</div>
              </div>
            </div>
          </div>
        );

      case "College Docs":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Upload Your Documents</h2>
            <div className="flex gap-6">
              <div className="border border-gray-400 rounded-xl p-6 flex flex-col items-center w-48">
                <div className="bg-[#202060] w-12 h-16 mb-3"></div>
                <p className="font-medium">Grade Card</p>
                <p className="text-sm text-gray-500">4 Apr 2025</p>
                <button className="mt-2 text-blue-700 text-xs underline">Download</button>
              </div>
              <div className="border border-gray-400 rounded-xl p-6 flex flex-col items-center w-48">
                <div className="bg-[#202060] w-12 h-12 rounded-full mb-3"></div>
                <Button className="bg-[#0C1D4F] text-white mt-2">Add More</Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen">
      {showAddClass && <AddClassForm onClose={() => setShowAddClass(false)} />}

      {/* Sidebar */}
      <aside className="bg-[#0C1D4F] text-white w-64 p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <img src={Logo} alt="Logo" className="w-24 h-24" />
            <h1 className="text-2xl font-bold text-[#55A2D3]">AcademiX</h1>
          </div>
          <nav className="flex flex-col gap-4">
            {["Dashboard", "Add Attendance", "Coding Profiles", "College Docs"].map(btn => (
              <Button key={btn} className="justify-start" onClick={() => setActivePage(btn)}>
                {btn}
              </Button>
            ))}
          </nav>
        </div>
        <Button className="text-white">Logout</Button>
      </aside>

      {/* Main */}
      <main className="flex-1 bg-[#B3D5E1] p-8 overflow-auto">
        {renderMainContent()}
      </main>
    </div>
  );
};

export default AcademiXDashboard;
