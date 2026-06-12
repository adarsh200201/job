const mongoose = require('mongoose');

const GovernmentJobPreferencesSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    scoreSSC: { type: Number, default: 0 },
    scoreRailway: { type: Number, default: 0 },
    scoreBanking: { type: Number, default: 0 },
    scoreCivilServices: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('GovernmentJobPreferences', GovernmentJobPreferencesSchema);
