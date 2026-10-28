const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, index: true },
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['UPI', 'Card', 'NetBanking'], default: 'UPI' },
  transactionId: { type: String, required: true },
  status: { type: String, enum: ['Success', 'Failed', 'Refunded'], default: 'Success' }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
