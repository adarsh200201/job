const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    googleId: { type: String, unique: true, sparse: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, trim: true },
    avatar: { type: String },
    provider: { type: String, default: 'google' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
