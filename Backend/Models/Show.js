const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true, index: true },
  theatreName: { type: String, required: true, index: true },
  location: { type: String, required: true },
  date: { type: String, required: true, index: true },
  time: { type: String, required: true },
  price: { type: Number, required: true, default: 250 },
  bookedSeats: [{ type: String }]
}, { timestamps: true });

showSchema.index({ movieId: 1, date: 1, theatreName: 1 });

module.exports = mongoose.model('Show', showSchema);
