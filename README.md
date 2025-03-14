# AcademiX

AcademiX is a comprehensive student dashboard application designed to streamline academic management. It includes a **Frontend** built with React and Vite, a **Backend** powered by Node.js and Express, and an **ML module** for face recognition.

---

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
  - [Frontend](#frontend-setup)
  - [Backend](#backend-setup)
  - [ML Module](#ml-module-setup)
- [API Endpoints](#api-endpoints)
- [License](#license)

---

## Features

### Frontend
- Built with **React** and **Vite** for a fast and modern UI.
- Responsive design with custom CSS.
- ESLint integration for code quality.

### Backend
- RESTful API built with **Express** and **MongoDB**.
- Authentication using **JWT**.
- Google Calendar integration for scheduling classes.
- Attendance management system.
- Integration with external APIs (GitHub, Codeforces, LeetCode).

### ML Module
- Face recognition for student verification using **face-recognition** library.
- Integration with MongoDB to fetch and verify student images.

---

## Technologies Used

### Frontend
- React
- Vite
- CSS

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- Cloudinary (for image uploads)
- Nodemailer (for email notifications)

### ML Module
- Flask
- face-recognition
- OpenCV
- MongoDB

---

## Project Structure

AcademiX/ ├── Backend/ │ ├── public/ # Static files │ ├── src/ │ │ ├── controllers/ # API controllers │ │ ├── middlewares/ # Middleware functions │ │ ├── models/ # Mongoose models │ │ ├── routes/ # API routes │ │ ├── utils/ # Utility functions │ │ ├── app.js # Express app setup │ │ ├── index.js # Entry point │ │ └── constants.js # Constants │ └── package.json # Backend dependencies ├── Frontend/ │ ├── src/ │ │ ├── App.jsx # Main React component │ │ ├── main.jsx # React entry point │ │ ├── index.css # Global styles │ │ └── App.css # Component-specific styles │ └── package.json # Frontend dependencies ├── ML/ │ ├── face_recog.py # Face recognition API │ ├── requirements.txt # Python dependencies │ └── .gitignore # Ignored files └── README.md # Project documentation


