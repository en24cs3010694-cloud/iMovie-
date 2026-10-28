const mongoose = require('mongoose');

const theatreSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  location: { type: String, required: true, index: true },
  city: { type: String, required: true },
  totalScreens: { type: Number, default: 4 },
  facilities: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Theatre', theatreSchema);
