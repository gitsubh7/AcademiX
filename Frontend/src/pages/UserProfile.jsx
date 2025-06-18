import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUserContext } from "../context/userContext.jsx";
import placeholder from "../assets/placeholder-avatar.png";  // npadd a 1‑line grey circle PNG
import { Button } from "@/components/ui/button";
import { PenSquare, KeyRound, UploadCloud } from "lucide-react";

/**
 * Renders the logged‑in user's profile with Edit/Change‑Password actions
 * and an optional avatar uploader.
 */
const UserProfile = () => {
  const { userState, setUserState } = useUserContext();
  const [profile, setProfile] = useState(userState.user ?? null);

  /* ------------------------------------------------------------
     1️⃣  If we don’t have the profile yet (e.g. page refresh) pull
         it from the API that returns the current user (“/me” or
         whatever you named it). Re‑use the existing access token.
  ------------------------------------------------------------ */
  useEffect(() => {
    if (profile) return;

    const token = localStorage.getItem("accessToken");
  if (!token) {
    console.error("No access token found in localStorage.");
    return;
  }

  console.log("Using accessToken:", token);

    axios
      .get("http://localhost:3000/api/v1/student/getStudent", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProfile(res.data.user);
        // push into global context so other pages get it too
        setUserState((prev) => ({ ...prev, user: res.data.user }));
      })
      .catch((err) => console.error(err));
  }, [profile, setUserState]);

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
    const updatedUser = response.data?.data;
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


  if (!profile) return <p className="p-8">Loading profile…</p>;

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
    className="text-xs bg-[#55A2D3] px-2 py-0.5 rounded cursor-pointer text-white flex items-center gap-1"
  >
    <UploadCloud size={12} /> Edit Profile Image
  </label>
      </aside>

      {/* 🔵 main profile panel  */}
      <section className="flex-1 bg-[#B3D4F1] p-10 overflow-auto">
        <ul className="space-y-2 text-base">
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

          <Button>
            <PenSquare size={16} className="mr-2" /> Edit Profile
          </Button>
          <Button variant="outline">
            <KeyRound size={16} className="mr-2" /> Change Password
          </Button>
        </div>
      </section>
    </div>
  );
};

export default UserProfile;
