import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    degree: {
      type: String,
      required: true,
      enum: ["B.Tech", "M.Tech", "MCA", "PhD"],
    },
    branch: {
      type: String,
      required: true,
      enum: [
        "Applied Physics and Materials Engineering",
        "Architecture & Planning",
        "Chemical Science and Technology",
        "Civil Engineering",
        "Computer Science and Engineering",
        "Electrical Engineering",
        "Electronics and Communication Engineering",
        "Humanities & Social Sciences",
        "Mathematics and Computing Technology",
        "Mechanical Engineering",
        "Mechatronics & Automation Engineering",
      ],
    },
    section: {
      type: String,
      required: true,
      enum: ["1", "2", "3"],
    },
    password: {
      type: String,
      required: true,
    },
    roll_number: {
      type: String,
      required: true,
      unique: true,
    },
    subjects_enrolled: [ //array of course codes
      {
        type: String,
        required: true,
      },
    ],
    image_url: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: null,
      trim: true,
    },
    year: { // 1st, 2nd, 3rd..
      type: String,
      required: true,
    },
    passout_year: { // passout year
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

export const Student = mongoose.model("Student", studentSchema);
