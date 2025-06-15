import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import Logo from "../assets/Logo.png";
import Leet from "../assets/Leet.png";
import Gitlogo from"../assets/Gitlogo.png";
import Code from "../assets/Code.png";
import WeatherCard from "../WeatherSection/WeatherCard";
import { startGoogleLogin } from "../utils/googleAuth";
import { useUserContext } from "../context/userContext.jsx";

/*********************************
 *  SMALL RE‑USABLE BUTTON
 *********************************/
const Button = ({ children, className = "", onClick, type = "button", disabled = false }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`bg-[#0C1D4F] hover:bg-[#AAD0E9] text-white hover:text-black font-semibold py-1 px-3 rounded ${className}`}
  >
    {children}
  </button>
);

/*********************************
 *  ADD‑CLASS MODAL FORM
 *********************************/
function getAccessToken() {
  return localStorage.getItem("gAccess"); // wherever you store the Google access‑token
}
function getRefreshToken() {
  return localStorage.getItem("gRefresh") || "";
}

const AddClassForm = ({ onClose }) => {
  const [form, setForm] = useState({
    subject_name: "",
    subject_code: "",
    classroom: "",
    professor_name: "",
    start_time: "",
    end_time: "",
    day: "Monday", // default – Monday
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      // Build *absolute* ISO strings for Calendar API
      const nextDay = dayjs()
        .day({ Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 }[form.day])
        .hour(Number(form.start_time.split(":")[0]))
        .minute(Number(form.start_time.split(":")[1]))
        .second(0)
        .millisecond(0);
      const startDate = nextDay.isBefore(dayjs()) ? nextDay.add(7, "day") : nextDay;
      const startISO = startDate.toDate().toISOString();
      const endISO = startDate
        .hour(Number(form.end_time.split(":")[0]))
        .minute(Number(form.end_time.split(":")[1]))
        .toDate()
        .toISOString();
        const headers = { Authorization: `Bearer ${getAccessToken()}` };
const rToken  = getRefreshToken();
if (rToken) headers['x-refresh-token'] = rToken;
      await axios.post(
  "http://localhost:3000/api/v1/student/addClass",
  { ...form, start_time: startISO, end_time: endISO },
  { headers }
);
      setMsg("Event added to Google Calendar 🎉");
      if (!err) {
  setTimeout(() => onClose(), 1200);
}
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Something went wrong";
setMsg(errorMsg);
if (errorMsg.includes("Google token expired")) {
  setHasGoogleToken(false);
  localStorage.removeItem("gAccess");
  localStorage.removeItem("gRefresh");
  localStorage.removeItem("gExpires");
}

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-[#0C1D4F] text-white p-6 rounded-lg w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Add Class to Calendar</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {[
            ["Subject Name", "subject_name", "text"],
            ["Subject Code", "subject_code", "text"],
            ["Classroom", "classroom", "text"],
            ["Professor", "professor_name", "text"],
            ["Start Time", "start_time", "time"],
            ["End Time", "end_time", "time"],
          ].map(([label, name, type]) => (
            <label key={name} className="flex flex-col">
              <span className="mb-1">{label}</span>
              <input
                required
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                className="p-2 rounded bg-transparent border border-white focus:outline-none"
              />
            </label>
          ))}

          {/* DAY SELECTOR */}
          <label className="flex flex-col">
            <span className="mb-1">Day of Week</span>
            <select
              name="day"
              value={form.day}
              onChange={handleChange}
              className="p-2 rounded bg-transparent border border-white"
            >
              {[
                ["Monday", "Monday"],
                ["Tuesday", "Tuesday"],
                ["Wednesday", "Wednesday"],
                ["Thursday", "Thursday"],
                ["Friday", "Friday"],
                ["Saturday", "Saturday"],
                ["Sunday", "Sunday"],
              ].map(([val, label]) => (
                <option key={val} value={val} className="text-black">
                  {label}
                </option>
              ))}
            </select>
          </label>

          {/* SUBMIT / CANCEL BUTTONS */}
          <Button type="submit" disabled={loading} className="mt-4 w-full py-2">
            {loading ? "Adding…" : "ADD"}
          </Button>
          <Button onClick={onClose} className="mt-2 bg-red-500 text-white w-full py-2">
            Cancel
          </Button>

          {msg && <p className="text-center mt-2 text-sm">{msg}</p>}
        </form>
      </div>
    </div>
  );
};


/*********************************
 *  MAIN DASHBOARD COMPONENT
 *********************************/
const AcademiXDashboard = () => {
  const [activePage, setActivePage] = useState("Dashboard");
  const [showAddClass, setShowAddClass] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [docName, setDocName] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDocuments, setShowDocuments] = useState(false);
  const [deletingDocId, setDeletingDocId] = useState(null);
  const [hasGoogleToken, setHasGoogleToken] = useState(
   !!localStorage.getItem("gAccess") && !!localStorage.getItem("gRefresh")
  );
  // Keep Google‑connected state in sync across tabs / popup
useEffect(() => {
  function syncTokens() {
    setHasGoogleToken(
      !!localStorage.getItem("gAccess") &&
      !!localStorage.getItem("gRefresh")
    );
  }
  window.addEventListener("storage", syncTokens);  // fires when another tab writes to localStorage
  return () => window.removeEventListener("storage", syncTokens);
}, []);


  const handleGoogleConnect = async () => {
    try {
      await startGoogleLogin();
      setHasGoogleToken(true);
    } catch (err) {
      alert(err.message);     // or toast
    }
  };

  /************ AUTH & LOGOUT ************/
  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/v1/student/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Logout failed");
      window.location.href = "/login";
    } catch {
      setError("Logout failed. Please try again.");
    }
  };

  /************ DOCUMENT UPLOAD ************/
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setError("Please select a file");
    const formData = new FormData();
    formData.append("name", docName);
    formData.append("localDocument", file);
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("http://localhost:3000/api/v1/student/uploadDocument", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      setDocName("");
      setFile(null);
      fetchDocuments();
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("http://localhost:3000/api/v1/student/getAllDocuments", {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch documents");
      const data = await res.json();
      const formatted = (data?.message?.documents || []).map((d) => ({
        id: d._id,
        name: d.name,
        url: d.url,
      }));
      setDocuments(formatted);
    } catch {
      setError("Failed to load documents. Please try again.");
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (docId) => {
    try {
      setDeletingDocId(docId);
      const res = await fetch(`http://localhost:3000/api/v1/student/deleteDocument/${docId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete document");
      fetchDocuments();
    } catch (err) {
      setError(err.message || "Failed to delete document");
    } finally {
      setDeletingDocId(null);
    }
  };

  useEffect(() => {
    if (activePage !== "Dashboard") setShowDocuments(false);
  }, [activePage]);

  /************ UTIL ************/
  const getFileIcon = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();
    const icons = {
      pdf: "📄",
      doc: "📝", docx: "📝",
      ppt: "📊", pptx: "📊",
      xls: "📈", xlsx: "📈",
      png: "🖼️", jpg: "🖼️", jpeg: "🖼️", gif: "🖼️",
      zip: "🗜️", rar: "🗜️",
    };
    return icons[ext] || "📁";
  };
  const { userState } = useUserContext();
  const firstName = userState?.name?.split(" ")[0] || "there";

  const [leetData, setLeetData] = useState(null);
  const [githubData, setGithubData] = useState(null);
  const [codeforcesData, setCodeforcesData] = useState(null);

  useEffect(() => {
    if (activePage === "Coding Profiles") {
      Promise.all([
        axios.get("/api/v1/student/leetcode/<username>"),     // Replace <username> with actual username or use from context
        axios.get("/api/v1/student/github/<username>"),
        axios.get("/api/v1/student/codeforces/<username>"),
      ])
        .then(([leet, git, cf]) => {
          setLeetData(leet.data.data);
          setGithubData(git.data.data);
          setCodeforcesData(cf.data.data);
        })
        .catch((err) => console.error("Error fetching coding data", err));}
    },[activePage]);

  /************ MAIN CONTENT ************/
  const renderMainContent = () => {
    // === DOCUMENTS === //
    if (activePage === "Dashboard" && showDocuments) {
      return (
        <div>
          <h2 className="text-2xl font-bold mb-6">Uploaded Documents</h2>
          {loading && <p className="italic mb-4">Loading documents…</p>}
          {documents.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {documents.map((doc) => (
                <div key={doc.id} className="bg-white p-4 rounded-lg shadow flex flex-col justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getFileIcon(doc.name)}</span>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{doc.name}</h3>
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">
                        View / Download
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="text-red-500 text-sm hover:underline"
                    disabled={loading || deletingDocId === doc.id}
                  >
                    {deletingDocId === doc.id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No documents uploaded yet.</p>
          )}
        </div>
      );
    }

    // === DASHBOARD === //
    if (activePage === "Dashboard") {
      return (
        <div>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-[#0C1D4F]">Welcome to AcademiX!</h1>
              <p className="mt-4 text-lg">
                Hey, <span className="font-semibold">{firstName}</span>
                <br />Welcome Back!
              </p>
            </div>
            <WeatherCard city="bihta" />
          </div>

          <p className="mt-6 italic">Never miss a beat—track your attendance with ease ✅</p>
          <div className="flex gap-4 mt-6">
            {Array.from({ length: 5 }).map((_, i) => (
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
          <Button onClick={() => setShowAddClass(true)} className="rounded-xl px-6 py-3 text-lg mt-4" disabled={!hasGoogleToken}>
            Add Class To Calendar
          </Button>
          {!hasGoogleToken && (
        <Button onClick={handleGoogleConnect} className="rounded-xl px-6 py-3 text-lg mt-4">
          Connect Google Calendar
        </Button>
      )}
        </div>
      );
    }

    // === CODING PROFILES === //
    if (activePage === "Coding Profiles") {
      return (
     <div className="p-6 min-h-screen">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Coding Profiles
        </h2>

        <div className="bg-white p-6 rounded-xl shadow-md mb-10">
          <div className="flex justify-center gap-6">
            {[
              { img: Leet, name: "LeetCode" },
              { img: Gitlogo, name: "GitHub" },
              { img: Code, name: "Codeforces" },
            ].map((p) => (
              <div
                key={p.name}
                className="bg-[#202060] text-white rounded-xl p-4 w-52 text-center shadow-lg"
              >
                <img
                  src={p.img}
                  alt={p.name}
                  className="w-20 h-20 mx-auto mb-4 object-contain"
                />
                {p.name === "LeetCode" && (
                  <div className="text-sm space-y-1">
                    <p>Questions Solved: {leetData?.totalSolved ?? "—"}</p>
                    <p>Ranking: {leetData?.ranking ?? "—"}</p>
                  </div>
                )}
                {p.name === "GitHub" && (
                  <div className="text-sm space-y-1">
                    <p>Public Repos: {githubData?.public_repos ?? "—"}</p>
                    <p>Total Commits: {githubData?.commits ?? "—"}</p>
                    <p>Followers: {githubData?.followers ?? "—"}</p>
                  </div>
                )}
                {p.name === "Codeforces" && (
                  <div className="text-sm space-y-1">
                    <p>Rating: {codeforcesData?.rating ?? "—"}</p>
                    <p>Max Rating: {codeforcesData?.maxRating ?? "—"}</p>
                    <p>Rank: {codeforcesData?.rank ?? "—"}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      {/* Leaderboard Section */}
      <div className="text-gray-800 italic mb-2 text-center">
        Leaderboard unlocked! Are you #1? 🔥
      </div>

      <div className="grid grid-cols-2 gap-10">
        {/* LeetCode Leaderboard */}
        <div>
          <h3 className="font-bold text-lg text-gray-700 mb-2">LeetCode</h3>
          <div className="space-y-3">
            {[...Array(6)].map((_, idx) => (
              <div
                key={idx}
                className={`flex items-center bg-[#D9EFFF] rounded-full px-4 py-2 shadow-sm`}
              >
                <span className="text-gray-600 font-bold mr-3">{idx + 1}.</span>
                <div className="w-6 h-6 bg-[#1D4ED8] rounded-full mr-3" />
                <span className="text-gray-700">User Name</span>
              </div>
            ))}
          </div>
        </div>

        {/* CodeForces Leaderboard */}
        <div>
          <h3 className="font-bold text-lg text-gray-700 mb-2">CodeForces</h3>
          <div className="space-y-3">
            {[...Array(6)].map((_, idx) => (
              <div
                key={idx}
                className={`h-10 bg-[#D9EFFF] rounded-full px-4 py-2 flex items-center shadow-sm`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
      );
    }

    // === UPLOAD DOCS === //
    if (activePage === "Upload Docs") {
      return (
        <div>
          <h2 className="text-2xl font-bold mb-6">Upload Your Documents</h2>
          {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
          <form onSubmit={handleUpload} className="border border-gray-400 rounded-xl p-6 flex flex-col items-center w-64 bg-55A2D3 shadow">
            <label className="w-full mb-4 text-sm font-medium text-gray-700">
              Document Name
              <input type="text" value={docName} onChange={(e) => setDocName(e.target.value)} className="w-full p-2 border rounded mt-1" required />
            </label>
            <label className="w-full mb-4 text-sm font-medium text-gray-700">
              Select File
              <input type="file" onChange={(e) => setFile(e.target.files[0])} className="w-full p-2 border rounded mt-1" required />
            </label>
            <Button type="submit" className="w-full py-2" disabled={loading}>
              {loading ? "Uploading…" : "Upload Document"}
            </Button>
          </form>
        </div>
      );
    }

    return null;
  };

  /************ RENDER ************/
  return (
    <div className="flex h-screen">
      {showAddClass && <AddClassForm onClose={() => setShowAddClass(false)} />}
      <aside className="bg-[#0C1D4F] text-white w-64 p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <img src={Logo} alt="Logo" className="w-24 h-24" />
            <h1 className="text-2xl font-bold text-[#55A2D3]">AcademiX</h1>
          </div>
          <nav className="flex flex-col gap-4">
            {["Dashboard", "Add Attendance", "Coding Profiles", "Upload Docs"].map((btn) => (
              <Button key={btn} className="justify-start" onClick={() => setActivePage(btn)}>{btn}</Button>
            ))}
            <Button onClick={() => {
              setActivePage("Dashboard");
              setShowDocuments(true);
              fetchDocuments();
            }} className="justify-start">Get Documents</Button>
          </nav>
        </div>
        <Button onClick={handleLogout} className="text-white">Logout</Button>
      </aside>
      <main className="flex-1 bg-[#B3D4F1] p-8 overflow-auto">
        {renderMainContent()}
      </main>
    </div>
  );
};

export default AcademiXDashboard; 