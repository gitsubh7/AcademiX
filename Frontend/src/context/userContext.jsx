import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.withCredentials = true;

const EMPTY_FORM = {
  name: "",
  email: "",
  degree: "",
  department: "",
  section: "",
  password: "",
  roll_number: "",
  bio: "",
  year: "",
  passout_year: "",
  phone_number: "",
  subjects_enrolled: "",
  image_url: "",       
};


const normaliseSubjects = (raw) => {
  if (!raw) return [];

  // 1️⃣ already an array of objects → tidy keys
  if (Array.isArray(raw) && typeof raw[0] === "object") {
    return raw.map((s) => ({
      code: s.code || s.subject_code,
      name: s.name || s.code || s.subject_code,
    }));
  }
  // 2️⃣ array of strings → promote to objects
  if (Array.isArray(raw)) {
    return raw.map((str) => ({ code: str, name: str }));
  }
  return [];
};


const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  /* ------- config -------- */
   const serverUrl = import.meta.env.VITE_BACKEND_URL;

  const navigate  = useNavigate();

  /* ------- state --------- */
  const [loading, setLoading]     = useState(false);
  const [formState, setFormState] = useState(EMPTY_FORM); 
  const [currentUser, setCurrentUser] = useState(() => {
    const cached = localStorage.getItem("academixUser");
    if (!cached || cached === "undefined") return null;
    try {
      return JSON.parse(cached);
    } catch {
      localStorage.removeItem("academixUser");
      return null;
    }
  });

  /* ------- bootstrap auth header if cached token exists ------- */
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }, []);

  /* ─────────────────────────────
     REGISTER USER
  ──────────────────────────────*/
  const registerUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formState.email.includes("@nitp.ac.in")) {
      toast.error("Please use your NITP email address");
      return setLoading(false);
    }

    try {
      const formData = new FormData();

      // split and tidy subjects
      const subjectsArray = formState.subjects_enrolled
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      // append primitive fields
      Object.entries(formState).forEach(([key, value]) => {
        if (key !== "image_url" && key !== "subjects_enrolled") {
          formData.append(key, value);
        }
      });

      // append subjects
      subjectsArray.forEach((sub) => formData.append("subjects_enrolled[]", sub));

      // image check
      if (formState.image_url instanceof File) {
        formData.append("image_url", formState.image_url);
      } else {
        toast.error("Please select a valid image file");
        return setLoading(false);
      }

      await axios.post(`${serverUrl}/api/v1/student/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("User registered successfully");
      setFormState(EMPTY_FORM);
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      toast.error(
        err.response?.data?.message || err.response?.data?.error || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ─────────────────────────────
     LOGIN USER
  ──────────────────────────────*/
  const loginUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${serverUrl}/api/v1/student/login`,
        { email: formState.email, password: formState.password },
        { withCredentials: true },
      );

      toast.success("User logged in successfully");

      const {
        user:    loggedInUserRaw,
        student: loggedInStudentRaw,
        accessToken,
        refreshToken,
      } = res.data.data || {};

      const rawUser = loggedInUserRaw || loggedInStudentRaw;
      if (!rawUser) throw new Error("Backend returned no user/student object");

      // make sure subjects is uniform & easy for UI
      const subjects = normaliseSubjects(rawUser.subjects || rawUser.subjects_enrolled);
      const user = { ...rawUser, subjects };

      // cache + context
      setCurrentUser(user);
      localStorage.setItem("academixUser", JSON.stringify(user));
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("academixRefreshToken", refreshToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      // clear password field after successful login
      setFormState((prev) => ({ ...prev, password: "" }));
      navigate("/home");
    } catch (err) {
      console.error("Login error:", err);
      toast.error(
        err.response?.data?.message || err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ─────────────────────────────
     LOGOUT
  ──────────────────────────────*/
  const logoutUser = () => {
    localStorage.removeItem("academixUser");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("academixRefreshToken");
    setCurrentUser(null);
    navigate("/login");
  };

  /* ─────────────────────────────
     PASSWORD‑FLOW HELPERS (unchanged)
  ──────────────────────────────*/
  const forgotPasswordEmail = async (email) => {
    setLoading(true);
    try {
      await axios.post(`${serverUrl}/api/v1/student/requestPasswordReset`, { email }, { withCredentials: true });
      toast.success("Forgot‑password email sent successfully");
    } catch (err) {
      console.error("Forgot‑password error:", err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (id, token, password) => {
    setLoading(true);
    try {
      if (!password) {
        toast.error("Password is required!");
        return setLoading(false);
      }

      await axios.post(
        `${serverUrl}/api/v1/student/passwordReset`,
        { password },
        { params: { id, token }, withCredentials: true },
      );

      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (err) {
      console.error("Reset‑password error:", err);
      toast.error(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  /* ─────────────────────────────
     FORM FIELD HANDLER
  ──────────────────────────────*/
  const handlerUserInput = (name) => (e) => {
    const value = name === "image_url" ? e.target.files[0] : e.target.value;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const resetUserState = () => {
    setFormState(EMPTY_FORM);
  };

  /* ─────────────────────────────
     PROVIDER VALUE
  ──────────────────────────────*/
  return (
    <UserContext.Provider
      value={{
        registerUser,
        loginUser,
        logoutUser,
        forgotPasswordEmail,
        resetPassword,
        // expose both pieces of state so legacy components work
        userState: formState,     // 🏷 keep old name for form pages
        setUserState: setFormState,
        currentUser,              // 🆕 actual logged‑in user
        setCurrentUser,           // (rarely needed)
        handlerUserInput,
        resetUserState,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
