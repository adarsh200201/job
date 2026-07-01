const mongoose = require('mongoose');

const QueueJobSchema = new mongoose.Schema(
  {
    jobHash: { type: String, required: true, unique: true },
    jobData: { type: mongoose.Schema.Types.Mixed, required: true },
    imagePath: { type: String, default: '' },
    isGovernment: { type: Boolean, default: false },
    priority: { type: Number, default: 0 },
    retries: { type: Number, default: 0 },
    timestamp: { type: Number, required: true }
  },
  { timestamps: true }
);

QueueJobSchema.index({ isGovernment: 1, priority: -1, timestamp: 1 });

module.exports = mongoose.model('QueueJob', QueueJobSchema);
