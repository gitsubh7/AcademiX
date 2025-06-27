import axios from "axios";

export const markPresent = ({ subject_code, roll_number }) =>
  axios
    .post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/student/markPresent`, {
      subject_code,
      roll_number,
    })
    .then((res) => res.data.data);

export const markAbsent = ({ subject_code, roll_number }) =>
  axios
    .post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/student/markAbsent`, {
      subject_code,
      roll_number,
    })
    .then((res) => res.data.data);

export const getAttendance = (roll_number) =>
  axios
    .get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/student/getAttendance`, {
      params: { roll_number },
      withCredentials: true,
    })
    .then((res) => res.data.message);

export const removeCourse = async ({ subject_code }) => {
  const { data } = await axios.delete(
    `${import.meta.env.VITE_BACKEND_URL}/api/v1/student/removeCourse`,
    {
      data: { subject_code },
    }
  );
  return data.data;
};

export const addCourse = async ({ subject_code, roll_number }) => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/api/v1/student/addCourse`,
    { subject_code }
  );
  return { subject_code };
};

export const editCourse = async ({ old_subject_code, new_subject_code }) => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/api/v1/student/editCourse`,
    { old_subject_code, new_subject_code },
    { withCredentials: true }
  );
  return data.message;
};
