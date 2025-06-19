/* ─────────── src/pages/ProfileDialogs.jsx ─────────── */
import { useState, useEffect } from "react";
import { useUserContext } from "../context/userContext";
import { updateProfile, changePassword } from "../services/studentApi";
import { Button } from "../components/Button";
import toast from "react-hot-toast";

/* -------------------------------------------------- */
/*  1) Edit‑Profile dialog body                       */
/* -------------------------------------------------- */
export function EditProfileForm({ onSuccess }) {
  const { userState, setUserState } = useUserContext();
  const profile = userState.user || {};
  const setProfile = (p) => setUserState((prev) => ({ ...prev, user: p }));

  const [editForm, setEditForm] = useState(profile);

  /* keep form pre‑filled when profile changes */
  useEffect(() => setEditForm(profile), [profile]);

  const handleSave = async () => {
    try {
      const { data } = await updateProfile(editForm);
      const updated = data.data;
      setProfile(updated);
      localStorage.setItem("academixUser", JSON.stringify(updated));
      toast.success("Profile updated");
      onSuccess();                     // close the dialog in parent
    } catch (e) {
      toast.error(e.response?.data?.message || "Update failed");
    }
  };

  /* minimal form – add fields as required */
  return (
    <>
      <input
        value={editForm.name}
        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
        className="input w-full mb-3"
        placeholder="Full Name"
      />
      <input
  type="email"
  value={editForm.email}
  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
  className="input w-full mb-3"
  placeholder="Email"
/>
<input
  value={editForm.degree}
  onChange={(e) => setEditForm({ ...editForm, degree: e.target.value })}
  className="input w-full mb-3"
  placeholder="Degree (e.g. B.Tech)"
/>
<input
  value={editForm.department}
  onChange={(e) =>
    setEditForm({ ...editForm, department: e.target.value })
  }
  className="input w-full mb-3"
  placeholder="Department (e.g. CSE)"
/>
<input
  value={editForm.section}
  onChange={(e) => setEditForm({ ...editForm, section: e.target.value })}
  className="input w-full mb-3"
  placeholder="Section"
/>
<input
  value={editForm.roll_number}
  onChange={(e) =>
    setEditForm({ ...editForm, roll_number: e.target.value })
  }
  className="input w-full mb-3"
  placeholder="Roll Number"
/>
{/* Year */}
<input
  value={editForm.year}
  onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
  className="input w-full mb-3"
  placeholder="Year (e.g. 3rd)"
/>

{/* Graduation Year */}
<input
  value={editForm.passout_year}
  onChange={(e) =>
    setEditForm({ ...editForm, passout_year: e.target.value })
  }
  className="input w-full mb-3"
  placeholder="Graduation Year"
/>

{/* Phone Number */}
<input
  value={editForm.phone_number}
  onChange={(e) =>
    setEditForm({ ...editForm, phone_number: e.target.value })
  }
  className="input w-full mb-3"
  placeholder="Phone Number"
/>

{/* Bio (textarea) */}
<textarea
  value={editForm.bio}
  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
  className="input w-full h-24 mb-3"
  placeholder="Short Bio"
/>

{/* Subjects Enrolled (comma‑separated) */}
<textarea
  value={editForm.subjects_enrolled?.join(", ") || ""}
  onChange={(e) =>
    setEditForm({
      ...editForm,
      subjects_enrolled: e.target.value.split(",").map((s) => s.trim()),
    })
  }
  className="input w-full h-24 mb-3"
  placeholder="Subjects (comma‑separated)"
/>
      <Button
        onClick={handleSave}
        className="bg-[#0C1D4F] text-white mt-4 w-full"
      >
        Save Changes
      </Button>
    </>
  );
}

/* -------------------------------------------------- */
/*  2) Change‑Password dialog body                    */
/* -------------------------------------------------- */
export function ChangePasswordForm({ onSuccess }) {
  const [pwdForm, setPwdForm] = useState({
    old_password: "",
    new_password: "",
  });

  const handleChange = async () => {
    try {
      await changePassword(pwdForm);
      toast.success("Password changed");
      setPwdForm({ old_password: "", new_password: "" });
      onSuccess();
    } catch (e) {
      toast.error(e.response?.data?.message || "Password change failed");
    }
  };

  return (
    <>
      <input
        type="password"
        value={pwdForm.old_password}
        onChange={(e) =>
          setPwdForm({ ...pwdForm, old_password: e.target.value })
        }
        className="input w-full mb-3"
        placeholder="Old Password"
      />
      <input
        type="password"
        value={pwdForm.new_password}
        onChange={(e) =>
          setPwdForm({ ...pwdForm, new_password: e.target.value })
        }
        className="input w-full mb-3"
        placeholder="New Password"
      />
      <Button
        onClick={handleChange}
        className="bg-[#0C1D4F] text-white mt-4 w-full"
      >
        Update Password
      </Button>
    </>
  );
}
