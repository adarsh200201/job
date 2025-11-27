const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    type: { type: String, enum: ['Full-Time', 'Part-Time', 'Internship', 'Contract', 'Remote'], required: true },
    experience: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    applyLink: { type: String, required: true, trim: true },
    image: { type: String, trim: true },
    whatsapp: { type: String, trim: true },
    telegram: { type: String, trim: true },
    contact: { type: String, trim: true },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

module.exports = mongoose.model('Job', JobSchema);
