const mongoose = require('mongoose');
const slugify = require('slugify');

const JobSchema = new mongoose.Schema(
  {
    // Basic Information
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    type: { 
      type: String, 
      enum: ['Full-Time', 'Part-Time', 'Internship', 'Contract', 'Remote', 'Hybrid'], 
      required: true 
    },
    
    // Job Details
    experience: { type: String, required: true, trim: true },
    salary: { type: String, trim: true },
    jobDescription: { type: String, required: true },
    responsibilities: { type: [String], default: [] },
    requirements: { type: [String], default: [] },
    skills: { type: [String], default: [] },
    
    // Eligibility Criteria
    education: { type: String, required: true, trim: true },
    batch: { type: String, trim: true }, // e.g., "2025 Batch"
    
    // Application Details
    applyLink: { type: String, required: true, trim: true },
    lastDate: { type: Date },
    
    // Media
    image: { type: String, trim: true },
    
    // New "About" field
    aboutCompany: { type: String, trim: true },
    whyJoin: { type: String, trim: true },
    description: { type: String, trim: true },
    howToApply: { type: String, trim: true },
    finalThoughts: { type: String, trim: true },
    // Highlighted sentence shown in details (bold)
    highlightText: { type: String, trim: true },

    // Contact Information
    whatsapp: { type: String, trim: true },
    telegram: { type: String, trim: true },
    contact: { type: String, trim: true },
    
    // SEO Fields
    metaTitle: { type: String, trim: true },
    metaDescription: { type: String, trim: true },
    
    // Status
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    
    // Admin
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    
    // System
    views: { type: Number, default: 0 },
    applications: { type: Number, default: 0 }
  },
  { 
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create slug from title before saving (using consistent slugify method)
JobSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
      trim: true
    });
  }
  next();
});

// Add indexes for faster queries
// Note: slug index is already created via 'unique: true' in the schema
JobSchema.index({ isActive: 1, createdAt: -1 });
JobSchema.index({ company: 1 });
JobSchema.index({ location: 1 });

// Automatically delete job postings after 10 days (864,000 seconds)
JobSchema.index({ createdAt: 1 }, { expireAfterSeconds: 864000 });

module.exports = mongoose.model('Job', JobSchema);
