import React, { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { useUserContext } from "../context/userContext.jsx";
import {
  getAttendance,
  markPresent,
  markAbsent,
  removeCourse,
  addCourse,
} from "../services/attendance";

export default function AttendanceCards() {
  /* ─────────────── Context & helpers ─────────────── */
  const { currentUser } = useUserContext();
  const rollNum =
    currentUser?.roll_number || currentUser?.user?.roll_number || "";
  const enrolled = currentUser?.subjects || []; // [{ code, name }]

  /**
   * Calculate totals & percentage on a record.
   * Always call this before we push a record to UI so that `total` and `percent`
   * are present even right after a hard refresh.
   */
  const calcDerived = (rec) => {
    const total = rec.present + rec.absent;
    const percent = total ? Math.round((rec.present / total) * 100) : 0;
    return { ...rec, total, percent };
  };

  /* ─────────────── Local state ─────────────── */
  const [records, setRecords] = useState([]);
  const [showAdder, setShowAdder] = useState(false);
  const [courseCode, setCourseCode] = useState("");

  /* ─────────────── Fetch attendance on mount ─────────────── */
  useEffect(() => {
    if (!rollNum) return;

    (async () => {
      try {
        const attendanceArray = await getAttendance(rollNum);
        if (!Array.isArray(attendanceArray)) {
          throw new Error("getAttendance did not return an array");
        }

        const merged = attendanceArray.map((rec) => {
          const match = enrolled.find((s) => s.code === rec.subject_code);
          return calcDerived({
            ...rec,
            name: match?.name || rec.subject_code,
          });
        });
        setRecords(merged);
      } catch (err) {
        console.error("Attendance fetch failed:", err);
      }
    })();
  }, [rollNum, enrolled]);

  /* ─────────────── Utilities ─────────────── */
  const updateOne = (updated) =>
    setRecords((prev) =>
      prev.map((r) =>
        r.subject_code === updated.subject_code ? { ...r, ...updated } : r
      )
    );

  /* ─────────────── Mark present/absent ─────────────── */
  const handleMark = async (subject_code, type) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.subject_code === subject_code
          ? calcDerived({
              ...r,
              present: type === "present" ? r.present + 1 : r.present,
              absent: type === "absent" ? r.absent + 1 : r.absent,
            })
          : r
      )
    );

    try {
      const fn = type === "present" ? markPresent : markAbsent;
      const fresh = await fn({ subject_code, roll_number: rollNum });
      updateOne(calcDerived(fresh));
    } catch (err) {
      console.error("Update failed, reverting:", err);
      // rollback
      setRecords((prev) =>
        prev.map((r) =>
          r.subject_code === subject_code
            ? calcDerived({
                ...r,
                present: type === "present" ? r.present - 1 : r.present,
                absent: type === "absent" ? r.absent - 1 : r.absent,
              })
            : r
        )
      );
    }
  };

  /* ─────────────── Remove course ─────────────── */
  const handleRemove = async (subject_code) => {
    const removed = records.find((r) => r.subject_code === subject_code);
    setRecords((prev) => prev.filter((r) => r.subject_code !== subject_code));

    try {
      await removeCourse({ subject_code });
    } catch (err) {
      console.error("Remove failed, restoring:", err);
      setRecords((prev) =>
        [...prev, removed].sort((a, b) =>
          a.subject_code.localeCompare(b.subject_code)
        )
      );
    }
  };

  /* ─────────────── Add course ─────────────── */
  const handleAddCourse = async () => {
    const code = courseCode.trim().toUpperCase();
    if (!code) return;

    const temp = calcDerived({
      subject_code: code,
      name: code,
      present: 0,
      absent: 0,
    });
    setRecords((prev) => [...prev, temp]);

    try {
      await addCourse({ subject_code: code, roll_number: rollNum });
      setShowAdder(false);
      setCourseCode("");
    } catch (err) {
      console.error("Add course failed:", err);
      setRecords((prev) => prev.filter((r) => r.subject_code !== code));
    }
  };

  /* ─────────────── JSX ─────────────── */
  return (
    <>
      {/* Chart wrapper */}
      <div className="bg-white rounded-3xl shadow-lg p-6 flex gap-4 mt-6 flex-wrap items-center">
        {/* Attendance cards */}
        {records.map(({ subject_code, name, present, total, percent }) => (
          <div
            key={subject_code}
            className="bg-[#0C1D4F] text-white p-4 rounded-xl shadow w-40 text-center"
          >
            <h3 className="text-sm font-semibold truncate text-white">
              {name}
            </h3>

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

            <Button
              className="bg-[#B3D4F1] text-black w-full mt-3 text-xs py-1 rounded"
              onClick={() => handleRemove(subject_code)}
              title="Remove this course"
            >
              Remove Course
            </Button>
          </div>
        ))}

        {/* Add‑course pseudo card */}
        <button
          onClick={() => setShowAdder(true)}
          className="w-30 h-[108px] bg-[#EAF2FF] border-2 border-dashed border-[#0C1D4F]/40 rounded-xl flex flex-col items-center justify-center hover:bg-[#DCEBFF] transition"
        >
          <span className="text-3xl font-bold text-[#0C1D4F]">＋</span>
          <span className="text-xs font-semibold mt-2 text-[#0C1D4F]">
            Add Course
          </span>
        </button>
      </div>

      {/* Add‑course modal */}
      {showAdder && (
        <div className="fixed inset-0 bg-black/40 grid place-items-center z-50">
          <div className="bg-white rounded-xl p-6 w-[320px]">
            <h2 className="font-semibold text-lg text-[#0C1D4F] mb-4">
              Add a new course
            </h2>

            <input
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              placeholder="Subject code (e.g. CSE201)"
              className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#0C1D4F]/40"
            />

            <div className="flex justify-end gap-2">
              <Button
                className="bg-gray-300 text-black px-4 py-1 rounded"
                onClick={() => {
                  setShowAdder(false);
                  setCourseCode("");
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#0C1D4F] text-white px-4 py-1 rounded"
                onClick={handleAddCourse}
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
