const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  swap: { type: mongoose.Schema.Types.ObjectId, ref: 'Swap', required: true },
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);