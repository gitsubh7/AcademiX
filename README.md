## 🔐 Environment Variables

The backend server uses the following environment variables, which should be configured in a `.env` file at the root of the project:

### 🗄️ Database
- `MONGODB_URI` – MongoDB connection string (use your own MongoDB Atlas URI or local URI)

### 🌐 Server Configuration
- `PORT` – Main backend server port (e.g., 3000)
- `PORT2` – Additional port (e.g., for testing/microservices)
- `CORS_ORIGIN` – Allowed origin for CORS requests (`*` for public, or restrict to frontend URL)
- `FRONTEND_ORIGIN` – Frontend application origin (used in cookies/CORS)

### 🔑 JWT Authentication
- `ACCESS_TOKEN_SECRET` – Secret key for generating JWT access tokens
- `REFRESH_TOKEN_SECRET` – Secret key for generating JWT refresh tokens
- `ACCESS_TOKEN_EXPIRY` – Expiry duration for access tokens (e.g., `15m`)
- `REFRESH_TOKEN_EXPIRY` – Expiry duration for refresh tokens (e.g., `7d`)
- `JWT` – Additional JWT secret (used for fallback or legacy purposes)

### ☁️ Cloudinary (Image & File Storage)
- `CLOUDINARY_CLOUD_NAME` – Cloudinary cloud name
- `CLOUDINARY_API_KEY` – API key for Cloudinary
- `CLOUDINARY_API_SECRET` – API secret for Cloudinary

### 📧 Email Configuration (for password reset/OTP)
- `EMAIL` – Sender Gmail address (used via Nodemailer)
- `PASSWORD` – App password or SMTP password for the email account

### 📅 Google Calendar API
- `GOOGLE_API_KEY` – Google Cloud API Key
- `GOOGLE_CLIENT_ID` – OAuth2 client ID from Google Cloud Console
- `GOOGLE_CLIENT_SECRET` – OAuth2 client secret
- `GOOGLE_REDIRECT_URI` – OAuth2 redirect URI (must match Google Cloud Console setting)

---

> ⚠️ **Important:** Never commit your `.env` file to version control (e.g., GitHub). Always add it to your `.gitignore`.





## 🌐 API Documentation

### 🔗 Base URL
- `http://localhost:3000/api/v1`

---

## 📦 Student Routes (`/student`)

### 🔐 Authentication
- `POST /student/register`  
  Register a new student (with profile image upload using `image_url` field).

- `POST /student/login`  
  Login student and receive JWT token.

- `POST /student/logout`  
  Logout the student (requires JWT).

---

### 👤 Profile Management
- `GET /student/getStudent`  
  Get the currently logged-in student's profile.

- `POST /student/updateStudent`  
  Update student profile data.

- `POST /student/updateProfileImage`  
  Update profile image (requires image file via `image_url` field).

- `POST /student/changePassword`  
  Change password for authenticated user.

---

### 🔑 Password Reset
- `POST /student/requestPasswordReset`  
  Request password reset (OTP/email-based).

- `POST /student/passwordReset`  
  Complete password reset using OTP/token.

---

## 📚 Course Management
- `POST /student/addCourse`  
  Add a new course to the student's profile.

- `POST /student/editCourse`  
  Edit an existing course.

- `DELETE /student/removeCourse`  
  Remove a course from the profile.

---

## 📝 Attendance
- `POST /student/markAbsent`  
  Mark the student as absent.

- `POST /student/markPresent`  
  Mark the student as present.

- `GET /student/getAttendance`  
  Retrieve attendance history and summary.

---

## 🗃️ Document Management
- `POST /student/uploadDocument`  
  Upload a document file (requires `localDocument` field).

- `GET /student/getAllDocuments`  
  Get all uploaded documents for the student.

- `DELETE /student/deleteDocument/:id`  
  Delete a document by its ID.

---

## 📅 Google Calendar Integration
- `GET /student/google`  
  Start Google OAuth2 login flow.

- `GET /student/google/redirect`  
  Handle OAuth2 redirect, save tokens.

- `POST /student/addClass`  
  Add a class event to Google Calendar.

---

## 👨‍💻 Coding Profiles
- `GET /student/github/:username`  
  Get public GitHub profile data.

- `GET /student/codeforces/:username` *(JWT required)*  
  Get Codeforces user data.

- `GET /student/leetcode/:username` *(JWT required)*  
  Get LeetCode user profile data.

---

### 🏆 Coding Rankings
- `GET /student/codeForcesRankings`  
  Global Codeforces leaderboard.

- `GET /student/leetcodeRankingsC`  
  LeetCode contest-based rankings.

- `GET /student/leetcodeRankingsQ`  
  LeetCode problem-solved-based rankings.

---

## 🌦️ Weather API (`/weather`)
- `GET /weather/patna`  
  Get real-time weather details for Patna.

- `GET /weather/bihta`  
  Get real-time weather details for Bihta.
