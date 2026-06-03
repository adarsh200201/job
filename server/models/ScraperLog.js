const mongoose = require('mongoose');

const ScraperLogSchema = new mongoose.Schema(
  {
    runType: { type: String, enum: ['manual', 'scheduled'], default: 'manual' },
    startedAt: { type: Date, default: Date.now },
    finishedAt: { type: Date },
    durationMs: { type: Number },
    sourcesAttempted: { type: Number, default: 0 },
    sourcesSuccess: { type: Number, default: 0 },
    sourcesFailed: { type: Number, default: 0 },
    itemsFound: { type: Number, default: 0 },
    itemsDuplicate: { type: Number, default: 0 },
    itemsSaved: { type: Number, default: 0 },
    errors: [
      {
        source: String,
        message: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    status: { type: String, enum: ['running', 'success', 'failed', 'partial'], default: 'running' },
  },
  { timestamps: true }
);

// Auto-delete scraper logs after 7 days to prevent storage bloat
ScraperLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 }); // 7 days

module.exports = mongoose.model('ScraperLog', ScraperLogSchema);
