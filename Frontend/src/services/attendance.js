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
  
  export const removeCourse = async ({ subject_code }) => {
  // axios lets you send a body with DELETE if you put it in the `data` field
  const { data } = await axios.delete("http://localhost:3000/api/v1/student/removeCourse", {
    data: { subject_code },
  });
  return data.data;          // ← matches your controller’s apiResponse
};
export const addCourse = async ({ subject_code, roll_number }) => {
  const { data } = await axios.post("http://localhost:3000/api/v1/student/addCourse", { subject_code });
  // the controller responds with   { status:200, message:"…", data: student }
  // we don’t strictly need that object for the card, so just return subject_code
  return { subject_code };
};
export const editCourse = async ({ old_subject_code, new_subject_code }) => {
  // The controller is PATCH /student/editCourse and expects the two codes
  const { data } = await axios.post(
    "http://localhost:3000/api/v1/student/editCourse",
    { old_subject_code, new_subject_code },
    { withCredentials: true }          // ⬅ if you’re using cookie auth
  );

  //   { status:200, message:"…", data: student }  ← controller shape
  // We only need the message for a toast; nothing else is required here
  return data.message;
};