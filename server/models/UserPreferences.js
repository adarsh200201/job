const mongoose = require('mongoose');

const UserPreferencesSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    preferredRoles: { type: [String], default: [] },
    preferredLocations: { type: [String], default: [] },
    skills: { type: [String], default: [] },
    experienceLevel: { type: String, trim: true },
    education: {
      degree: { type: String, trim: true },
      branch: { type: String, trim: true }
    },
    resumeText: { type: String, trim: true },
    userCategoryPreferences: { type: [String], default: [] },
    predictedRoles: { type: [String], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('UserPreferences', UserPreferencesSchema);
