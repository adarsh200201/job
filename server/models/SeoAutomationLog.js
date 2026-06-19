const mongoose = require('mongoose');

const SeoAutomationLogSchema = new mongoose.Schema(
  {
    taskName: {
      type: String,
      required: true,
      enum: [
        'health_checker',
        'gsc_keyword_sync',
        'index_tracker',
        'auto_optimizer',
        'content_refresh',
        'keyword_gap_finder'
      ]
    },
    status: {
      type: String,
      enum: ['success', 'failed', 'running', 'skipped'],
      default: 'running'
    },
    message:   { type: String, default: '' },
    details:   { type: mongoose.Schema.Types.Mixed, default: {} }, // Extra stats from the task
    ranAt:     { type: Date, default: Date.now },
    durationMs: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// Index for efficient queries by task name and date
SeoAutomationLogSchema.index({ taskName: 1, ranAt: -1 });
SeoAutomationLogSchema.index({ ranAt: -1 });

module.exports = mongoose.model('SeoAutomationLog', SeoAutomationLogSchema);
