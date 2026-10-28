require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/auth');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Connect MongoDB (with seamless fallback)
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Rate Limiting (Security Requirement #4 & #7)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { message: 'Too many requests from this IP, please try again later.' }
});
app.use('/api', apiLimiter);

// Pre-seeded Datastore for instant zero-config execution
const store = {
  users: [
    {
      id: 'u_admin',
      name: 'Naman (Admin)',
      email: 'admin@imovies.com',
      password: bcrypt.hashSync('admin123', 10),
      role: 'admin'
    },
    {
      id: 'u_user',
      name: 'Naman Student',
      email: 'naman@imovies.com',
      password: bcrypt.hashSync('user123', 10),
      role: 'user'
    }
  ],
  movies: [
    {
      id: 'm_1',
      title: 'Interstellar: IMAX Odyssey',
      description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanitys survival.',
      genre: 'Sci-Fi',
      language: 'English',
      duration: '2h 49m',
      rating: 9.4,
      theatre: 'PVR Treasure Island',
      location: 'Indore',
      posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600',
      showTimes: ['10:30 AM', '02:15 PM', '06:30 PM', '09:45 PM'],
      price: 280,
      bookedSeats: { '2026-10-27_06:30 PM': ['B3', 'B4', 'C5', 'C6'] }
    },
    {
      id: 'm_2',
      title: 'Stree 2: Sarkate Ka Aatank',
      description: 'The town of Chanderi faces a new supernatural menace while Vicky and his friends unite to save everyone.',
      genre: 'Comedy',
      language: 'Hindi',
      duration: '2h 27m',
      rating: 8.8,
      theatre: 'INOX C21 Mall',
      location: 'Indore',
      posterUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600',
      showTimes: ['11:00 AM', '03:00 PM', '07:00 PM', '10:15 PM'],
      price: 240,
      bookedSeats: { '2026-10-27_07:00 PM': ['A1', 'A2', 'D4'] }
    },
    {
      id: 'm_3',
      title: 'Kalki 2898 AD',
      description: 'A modern-day avatar of Vishnu descends to Earth to protect the world from dark futuristic forces.',
      genre: 'Action',
      language: 'Hindi',
      duration: '3h 01m',
      rating: 9.0,
      theatre: 'Cinepolis Phoenix Citadel',
      location: 'Indore',
      posterUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=600',
      showTimes: ['10:00 AM', '01:45 PM', '05:30 PM', '09:30 PM'],
      price: 300,
      bookedSeats: {}
    },
    {
      id: 'm_4',
      title: 'Dune: Part Two',
      description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators.',
      genre: 'Sci-Fi',
      language: 'English',
      duration: '2h 46m',
      rating: 9.2,
      theatre: 'PVR Jio World Plaza',
      location: 'Mumbai',
      posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600',
      showTimes: ['12:00 PM', '04:00 PM', '08:00 PM'],
      price: 350,
      bookedSeats: {}
    }
  ],
  bookings: [],
  payments: []
};

// Socket.io Real-Time Seat Tracking
io.on('connection', (socket) => {
  console.log('Client connected for real-time seat updates:', socket.id);
  socket.on('disconnect', () => {});
});

// Routes
app.use('/api/auth', require('./routes/authRoutes')(store));
app.use('/api/movies', require('./routes/movieRoutes')(store));
app.use('/api/bookings', require('./routes/bookingRoutes')(store, io));

app.get('/', (req, res) => {
  res.json({ status: 'OK', service: 'IMovies MERN Backend API', version: '1.0.0' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`IMovies Backend Server running on http://localhost:${PORT}`);
});
