import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const UserContext = createContext();

axios.defaults.withCredentials = true;

// ----------  initial shapes ----------
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

export const UserContextProvider = ({ children }) => {
  const serverUrl = "http://localhost:3000";
  const navigate  = useNavigate();

  const [loading, setLoading]   = useState(false);
  const [userState, setUserState] = useState(EMPTY_FORM);   // <- holds both form & logged‑in user

  /* --------------------------------------------------
     Load cached user (if any) on first render
  ----------------------------------------------------*/
  useEffect(() => {
  const cachedUser   = localStorage.getItem("academixUser");
  const cachedToken  = localStorage.getItem("accessToken");

  if (cachedUser && cachedToken) {
    const user = JSON.parse(cachedUser);

    setUserState(prev => ({
      ...prev,
      user,               // 🔑 keep under `user`
      isAuthenticated: true,
    }));

    // attach token globally so every axios call uses it
    axios.defaults.headers.common["Authorization"] = `Bearer ${cachedToken}`;
  }
}, []);
  /* ---------------- REGISTER ---------------- */
  const registerUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate NITP email
    if (!userState.email.includes("@nitp.ac.in")) {
      toast.error("Please use your NITP email address");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();

      // split subjects_enrolled into array
      const subjectsArray = userState.subjects_enrolled
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);

      // append simple fields
      Object.keys(userState).forEach((key) => {
        if (key !== "image_url" && key !== "subjects_enrolled") {
          formData.append(key, userState[key]);
        }
      });

      // append each subject
      subjectsArray.forEach(subject =>
        formData.append("subjects_enrolled[]", subject)
      );

      // image file check
      if (userState.image_url instanceof File) {
        formData.append("image_url", userState.image_url);
      } else {
        toast.error("Please select a valid image file");
        setLoading(false);
        return;
      }

      await axios.post(
        `${serverUrl}/api/v1/student/register`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("User registered successfully");
      setUserState(EMPTY_FORM);
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      const msg = error.response?.data?.message ||
                  error.response?.data?.error   ||
                  "Registration failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- LOGIN ---------------- */
  /* ---------------- LOGIN ---------------- */
const loginUser = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await axios.post(
      `${serverUrl}/api/v1/student/login`,
      { email: userState.email, password: userState.password },
      { withCredentials: true }
    );

    toast.success("User logged in successfully");

    /* ---------- NEW: pull user from the right place ---------- */
    // Your console log showed { data: { user, accessToken, refreshToken } }
    const { user: loggedInUser, accessToken, refreshToken } = res.data.data || {};

    if (!loggedInUser) {
      throw new Error("No user object returned from backend");
    }

    // 1) keep in context
    setUserState(prev => ({ ...prev,  user: loggedInUser, password: "" }));

    // 2) cache so it survives reloads
    localStorage.setItem("academixUser", JSON.stringify(loggedInUser));
    // (optional) store tokens too if you need them later
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("academixRefreshToken", refreshToken);

    navigate("/home");
  } catch (error) {
    console.error("Login error:", error);
    toast.error(
      error.response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again"
    );
  } finally {
    setLoading(false);
  }
};


  /* ---------------- LOGOUT (optional) ---------------- */
  const logoutUser = () => {
    localStorage.removeItem("academixUser");
    setUserState(EMPTY_FORM);
    navigate("/login");
  };

  /* ---------------- FORGOT‑PASSWORD ---------------- */
  const forgotPasswordEmail = async (email) => {
    setLoading(true);
    try {
      await axios.post(
        `${serverUrl}/api/v1/student/requestPasswordReset`,
        { email },
        { withCredentials: true }
      );
      toast.success("Forgot‑password email sent successfully");
    } catch (error) {
      console.error("Forgot‑password error:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- RESET‑PASSWORD ---------------- */
  const resetPassword = async (id, token, password) => {
    setLoading(true);
    try {
      if (!password) {
        toast.error("Password is required!");
        setLoading(false);
        return;
      }

      await axios.post(
        `${serverUrl}/api/v1/student/passwordReset`,
        { password },                           // body
        { params: { id, token }, withCredentials: true } // query params
      );

      toast.success("Password reset successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Reset‑password error:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- FORM FIELD HANDLER ---------------- */
  const handlerUserInput = (name) => (e) => {
    const value = name === "image_url" ? e.target.files[0] : e.target.value;
    setUserState(prev => ({ ...prev, [name]: value }));
  };

  const resetUserState = () => {
  // 1️⃣ wipe React state
  setUserState(EMPTY_FORM);

  // 2️⃣ wipe browser storage (only keys you really set)
  localStorage.removeItem("gAccess");
  localStorage.removeItem("gRefresh");
  };


  /* ---------------- PROVIDER VALUE ---------------- */
  return (
    <UserContext.Provider value={{
      registerUser,
      loginUser,
      forgotPasswordEmail,
      resetPassword,
      logoutUser,
      userState,
      setUserState,
      handlerUserInput,
      resetUserState,
      loading,
    }}>
      {children}
    </UserContext.Provider>
  );
};

/* ------------- HOOK ------------- */
export const useUserContext = () => useContext(UserContext);
