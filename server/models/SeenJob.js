const mongoose = require('mongoose');

const SeenJobSchema = new mongoose.Schema(
  {
    jobHash: { type: String, required: true, unique: true },
    timestamp: { type: Number, required: true }
  },
  { timestamps: true }
);

// Auto-expire seen jobs after 90 days to keep the database size small
SeenJobSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });

module.exports = mongoose.model('SeenJob', SeenJobSchema);
