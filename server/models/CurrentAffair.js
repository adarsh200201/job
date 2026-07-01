const mongoose = require('mongoose');

const CurrentAffairSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['National', 'International', 'Economy', 'Science & Tech', 'Sports']
  },
  date: {
    type: Date,
    default: Date.now
  },
  summary: {
    type: String,
    required: true
  },
  source: {
    type: String,
    default: 'General Knowledge Bureau'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CurrentAffair', CurrentAffairSchema);
