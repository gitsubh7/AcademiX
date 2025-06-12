import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const UserContext = createContext();

axios.defaults.withCredentials = true;

export const UserContextProvider = ({ children }) => {
  const serverUrl = "http://localhost:3000";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [userState, setUserState] = useState({
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
  });

  const registerUser = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    // Validate email
    if (!userState.email.includes("@nitp.ac.in")) {
      toast.error("Please use your NITP email address");
      setLoading(false);
      return;
    }
  
    try {
      const formData = new FormData();
      
      // Convert subjects_enrolled to array and append each subject individually
      const subjectsArray = userState.subjects_enrolled
        .split(",")
        .map((subject) => subject.trim())
        .filter(subject => subject !== "");
  
      // Append all other fields
      Object.keys(userState).forEach((key) => {
        if (key !== "image_url" && key !== "subjects_enrolled") {
          formData.append(key, userState[key]);
        }
      });
  
      // Append each subject separately (common format for formData arrays)
      subjectsArray.forEach(subject => {
        formData.append("subjects_enrolled[]", subject);
      });
  
      // Handle image upload
      if (userState.image_url instanceof File) {
        formData.append("image_url", userState.image_url);
      } else {
        toast.error("Please select a valid image file");
        setLoading(false);
        return;
      }
  
      // Make the API call
      const { data } = await axios.post(
        `${serverUrl}/api/v1/student/register`, 
        formData, 
        {
          headers: { 
            "Content-Type": "multipart/form-data" 
          }
        }
      );
  
      console.log("User registered successfully", data);
      toast.success("User registered successfully");
      
      // Reset form state
      setUserState({
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
      });
  
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "Registration failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  const loginUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try{
      const res = await axios.post(`${serverUrl}/api/v1/student/login`,{
        email: userState.email,
        password: userState.password,
      },{
        withCredentials: true,
      });
      toast.success("User logged in successfully");
      setUserState({
        email: "",
        password: "",
      });
      navigate("/");
    }
    catch(error){
      console.log("Error logging in user",error);
      if(error.response && error.response.data && error.response.data.message){
        toast.error(error.response.data.message);
      }
      else{
        toast.error("Something went wrong.Please try again");
      }
    }
    finally{
      setLoading(false);
    }
  };
  
  const forgotPasswordEmail = async (email) => {
    setLoading(true);
    try{
      const res = await axios.post(`${serverUrl}/api/v1/student/requestPasswordReset`,{
        email,
      },
    {
      withCredentials: true,
    });
    toast.success("Forgot password email sent successfully");
    setLoading(false);
    }
    catch(error){
      console.log("Error sending forgot password eamil",error);
      toast.success(error.response.data.message);
      setLoading(false);
    }
  };

  const resetPassword = async (id, token, password) => {
    setLoading(true);
    try {
      if (!password) {
        toast.error("Password is required!");
        setLoading(false);
        return;
      }
  
      const res = await axios.post(
        `${serverUrl}/api/v1/student/passwordReset`,
        { password },  // Send password in body
        { 
          params: { id, token }, // Send id & token in query parameters
          withCredentials: true 
        }
      );
  
      console.log("Reset Password Response:", res.data);
      toast.success("Password reset successfully!");
      setLoading(false);
      navigate("/login");
    } catch (error) {
      console.error("Reset Password Error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong!");
      setLoading(false);
    }
  };
  
  const handlerUserInput = (name) => (e) => {
    const value = name === "image_url" ? e.target.files[0] : e.target.value;
    setUserState((prevState) => ({ ...prevState, [name]: value }));
  };
const resetUserState = () => {
  setUserState({
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
  });
};
  return (
    <UserContext.Provider value={{ 
    registerUser, 
    userState, 
    handlerUserInput, 
    resetUserState,
    loading,
    loginUser,
    forgotPasswordEmail,
    resetPassword,
    }}>
      {children}
    </UserContext.Provider>
  );
};


export const useUserContext = () => {
  return useContext(UserContext);
};
