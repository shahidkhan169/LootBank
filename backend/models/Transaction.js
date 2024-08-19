const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    transactionId: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    timestamp: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['credit', 'debit'], required: true },
    reference: { type: String, required: true },
    note: { type: String },
    status: { type: String, enum: ['success', 'failed'], required: true }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
