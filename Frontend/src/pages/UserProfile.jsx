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
    <div className="flex h-full">
      {/* 🔵 left rail (matches your dark sidebar colour) */}
      <aside className="w-60 bg-[#B3D4F1] text-white flex flex-col items-center p-6 gap-4">
        <label htmlFor="avatarInput" className="cursor-pointer">
    <img
      src={profile.image_url || placeholder}
      alt="avatar"
      className="w-32 h-32 rounded-full object-cover ring-2 ring-[#55A2D3]"
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
  className="flex items-center gap-2 text-black bg-[#55A2D3] px-4 py-2 rounded-md font-medium border border-blue-900 shadow-md cursor-pointer w-fit"
>
  <UploadCloud size={16} className="text-black" />
  Edit Profile Image
</label>

      </aside>

      {/* 🔵 main profile panel  */}
      <section className="flex-1 bg-[#B3D4F1] p-10 overflow-auto">
        <ul className="space-y-5 text-base">
          <li>
            <span className="font-semibold">Full Name:</span> {profile.name}
          </li>
          <li>
            <span className="font-semibold">Email:</span> {profile.email}
          </li>
          <li>
            <span className="font-semibold">Degree:</span> {profile.degree}
          </li>
          <li>
            <span className="font-semibold">Department:</span>{" "}
            {profile.department}
          </li>
          <li>
            <span className="font-semibold">Section:</span> {profile.section}
          </li>
          <li>
            <span className="font-semibold">Roll Number:</span>{" "}
            {profile.roll_number}
          </li>
          <li>
            <span className="font-semibold">Year:</span> {profile.year}
          </li>
          <li>
            <span className="font-semibold">Graduation Year:</span>{" "}
            {profile.passout_year}
          </li>
          <li>
            <span className="font-semibold">Phone Number:</span>{" "}
            {profile.phone_number ?? "-"}
          </li>
          <li>
            <span className="font-semibold">Bio:</span>{" "}
            {profile.bio || "— not added —"}
          </li>
          <li>
            <span className="font-semibold">Subjects Enrolled:</span>{" "}
            {profile.subjects_enrolled?.join(", ") || "-"}
          </li>
        </ul>

        <div className="flex gap-8 mt-20">
  <button
            onClick={() => setShowEdit(true)}
            className="bg-[#B3D4F1] text-black hover:bg-[#092041] hover:text-white flex items-center px-6 py-3 text-base border border-black rounded-md"
          >
            <PenSquare size={16} className="mr-2" />
            Edit Profile
          </button>
          <button
            onClick={() => setShowPwd(true)}
            className="bg-[#B3D4F1] text-black hover:bg-[#092041] hover:text-white flex items-center px-6 py-3 text-base border border-black rounded-md"
          >
            <KeyRound size={16} className="mr-2" />
            Change Password
          </button>
</div>
      </section>
      {/* dialogs that embed the forms we imported */}
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
