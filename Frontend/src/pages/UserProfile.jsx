import React, { useEffect, useState } from "react";
import axios from "axios";
import { UploadCloud, PenSquare, KeyRound } from "lucide-react";
import { useUserContext } from "../context/userContext.jsx";
import placeholder from "../assets/placeholder-avatar.png";
import { EditProfileForm, ChangePasswordForm } from "./Profile";
import Dialog from "../components/Dialog";
 // Check spelling: this file must exist

const UserProfile = () => {
  const { userState, setUserState } = useUserContext();
  const [profile, setProfile] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const getCachedUser = () => {
    try {
      const raw = localStorage.getItem("academixUser");
      if (!raw || raw === "undefined") return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  useEffect(() => {
  const loadUserProfile = async () => {
    const token = localStorage.getItem("accessToken");
    const cachedRaw = localStorage.getItem("academixUser");

    let cached = null;
    try {
      if (cachedRaw && cachedRaw !== "undefined") {
        cached = JSON.parse(cachedRaw);
      }
    } catch (err) {
      console.error("Failed to parse cached user →", err);
    }

    // Set cached user immediately if valid
    if (cached && cached.name) {
      setProfile(cached);
      setUserState(prev => ({ ...prev, user: cached, isAuthenticated: true }));
      console.log("🔁 Loaded user from cache →", cached);
    }

    // Then fetch fresh profile from API
    if (token) {
      try {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const { data } = await axios.get("http://localhost:3000/api/v1/student/getStudent");
        const freshUser = data?.data?.student;

        if (freshUser && freshUser.name) {
          console.log("✅ Fresh user profile →", freshUser);
          setProfile(freshUser);
          setUserState(prev => ({ ...prev, user: freshUser, isAuthenticated: true }));
          localStorage.setItem("academixUser", JSON.stringify(freshUser));
        } else {
          console.warn("⚠️ Fetched user is missing 'name' →", freshUser);
        }
      } catch (err) {
        console.error("❌ Failed to fetch user profile →", err.response?.data || err.message || err);
      }
    }
  };

  loadUserProfile();
}, []);


  const handleProfileImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const formData = new FormData();
    formData.append("image_url", file);

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

      const updatedUser = response.data?.data.student;
      if (!updatedUser?.image_url) {
        throw new Error("Backend returned no image_url");
      }

      setProfile(updatedUser);
      setUserState(prev => ({ ...prev, user: updatedUser }));
      localStorage.setItem("academixUser", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Image upload failed →", err.response?.data || err.message || err);
    }
  };

  if (!localStorage.getItem("accessToken")) {
    return <div className="p-8">You are not logged in.</div>;
  }

  if (!profile || !profile.name) {
    return <div className="p-8">Loading profile…</div>;
  }

  return (
    <div className="min-h-screen bg-[#B3D4F1] flex items-center justify-center p-6">
      <div className="bg-white/50 rounded-2xl shadow-2xl p-10 w-full max-w-3xl space-y-8">
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
