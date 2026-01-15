const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  operationNumber: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['yape', 'plin'],
    required: true
  },
  amount: {
    type: Number,
    default: 0.50
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  cvDownloaded: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  verifiedAt: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('Payment', paymentSchema);
