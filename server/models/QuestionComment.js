const mongoose = require('mongoose');

const questionCommentSchema = new mongoose.Schema({
  questionId: { type: String, required: true },
  username: { type: String, required: true, default: 'Anonymous' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QuestionComment', questionCommentSchema);
