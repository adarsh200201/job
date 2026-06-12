const mongoose = require('mongoose');

const CategoryScoresSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    category: { type: String, required: true },
    score: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// Compound index so a user has exactly one score entry per category
CategoryScoresSchema.index({ userId: 1, category: 1 }, { unique: true });

module.exports = mongoose.model('CategoryScores', CategoryScoresSchema);
