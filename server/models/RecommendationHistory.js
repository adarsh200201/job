const mongoose = require('mongoose');

const RecommendationHistorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
    score: { type: Number, required: true },
    clicked: { type: Boolean, default: false },
    applied: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('RecommendationHistory', RecommendationHistorySchema);
