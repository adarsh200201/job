const mongoose = require('mongoose');

const SeoKeywordMetricSchema = new mongoose.Schema(
  {
    keyword: { type: String, required: true, trim: true },
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    ctr: { type: Number, default: 0 },
    position: { type: Number, default: 0 },
    page: { type: String, required: true, trim: true },
    date: { type: Date, required: true }
  },
  {
    timestamps: true
  }
);

// Compound index to ensure uniqueness per keyword, page, and date
SeoKeywordMetricSchema.index({ keyword: 1, page: 1, date: 1 }, { unique: true });
SeoKeywordMetricSchema.index({ date: -1 });
SeoKeywordMetricSchema.index({ keyword: 1 });

module.exports = mongoose.model('SeoKeywordMetric', SeoKeywordMetricSchema);
