import axios from "axios";



export const markPresent = ({ subject_code, roll_number }) =>
  axios.post("http://localhost:3000/api/v1/student/markPresent", { subject_code, roll_number })
 .then((res) => res.data.data);

export const markAbsent = ({ subject_code, roll_number }) =>
  axios.post("http://localhost:3000/api/v1/student/markAbsent", { subject_code, roll_number })
 .then((res) => res.data.data); 
export const getAttendance = (roll_number) =>
  axios.get("http://localhost:3000/api/v1/student/getAttendance", {
    params: { roll_number },          // ✅ goes to req.query.roll_number
    withCredentials: true,
  }) .then((res) => res.data.message); 
