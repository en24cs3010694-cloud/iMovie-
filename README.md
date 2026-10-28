# IMovies - Movie Ticket Booking Made Simple (MERN Stack)

A full-stack Movie Ticket Booking and Cinema Management platform built using **MongoDB, Express.js, React.js, and Node.js (MERN Stack)** with **JWT Role-Based Authentication**, **Real-Time Seat Tracking (Socket.io)**, and **Bootstrap 5**.

## Features Implemented
1. **User Authentication & Role-Based Security**:
   - Secure Registration & Login using `bcryptjs` password hashing and `jsonwebtoken` (JWT).
   - Protected routes for `User` and `Admin` roles plus API rate limiting (`express-rate-limit`).
2. **Movie Search & Filtering**:
   - Filter movies dynamically by **Genre**, **Language**, **Theatre**, **Location/City**, and **Date**.
3. **Interactive Real-Time Seat Selection**:
   - Visual cinema screen and seat grid (Standard, Executive, VIP rows) with real-time seat availability tracking via `Socket.io`.
4. **Ticket Booking, Payment & Cancellation**:
   - Instant checkout simulation, booking confirmation, booking history dashboard, and 1-click booking cancellation with automatic seat release.
5. **Admin Management Panel**:
   - Full CRUD operations to add/delete Movies, Theatres, and Showtimes, and monitor total bookings & revenue.
6. **Database Design & Indexing (8 MongoDB Collections)**:
   - `Users`, `Movies`, `Theatres`, `Shows`, `Seats`, `Bookings`, `Payments`, and `Notifications` with optimized compound indexes.

---

## Project Structure
```
imovies-mern/
├── backend/                  # Node.js + Express.js REST API & Socket.io Server
│   ├── config/db.js          # MongoDB connection with automatic in-memory fallback
│   ├── middleware/auth.js    # JWT authentication, Admin guard & error handler
│   ├── models/               # 8 Mongoose schemas with indexing
│   │   ├── User.js
│   │   ├── Movie.js
│   │   ├── Theatre.js
│   │   ├── Show.js
│   │   ├── Seat.js
│   │   ├── Booking.js
│   │   ├── Payment.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── movieRoutes.js
│   │   └── bookingRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/                 # React.js + Bootstrap 5 + Redux + Axios Client
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   └── Navbar.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── MovieDetails.jsx
    │   │   ├── MyBookings.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   └── Auth.jsx
    │   ├── redux/
    │   │   └── store.js
    │   ├── App.js
    │   └── index.js
    └── package.json
```

---

## Quick Start Instructions

### 1. Backend Setup
```bash
cd backend
npm install
npm start
```
The backend server runs on `http://localhost:5000`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm start
```
The React application runs on `http://localhost:3000`.
