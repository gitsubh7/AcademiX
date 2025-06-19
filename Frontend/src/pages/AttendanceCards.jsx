import React, { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { useUserContext } from "../context/userContext.jsx";
import {
  getAttendance,
  markPresent,
  markAbsent,
} from "../services/attendance";

export default function AttendanceCards() {
  const { currentUser } = useUserContext();           // ← already populated at login
  const rollNum = currentUser?.roll_number || currentUser?.user?.roll_number;

  const enrolled = currentUser?.subjects || [];       // [{ code, name }]
  const [records, setRecords] = useState([]);
         // [{ subject_code, present, absent, … }]
  const calcDerived = (rec) => {
  const total = rec.present + rec.absent;
  const percent = total ? Math.round((rec.present / total) * 100) : 0;
  return { ...rec, total, percent };
};

  /* ───── 1.  Fetch current attendance once  ───── */
 useEffect(() => {
  if (!rollNum) return;
  (async () => {
    try {
      const attendanceArray = await getAttendance(rollNum);
      console.log("🧪 attendanceArray =", attendanceArray); // 👈 inspect this

      if (!Array.isArray(attendanceArray)) {
        throw new Error("getAttendance did not return an array");
      }

      const merged = attendanceArray.map((rec) => {
        const match = enrolled.find((s) => s.code === rec.subject_code);
        return { ...rec, name: match?.name || rec.subject_code };
      });

      setRecords(merged);
    } catch (err) {
      console.error("Attendance fetch failed:", err);
    }
  })();
}, [rollNum, enrolled]);


  /* ───── 2.  Helper to refresh one record after + / –  ───── */
  const updateOne = (updated) =>
    setRecords((prev) =>
      prev.map((r) =>
        r.subject_code === updated.subject_code ? { ...r, ...updated } : r
      )
    );

  /* ───── 3.  Button handlers  ───── */
  const handleMark = async (subject_code, type) => {
    // optimistic UI update
 setRecords((prev) =>
   prev.map((r) =>
     r.subject_code === subject_code
        ? calcDerived({
          ...r,
          present: type === "present" ? r.present + 1 : r.present,
          absent:  type === "absent"  ? r.absent  + 1 : r.absent,
          })
        : r
    )  );
    // 2) fire the API call in the background
  try {
    const fn = type === "present" ? markPresent : markAbsent;
    const fresh = await fn({ subject_code, roll_number: rollNum });
    updateOne(calcDerived(fresh));         // ← sync with DB response
  } catch (err) {
    console.error("Update failed, reverting:", err);

    // 3) rollback if the request fails
    setRecords((prev) =>
      prev.map((r) =>
        r.subject_code === subject_code
          ? calcDerived({
              ...r,
              present: type === "present" ? r.present - 1 : r.present,
              absent:  type === "absent"  ? r.absent  - 1 : r.absent,
            })
         : r
     )
   );
  }
  };

  /* ───── 4.  UI  ───── */
  return (
  <div className="flex gap-4 mt-6 flex-wrap">
    {records.map(
      ({ subject_code, name, present, absent, total, percent }) => (
        <div
          key={subject_code}
          className="bg-[#0C1D4F] text-white p-4 rounded-xl shadow w-40 text-center"
        >
          <h3 className="text-sm font-semibold truncate text-white">{name}</h3>

          <p className="text-sm mt-2 text-white">
            {present}/{total}
          </p>

          <div className="w-16 h-16 border-4 border-white rounded-full mx-auto mt-4 flex items-center justify-center">
            <span className="text-lg font-bold text-white">{percent}%</span>
          </div>

          <div className="flex justify-center gap-2 mt-4">
            <Button
              className="bg-[#B3D4F1] text-black w-6 h-6 p-0 flex items-center justify-center"
              onClick={() => handleMark(subject_code, "present")}
              title="Mark Present"
            >
              +
            </Button>
            <Button
              className="bg-[#B3D4F1] text-black w-6 h-6 p-0 flex items-center justify-center"
              onClick={() => handleMark(subject_code, "absent")}
              title="Mark Absent"
            >
              -
            </Button>
          </div>
        </div>
      )
    )}
  </div>
);

}
