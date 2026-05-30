const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    googleId: { type: String, unique: true, sparse: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, trim: true },
    avatar: { type: String },
    provider: { type: String, default: 'google' },
    
    // Onboarding details
    phone: { type: String, trim: true },
    location: { type: String, trim: true },
    preferredRole: { type: String, trim: true },
    skills: [{ type: String, trim: true }],
    experienceLevel: { type: String, trim: true },
    education: {
      collegeName: { type: String, trim: true },
      degree: { type: String, trim: true },
      branch: { type: String, trim: true },
      graduationYear: { type: String, trim: true }
    },
    onboardingCompleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
