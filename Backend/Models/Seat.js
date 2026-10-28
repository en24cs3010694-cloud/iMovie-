const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  showId: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true, index: true },
  seatNumber: { type: String, required: true },
  row: { type: String, required: true },
  category: { type: String, enum: ['Standard', 'Executive', 'VIP'], default: 'Standard' },
  price: { type: Number, required: true },
  isBooked: { type: Boolean, default: false, index: true }
}, { timestamps: true });

seatSchema.index({ showId: 1, seatNumber: 1 }, { unique: true });

module.exports = mongoose.model('Seat', seatSchema);
