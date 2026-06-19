const mongoose = require('mongoose');

const SeoIndexStatusSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, unique: true, trim: true },
    submittedAt: { type: Date },
    indexedAt: { type: Date },
    status: { 
      type: String, 
      enum: ['Indexed', 'Not Indexed', 'Pending', 'Failed'], 
      default: 'Pending' 
    }
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
  }
);

// Add index for fast searches on URL and status
SeoIndexStatusSchema.index({ status: 1 });

module.exports = mongoose.model('SeoIndexStatus', SeoIndexStatusSchema);
