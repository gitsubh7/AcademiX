import React, { useState, useEffect } from "react";
import Logo from "../assets/Logo.png";
import Leet from "../assets/Leet.png";
import Geek from "../assets/Geek.png";
import Code from "../assets/Code.png";
import WeatherCard from "../WeatherSection/WeatherCard";

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

const AddClassForm = ({ onClose }) => (
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


  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/v1/student/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        window.location.href = "/login";
      } else {
        setError("Logout failed. Please try again.");
      }
    } catch {
      setError("An error occurred during logout.");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file");
      return;
    }
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
    } catch (error) {
      setError(error.message || "Upload failed");
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
      console.log("Fetched documents:", data);
      const formattedDocs = (data?.message?.documents || []).map(doc => ({
        id: doc._id || doc.id,
        name: doc.name || "Untitled Document",
        url: doc.url || "#",
      }));
      setDocuments(formattedDocs);
      console.log("Formatted docs for cards:", formattedDocs);

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
    setError(null);

    const res = await fetch(`http://localhost:3000/api/v1/student/deleteDocument/${docId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to delete document");
    await fetchDocuments();
  } catch (error) {
    setError(error.message || "Failed to delete document");
  } finally {
    setDeletingDocId(null);
  }
}; 


  useEffect(() => {
    if (activePage !== "Dashboard") setShowDocuments(false);
  }, [activePage]);

  const getFileIcon = (filename) => {
  const ext = filename.split('.').pop().toLowerCase();
  switch (ext) {
    case 'pdf':
      return '📄'; // Or replace with an actual icon component
    case 'doc':
    case 'docx':
      return '📝';
    case 'ppt':
    case 'pptx':
      return '📊';
    case 'xls':
    case 'xlsx':
      return '📈';
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
      return '🖼️';
    case 'zip':
    case 'rar':
      return '🗜️';
    default:
      return '📁';
  }
};

  const renderMainContent = () => {
    if (activePage === "Dashboard" && showDocuments) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Uploaded Documents</h2>
      {loading && <p className="text-gray-700 italic mb-4">Loading documents...</p>}
      {documents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {documents.map((doc) => (
            <div key={doc.id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition duration-300 flex flex-col justify-between">
               <div className="flex items-center gap-3">
    <span className="text-2xl">{getFileIcon(doc.name)}</span>
              <div>
                <h3 className="text-lg font-semibold mb-2">{doc.name}</h3>
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
  {deletingDocId === doc.id ? "Deleting..." : "Delete"}
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

    switch (activePage) {
      case "Dashboard":
        return (
           <div>
      {/* Top row */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-[#0C1D4F]">Welcome to AcademiX!</h1>
          <p className="mt-4 text-lg">
            Hey, <span className="font-semibold text-black">User name!</span><br />
            Welcome Back!
          </p>
        </div>
        <WeatherCard city="bihta" /> {/* new component */}
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
            <div className="flex gap-4 mt-4">
              <Button onClick={() => setShowAddClass(true)} className="bg-[#0C1D4F] rounded-xl px-6 py-3 text-lg">
                Add Class To Calendar
              </Button>
            </div>
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
          </div>
        );
      case "Upload Docs":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">Upload Your Documents</h2>
            {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
            <form onSubmit={handleUpload} className="border border-gray-400 rounded-xl p-6 flex flex-col items-center w-64 bg-white shadow">
              <div className="w-full mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Document Name</label>
                <input type="text" value={docName} onChange={(e) => setDocName(e.target.value)} className="w-full p-2 border rounded" required />
              </div>
              <div className="w-full mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Select File</label>
                <input type="file" onChange={(e) => setFile(e.target.files[0])} className="w-full p-2 border rounded" required />
              </div>
              <Button type="submit" className="w-full py-2" disabled={loading}>{loading ? "Uploading..." : "Upload Document"}</Button>
            </form>
          </div>
        );

      default:
        return <div><h1 className="text-4xl font-bold">Welcome to AcademiX!</h1></div>;
    }
  };

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
      <main className="flex-1 bg-[#B3D5E1] p-8 overflow-auto">
        {renderMainContent()}
      </main>
    </div>
  );
};

export default AcademiXDashboard;
