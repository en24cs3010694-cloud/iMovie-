const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  description: { type: String, required: true },
  genre: { type: String, required: true, index: true },
  language: { type: String, required: true, index: true },
  duration: { type: String, required: true },
  rating: { type: Number, default: 8.5 },
  location: { type: String, default: 'Indore', index: true },
  theatre: { type: String, default: 'PVR Treasure Island' },
  posterUrl: { type: String, required: true },
  releaseDate: { type: String, required: true }
}, { timestamps: true });

// Compound index for optimized movie search and filtering
movieSchema.index({ title: 'text', genre: 1, language: 1, location: 1 });

module.exports = mongoose.model('Movie', movieSchema);
