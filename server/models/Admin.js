const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    twoFactorSecret: { type: String, default: '' },
    twoFactorEnabled: { type: Boolean, default: false },
    refreshToken: { type: String, default: '' }
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

module.exports = mongoose.model('Admin', AdminSchema);
