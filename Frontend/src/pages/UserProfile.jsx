import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../components/Button";
import { useUserContext } from "../context/userContext.jsx";
import placeholder from "../assets/placeholder-avatar.png";  // npadd a 1‑line grey circle PNG
import { PenSquare, KeyRound, UploadCloud } from "lucide-react";
import { EditProfileForm, ChangePasswordForm } from "./Profile";
import Dialog from "../components/Dailog";
/**
 * Renders the logged‑in user's profile with Edit/Change‑Password actions
 * and an optional avatar uploader.
 */
const UserProfile = () => {
  const { userState, setUserState } = useUserContext();
  const getCachedUser = () => {
  try {
    const raw = localStorage.getItem("academixUser");
    if (!raw || raw === "undefined") return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const [profile, setProfile] = useState(userState.user ?? getCachedUser());

  const [showEdit, setShowEdit] = useState(false);
   const [showPwd, setShowPwd] = useState(false);


  /* ------------------------------------------------------------
     1️⃣  If we don’t have the profile yet (e.g. page refresh) pull
         it from the API that returns the current user (“/me” or
         whatever you named it). Re‑use the existing access token.
  ------------------------------------------------------------ */
  useEffect(() => {
  const cachedToken = localStorage.getItem("accessToken");

  if (!cachedToken) return;               // not logged in

  // attach token for this request
  axios.defaults.headers.common["Authorization"] = `Bearer ${cachedToken}`;

  // immediately fetch fresh profile
  (async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/v1/student/getStudent");

      const freshUser = data.data.student;       // adjust if your API wraps it differently
      setUserState(prev => ({ ...prev, user: freshUser, isAuthenticated: true }));
      localStorage.setItem("academixUser", JSON.stringify(freshUser));
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      // optional: logout or clear bad token
    }
  })();
}, []);

useEffect(() => {
  const fallback = getCachedUser();
  if (!userState.user && fallback) {
    setUserState(prev => ({ ...prev, user: fallback, isAuthenticated: true }));
  }
}, []);

useEffect(() => {
    if (userState.user) {
      setProfile(userState.user);
    }
  }, [userState.user]);    

  /* ---------- avatar uploader ---------- */
const handleProfileImageUpload = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const token = localStorage.getItem("accessToken");
  if (!token) return;                     // user is not logged‑in

  const formData = new FormData();
  formData.append("image_url", file);     // ← field name matches Multer

  try {
    const response = await axios.post(
      "http://localhost:3000/api/v1/student/updateProfileImage",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    /* your apiResponse wrapper is:
       { statusCode, message, data: <student> } */
    const updatedUser = response.data?.data.student;
    if (!updatedUser?.image_url) {
      throw new Error("Backend returned no image_url");
    }

    /* 1️⃣  update local component state so <img> re‑renders immediately */
    setProfile(updatedUser);

    /* 2️⃣  update global context for the rest of the app */
    if (typeof setUserState === "function") {
      setUserState((prev) => ({ ...prev, user: updatedUser }));
    }

    /* 3️⃣  persist session so a page refresh keeps the new picture */
    localStorage.setItem("academixUser", JSON.stringify(updatedUser));
  } catch (err) {
    console.error(
      "Image upload failed →",
      err.response?.data || err.message || err
    );
  }
};
 
if (!localStorage.getItem("accessToken")) {
  return <div className="p-8">You are not logged in.</div>; // or <Navigate to="/login" />
}


  if (!profile) return <div className="p-8">Loading profile…</div>;


  /* ------------------------------------------------------------
     3️⃣  UI
  ------------------------------------------------------------ */
  return (
  <div className="min-h-screen bg-[#B3D4F1] flex items-center justify-center p-6">
    <div className="bg-white/50  rounded-2xl shadow-2xl p-10 w-full max-w-3xl space-y-8">
      {/* Profile Picture */}
      <div className="flex flex-col items-center">
        <label htmlFor="avatarInput" className="relative cursor-pointer group">
          <img
            src={profile.image_url || placeholder}
            alt="avatar"
            className="w-32 h-32 rounded-full object-cover ring-4 ring-[#55A2D3] shadow-md group-hover:scale-105 transition-transform"
          />
          <input
            type="file"
            id="avatarInput"
            accept="image/*"
            className="hidden"
            onChange={handleProfileImageUpload}
          />
        </label>

        <label
          htmlFor="avatarInput"
          className="mt-4 flex items-center gap-2 text-black bg-[#55A2D3] px-4 py-2 rounded-full font-semibold border border-blue-900 shadow-md cursor-pointer hover:bg-[#3d8fbb] transition-all"
        >
          <UploadCloud size={16} className="text-black" />
          Edit Profile Image
        </label>
      </div>

      {/* Profile Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 text-[#092041]">
  {/* LEFT COLUMN */}
  <div>
    <p className="text-sm text-gray-600">Full Name</p>
    <p className="text-lg font-semibold">{profile.name}</p>
  </div>
  <div>
    <p className="text-sm text-gray-600">Email</p>
    <p className="text-lg font-semibold">{profile.email}</p>
  </div>

  <div>
    <p className="text-sm text-gray-600">Phone Number</p>
    <p className="text-lg font-semibold">{profile.phone_number ?? "-"}</p>
  </div>
  <div>
    <p className="text-sm text-gray-600">Degree</p>
    <p className="text-lg font-semibold">{profile.degree}</p>
  </div>

  <div>
    <p className="text-sm text-gray-600">Department</p>
    <p className="text-lg font-semibold">{profile.department}</p>
  </div>
  <div>
    <p className="text-sm text-gray-600">Section</p>
    <p className="text-lg font-semibold">{profile.section}</p>
  </div>

  <div>
    <p className="text-sm text-gray-600">Roll Number</p>
    <p className="text-lg font-semibold">{profile.roll_number}</p>
  </div>
  <div>
    <p className="text-sm text-gray-600">Year</p>
    <p className="text-lg font-semibold">{profile.year}</p>
  </div>

  <div>
    <p className="text-sm text-gray-600">Graduation Year</p>
    <p className="text-lg font-semibold">{profile.passout_year}</p>
  </div>

  {/* Full-width rows */}
  <div className="sm:col-span-2">
    <p className="text-sm text-gray-600">Bio</p>
    <p className="text-lg font-medium italic">{profile.bio || "— not added —"}</p>
  </div>
  <div className="sm:col-span-2">
    <p className="text-sm text-gray-600">Subjects Enrolled</p>
    <p className="text-lg font-medium">{profile.subjects_enrolled?.join(", ") || "-"}</p>
  </div>
</div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4 pt-4 border-t">
        <button
          onClick={() => setShowEdit(true)}
          className="bg-[#55A2D3] text-white hover:bg-[#092041] flex items-center px-6 py-3 text-base font-medium rounded-full shadow transition-all"
        >
          <PenSquare size={18} className="mr-2" />
          Edit Profile
        </button>
        <button
          onClick={() => setShowPwd(true)}
          className="bg-[#55A2D3] text-white hover:bg-[#092041] flex items-center px-6 py-3 text-base font-medium rounded-full shadow transition-all"
        >
          <KeyRound size={18} className="mr-2" />
          Change Password
        </button>
      </div>
    </div>

    {/* Dialog Modals */}
    {showEdit && (
      <Dialog title="Edit Profile" onClose={() => setShowEdit(false)}>
        <EditProfileForm onSuccess={() => setShowEdit(false)} />
      </Dialog>
    )}
    {showPwd && (
      <Dialog title="Change Password" onClose={() => setShowPwd(false)}>
        <ChangePasswordForm onSuccess={() => setShowPwd(false)} />
      </Dialog>
    )}
  </div>
);

};

export default UserProfile;
