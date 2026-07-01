const mongoose = require('mongoose');

const LinkedinGovtPostSchema = new mongoose.Schema(
  {
    timestamp: { type: Number, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('LinkedinGovtPost', LinkedinGovtPostSchema);
