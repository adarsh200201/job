const mongoose = require('mongoose');
const slugify = require('slugify');

const JobSchema = new mongoose.Schema(
  {
    // Basic Information
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, required: function() { return !this.isGovernment; }, trim: true },
    type: { 
      type: String, 
      enum: ['Full-Time', 'Part-Time', 'Internship', 'Contract', 'Remote', 'Hybrid'], 
      required: function() { return !this.isGovernment; }
    },
    
    // Job Details
    experience: { type: String, required: function() { return !this.isGovernment; }, trim: true },
    salary: { type: String, trim: true },
    jobDescription: { type: String, required: true },
    responsibilities: { type: [String], default: [] },
    requirements: { type: [String], default: [] },
    skills: { type: [String], default: [] },
    
    // Eligibility Criteria
    education: { type: String, required: function() { return !this.isGovernment; }, trim: true },
    batch: { type: String, trim: true }, // e.g., "2025 Batch"
    eligibility: { type: String, trim: true },
    vacancies: { type: String, trim: true },
    
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
    
    // Scraper Metadata
    postType: { type: String, default: 'Job', trim: true },
    sourceWebsite: { type: String, trim: true },
    sourceUrl: { type: String, trim: true },
    importantDates: { type: String, trim: true },
    pdfLink: { type: String, trim: true },
    isGovernment: { type: Boolean, default: false },
    eligibility: { type: String, trim: true },
    vacancies: { type: String, trim: true },
    
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
JobSchema.pre('save', async function(next) {
  if (!this.slug) {
    let base = slugify(this.title, { lower: true, strict: true, trim: true });
    if (!base) {
      base = 'job';
    }
    let slug = base;
    let counter = 1;
    while (true) {
      const collision = await this.constructor.findOne({ 
        slug, 
        _id: { $ne: this._id } 
      });
      if (!collision) {
        break;
      }
      slug = `${base}-${counter}`;
      counter++;
    }
    this.slug = slug;
  }
  next();
});

// Add indexes for faster queries
JobSchema.index({ isActive: 1, createdAt: -1 });
JobSchema.index({ isActive: 1, postType: 1, updatedAt: -1 });
JobSchema.index({ postType: 1 });
JobSchema.index({ company: 1 });
JobSchema.index({ location: 1 });

// Automatically delete job postings after 10 days (864,000 seconds)
JobSchema.index({ createdAt: 1 }, { expireAfterSeconds: 864000 });

module.exports = mongoose.model('Job', JobSchema);
