const mongoose = require('mongoose');

const ScrapedItemSchema = new mongoose.Schema(
  {
    sourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Source', required: true },
    sourceName: { type: String, trim: true },
    rawTitle: { type: String, trim: true },
    rawUrl: { type: String, trim: true },
    rawContent: { type: String },
    contentHash: { type: String, trim: true }, // MD5 for duplicate detection
    status: {
      type: String,
      enum: ['pending', 'ai_processing', 'ai_done', 'approved', 'rejected', 'duplicate'],
      default: 'pending',
    },
    // AI-generated fields
    aiMeta: {
      title: String,
      metaTitle: String,
      metaDescription: String,
      articleHtml: String,
      faqs: [{ q: String, a: String }],
      category: String,
      tags: [String],
    },
    // Final data after approval
    publishedJobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    adminNote: { type: String },
    aiError: { type: String },
  },
  { timestamps: true }
);

ScrapedItemSchema.index({ contentHash: 1 });
ScrapedItemSchema.index({ status: 1, createdAt: -1 });
// Auto-delete scraped items after 3 days to prevent storage bloat
ScrapedItemSchema.index({ createdAt: 1 }, { expireAfterSeconds: 259200 }); // 3 days

module.exports = mongoose.model('ScrapedItem', ScrapedItemSchema);
