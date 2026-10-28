const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  userName: { type: String, required: true },
  movieId: { type: String, required: true },
  movieTitle: { type: String, required: true },
  theatreName: { type: String, required: true },
  showDate: { type: String, required: true },
  showTime: { type: String, required: true },
  seats: [{ type: String, required: true }],
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['Paid', 'Refunded'], default: 'Paid' },
  status: { type: String, enum: ['Confirmed', 'Cancelled'], default: 'Confirmed', index: true }
}, { timestamps: true });

bookingSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);
