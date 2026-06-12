const mongoose = require('mongoose');

const UserActivitySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    sessionId: { type: String, index: true },
    activityType: {
      type: String,
      enum: ['view', 'apply', 'save', 'share', 'time_spent', 'click_category'],
      required: true
    },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', index: true },
    category: { type: String },
    details: { type: mongoose.Schema.Types.Mixed }
  },
  { timestamps: true }
);

// TTL index to automatically delete records older than 30 days
UserActivitySchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

module.exports = mongoose.model('UserActivity', UserActivitySchema);
