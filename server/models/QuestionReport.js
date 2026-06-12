const mongoose = require('mongoose');

const questionReportSchema = new mongoose.Schema({
  questionId: { type: String, required: true },
  questionText: { type: String },
  category: { type: String },
  topic: { type: String },
  type: { type: String, required: true },
  comment: { type: String, required: true },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Resolved', 'Ignored'] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QuestionReport', questionReportSchema);
