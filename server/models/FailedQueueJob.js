const mongoose = require('mongoose');

const FailedQueueJobSchema = new mongoose.Schema(
  {
    jobHash: { type: String, required: true },
    jobData: { type: mongoose.Schema.Types.Mixed, required: true },
    errorMessage: { type: String, default: '' },
    timestamp: { type: Number, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('FailedQueueJob', FailedQueueJobSchema);
