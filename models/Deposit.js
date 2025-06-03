const mongoose = require('mongoose');

const DepositSchema = new mongoose.Schema({
  trxId: String,
  amount: Number,
  charge: Number,
  rate: Number,
  totalPaid: Number,
  status: {
    type: String,
    default: 'Pending',
  },
  gateway: String,
  fileUrl: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Deposit', DepositSchema);
