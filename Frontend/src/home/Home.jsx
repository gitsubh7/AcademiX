// -----------------------------------------------------------------------------
// AcademiXDashboard.jsx
// -----------------------------------------------------------------------------

import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";

import Logo from "../assets/Logo.png";
import WeatherCard from "../WeatherSection/WeatherCard";
import { startGoogleLogin } from "../utils/googleAuth";
import CodingProfiles from "../pages/CodingProfiles";
import UserProfile from "../pages/UserProfile";
import { useUserContext } from "../context/userContext.jsx";
import AttendanceCards from "../pages/AttendanceCards";

/* -------------------------------------------------------------------------- */
/*  SMALL REUSABLE BUTTON                                                     */
/* -------------------------------------------------------------------------- */
const Button = ({
  children,
  className = "",
  onClick,
  type = "button",
  disabled = false,
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`bg-[#0C1D4F] hover:bg-[#AAD0E9] text-white hover:text-black font-semibold py-1 px-3 rounded ${className}`}
  >
    {children}
  </button>
);

/* -------------------------------------------------------------------------- */
/*  TOKEN HELPERS                                                             */
/* -------------------------------------------------------------------------- */
const getAccessToken = () => localStorage.getItem("gAccess");
const getRefreshToken = () => localStorage.getItem("gRefresh") || "";

const clearClientStorage = () => {
  localStorage.removeItem("gAccess");
  localStorage.removeItem("gRefresh");
  localStorage.removeItem("gExpires");
  localStorage.removeItem("codingProfiles.usernames");
};

/* -------------------------------------------------------------------------- */
/*  ADD‑CLASS MODAL                                                           */
/* -------------------------------------------------------------------------- */
const AddClassForm = ({ onClose, onTokenExpired }) => {
  const [form, setForm] = useState({
    subject_name: "",
    subject_code: "",
    classroom: "",
    professor_name: "",
    start_time: "",
    end_time: "",
    day: "Monday",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      /* Build absolute ISO datetimes for first occurrence */
      const nextDay = dayjs()
        .day(
          {
            Sunday: 0,
            Monday: 1,
            Tuesday: 2,
            Wednesday: 3,
            Thursday: 4,
            Friday: 5,
            Saturday: 6,
          }[form.day]
        )
        .hour(Number(form.start_time.split(":")[0]))
        .minute(Number(form.start_time.split(":")[1]))
        .second(0)
        .millisecond(0);

      const startDate = nextDay.isBefore(dayjs())
        ? nextDay.add(7, "day")
        : nextDay;

      const startISO = startDate.toDate().toISOString();
      const endISO = startDate
        .hour(Number(form.end_time.split(":")[0]))
        .minute(Number(form.end_time.split(":")[1]))
        .toDate()
        .toISOString();

      /* Headers with tokens */
      const headers = { Authorization: `Bearer ${getAccessToken()}` };
      const rToken = getRefreshToken();
      if (rToken) headers["x-refresh-token"] = rToken;

      /* POST to backend */
      const resp = await axios.post(
        "http://localhost:3000/api/v1/student/addClass",
        { ...form, start_time: startISO, end_time: endISO },
        { headers }
      );

      /* Save refreshed tokens if backend returned them */
      if (resp.data.tokens) {
        const { access_token, refresh_token, expires_in } = resp.data.tokens;
        if (access_token) localStorage.setItem("gAccess", access_token);
        if (refresh_token) localStorage.setItem("gRefresh", refresh_token);
        if (expires_in)
          localStorage.setItem("gExpires", Date.now() + expires_in * 1000);
      }

      setMsg("Event added to Google Calendar 🎉");
      setTimeout(onClose, 1200);
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Something went wrong";
      setMsg(errorMsg);

      if (errorMsg.includes("Google token expired")) {
        onTokenExpired?.();
        clearClientStorage();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[999]">
      <div className="bg-[#0C1D4F] text-white p-6 rounded-lg w-80">
        <h2 className="text-xl font-bold mb-4 text-center">
          Add Class to Calendar
        </h2>

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

          {/* Day selector */}
          <label className="flex flex-col">
            <span className="mb-1">Day of Week</span>
            <select
              name="day"
              value={form.day}
              onChange={handleChange}
              className="p-2 rounded bg-transparent border border-white"
            >
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((d) => (
                <option key={d} value={d} className="text-black">
                  {d}
                </option>
              ))}
            </select>
          </label>

          {/* Actions */}
          <Button type="submit" disabled={loading} className="mt-4 w-full py-2">
            {loading ? "Adding…" : "ADD"}
          </Button>
          <Button
            onClick={onClose}
            className="mt-2 bg-red-500 text-white w-full py-2"
          >
            Cancel
          </Button>

          {msg && <p className="text-center mt-2 text-sm">{msg}</p>}
        </form>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*  MAIN DASHBOARD                                                            */
/* -------------------------------------------------------------------------- */
const AcademiXDashboard = () => {
  /* ------------ state ------------ */
  const [activePage, setActivePage] = useState("Dashboard");
  const [showAddClass, setShowAddClass] = useState(false);
  const [showDocuments, setShowDocuments] = useState(false);

  /* document & upload state (kept as‑is) */
  const [documents, setDocuments] = useState([]);
  const [docName, setDocName] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletingDocId, setDeletingDocId] = useState(null);

  /* google token status */
  const [hasGoogleToken, setHasGoogleToken] = useState(
    !!localStorage.getItem("gAccess") && !!localStorage.getItem("gRefresh")
  );

  /* context */
  const { userState, resetUserState } = useUserContext();
  const firstName = userState?.name?.split(" ")[0] || "there";

  /* --------- keep token state synced across tabs ---------- */
  useEffect(() => {
    const sync = () =>
      setHasGoogleToken(
        !!localStorage.getItem("gAccess") && !!localStorage.getItem("gRefresh")
      );
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  /* --------- Google connect ---------- */
  const handleGoogleConnect = async () => {
    try {
      await startGoogleLogin();
      setHasGoogleToken(true);
    } catch (err) {
      alert(err.message);
    }
  };

  /* ---------------------------------------------------------------------- */
  /*  (Upload / docs helpers – unchanged except URLs switched to env)       */
  /* ---------------------------------------------------------------------- */
  const API = import.meta.env.VITE_API_BASE;

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
      const formatted =
        (data?.message?.documents || []).map((d) => ({
          id: d._id,
          name: d.name,
          url: d.url,
        })) || [];
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
      const res = await fetch("http://localhost:3000/api/v1/student/deleteDocument/${docId}", {
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

  /* ---------------------------------------------------------------------- */
  /*  Logout                                                                */
  /* ---------------------------------------------------------------------- */
  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/v1/student/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Logout failed");
      clearClientStorage();
      resetUserState();
      window.location.href = "/login";
    } catch {
      setError("Logout failed. Please try again.");
    }
  };

  /* ---------------------------------------------------------------------- */
  /*  UTIL – file icon                                                      */
  /* ---------------------------------------------------------------------- */
  const getFileIcon = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();
    const icons = {
      pdf: "📄",
      doc: "📝",
      docx: "📝",
      ppt: "📊",
      pptx: "📊",
      xls: "📈",
      xlsx: "📈",
      png: "🖼️",
      jpg: "🖼️",
      jpeg: "🖼️",
      gif: "🖼️",
      zip: "🗜️",
      rar: "🗜️",
    };
    return icons[ext] || "📁";
  };

  /* ---------------------------------------------------------------------- */
  /*  MAIN CONTENT RENDERER                                                 */
  /* ---------------------------------------------------------------------- */
  const renderMainContent = () => {
    /* ---------- Uploaded docs grid ---------- */
    if (activePage === "Dashboard" && showDocuments) {
      return (
        <div>
          <h2 className="text-2xl font-bold mb-6">Uploaded Documents</h2>
          {loading && <p className="italic mb-4">Loading documents…</p>}

          {documents.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white p-4 rounded-lg shadow flex flex-col justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getFileIcon(doc.name)}</span>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{doc.name}</h3>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-sm"
                      >
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

     if (activePage === "User Profile") return <UserProfile />;

    /* ---------- Main dashboard ---------- */
    if (activePage === "Dashboard") {
      return (
        <div>
          {/* Top welcome + weather */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-[#0C1D4F]">
                Welcome to AcademiX!
              </h1>
              <p className="mt-4 text-lg">
                Hey, <span className="font-semibold">{firstName}</span>
                <br />
                Welcome Back!
              </p>
            </div>
            <WeatherCard city="bihta" />
          </div>

          {/* Attendance cards (static mock) */}
          <p className="mt-6 italic">
            Never miss a beat—track your attendance with ease ✅
          </p>
          <AttendanceCards />

          {/* Calendar CTA */}
          <p className="mt-10 italic">
            Stay ahead, Add Class to Calendar—No Stress! 📝
          </p>

          <Button
            onClick={() => setShowAddClass(true)}
            className="rounded-xl px-6 py-3 text-lg mt-4"
            disabled={!hasGoogleToken}
          >
            Add Class To Calendar
          </Button>

          {!hasGoogleToken && (
            <Button
              onClick={handleGoogleConnect}
              className="rounded-xl px-6 py-3 text-lg mt-4 bg-green-600 hover:bg-green-500"
            >
              Connect Google Calendar
            </Button>
          )}
        </div>
      );
    }

    /* ---------- Coding Profiles ---------- */
    if (activePage === "Coding Profiles") {
      return <CodingProfiles />;
    }

    /* ---------- Upload Docs form ---------- */
    if (activePage === "Upload Docs") {
      return (
        <div>
          <h2 className="text-2xl font-bold mb-6">Upload Your Documents</h2>
          {error && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <form
            onSubmit={handleUpload}
            className="border border-gray-400 rounded-xl p-6 flex flex-col items-center w-64 bg-55A2D3 shadow"
          >
            <label className="w-full mb-4 text-sm font-medium text-gray-700">
              Document Name
              <input
                type="text"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                className="w-full p-2 border rounded mt-1"
                required
              />
            </label>

            <label className="w-full mb-4 text-sm font-medium text-gray-700">
              Select File
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full p-2 border rounded mt-1"
                required
              />
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

  /* ---------------------------------------------------------------------- */
  /*  RENDER                                                                */
  /* ---------------------------------------------------------------------- */
  return (
    <div className="flex h-screen">
      {/* Global modal mount */}
      {showAddClass && (
        <AddClassForm
          onClose={() => setShowAddClass(false)}
          onTokenExpired={() => setHasGoogleToken(false)}
        />
      )}

      {/* Sidebar */}
      <aside className="bg-[#0C1D4F] text-white w-64 p-4 flex flex-col justify-between">
  <div>
    {/* Logo and Title */}
    <div className="flex items-start gap-2 mb-8">
      <img src={Logo} alt="Logo" className="w-20 h-20 mt-1" />
      <h1 className="text-3xl font-bold text-[#55A2D3] leading-tight mt-2">AcademiX</h1>
    </div>

    <nav className="flex flex-col gap-4">
      {/* User Profile Button */}
      <Button
        className="justify-start"
        onClick={() => setActivePage("User Profile")}
      >
        User Profile
      </Button>

      {/* Main Sidebar Buttons */}
      {["Dashboard", "Coding Profiles", "Upload Docs"].map(
        (btn) => (
          <Button
            key={btn}
            className="justify-start"
            onClick={() => {
              setActivePage(btn);
              if (btn === "Dashboard") setShowDocuments(false);
            }}
          >
            {btn}
          </Button>
        )
      )}

      {/* Get Documents Button */}
      <Button
        className="justify-start"
        onClick={() => {
          setActivePage("Dashboard");
          setShowDocuments(true);
          fetchDocuments();
        }}
      >
        Get Documents
      </Button>
    </nav>
  </div>

  <Button onClick={handleLogout}>Logout</Button>
</aside>

      {/* Main panel */}
      <main className="flex-1 bg-[#B3D4F1] p-8 overflow-auto">
        {renderMainContent()}
      </main>
    </div>
  );
};

export default AcademiXDashboard;
