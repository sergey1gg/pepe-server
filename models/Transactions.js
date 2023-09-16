const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  blockNumber: Number,
  from: String,
  to: String,
  tokenSymbol: String,
  value: String,
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
