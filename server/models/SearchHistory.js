const mongoose = require('mongoose');

const SearchHistorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    sessionId: { type: String, index: true },
    query: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('SearchHistory', SearchHistorySchema);
