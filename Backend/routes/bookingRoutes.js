const express = require('express');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

module.exports = (store, io) => {
  // POST /api/bookings - Create new ticket booking & payment record
  router.post('/', verifyToken, (req, res) => {
    const { movieId, showDate, showTime, seats, paymentMethod } = req.body;
    if (!movieId || !showTime || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ message: 'Please select a movie, showtime, and at least 1 seat' });
    }
    const movie = store.movies.find(m => m.id === movieId);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    const key = `${showDate || '2026-10-27'}_${showTime}`;
    if (!movie.bookedSeats[key]) movie.bookedSeats[key] = [];

    // Validate seat availability
    const alreadyBooked = seats.some(s => movie.bookedSeats[key].includes(s));
    if (alreadyBooked) {
      return res.status(409).json({ message: 'One or more selected seatswere just booked. Please pick another seat.' });
    }

    movie.bookedSeats[key].push(...seats);
    const totalAmount = seats.length * (movie.price || 250);

    const newBooking = {
      id: 'BK' + Math.floor(100000 + Math.random() * 900000),
      userId: req.user.id,
      userName: req.user.name,
      movieId: movie.id,
      movieTitle: movie.title,
      theatreName: movie.theatre,
      location: movie.location,
      showDate: showDate || '2026-10-27',
      showTime,
      seats,
      totalAmount,
      paymentMethod: paymentMethod || 'UPI',
      paymentStatus: 'Paid',
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };

    store.bookings.unshift(newBooking);
    store.payments.unshift({
      id: 'PAY' + Date.now(),
      bookingId: newBooking.id,
      userId: req.user.id,
      amount: totalAmount,
      paymentMethod: paymentMethod || 'UPI',
      transactionId: 'TXN' + Math.floor(10000000 + Math.random() * 90000000),
      status: 'Success'
    });

    if (io) {
      io.emit('seatsUpdated', { movieId, showDate: newBooking.showDate, showTime, bookedSeats: movie.bookedSeats[key] });
    }

    res.status(201).json({
      message: 'Booking confirmed and payment processed!',
      booking: newBooking
    });
  });

  // GET /api/bookings/my - Current user's bookings
  router.get('/my', verifyToken, (req, res) => {
    const userBookings = store.bookings.filter(b => b.userId === req.user.id || req.user.role === 'admin');
    res.json(userBookings);
  });

  // PATCH /api/bookings/:id/cancel - Cancel booking & release seats
  router.patch('/:id/cancel', verifyToken, (req, res) => {
    const booking = store.bookings.find(b => b.id === req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    booking.status = 'Cancelled';
    booking.paymentStatus = 'Refunded';

    const movie = store.movies.find(m => m.id === booking.movieId);
    if (movie) {
      const key = `${booking.showDate}_${booking.showTime}`;
      if (movie.bookedSeats[key]) {
        movie.bookedSeats[key] = movie.bookedSeats[key].filter(s => !booking.seats.includes(s));
      }
    }
    res.json({ message: 'Booking cancelled and refund initiated', booking });
  });

  return router;
};
