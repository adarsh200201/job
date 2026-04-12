const Job = require('../models/Job');
const slugify = require('slugify');

// Helper function to build filters for job search
function buildFilters(query) {
  const filters = {}; // Default empty filters
  
  // Only show active jobs by default, unless status=all is passed
  if (query.status !== 'all') {
    filters.isActive = true;
  }  
  // Text search across multiple fields
  if (query.q) {
    const regex = new RegExp(query.q, 'i');
    filters.$or = [
      { title: regex },
      { company: regex },
      { location: regex },
      { jobDescription: regex },
      { 'education': regex },
      { 'skills': { $in: [new RegExp(query.q, 'i')] } }
    ];
  }
  
  // Filter by location (case-insensitive partial match)
  if (query.location) {
    filters.location = new RegExp(query.location, 'i');
  }
  
  // Filter by job type
  if (query.type) {
    filters.type = query.type;
  }
  
  // Filter by experience level
  if (query.experience) {
    filters.experience = new RegExp(query.experience, 'i');
  }
  
  // Filter by education
  if (query.education) {
    filters.education = new RegExp(query.education, 'i');
  }
  
  // Filter by featured jobs
  if (query.featured === 'true') {
    filters.isFeatured = true;
  }
  
  return filters;
}

// Get all jobs with filters
// GET /api/jobs?q=search&location=city&type=Full-Time&experience=Fresher&education=B.Tech
// GET /api/jobs?featured=true
// GET /api/jobs?limit=10&page=1
// GET /api/jobs?sort=-createdAt
// GET /api/jobs?fields=title,company,location,salary
exports.getJobs = async (req, res) => {
  try {
    // Build filters
    const filters = buildFilters(req.query);
    
    // Build query
    let query = Job.find(filters);
    
    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt'); // Default: newest first
    }
    
    // Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v -updatedAt'); // Exclude some fields by default
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    const total = await Job.countDocuments(filters);
    
    query = query.skip(skip).limit(limit);
    
    // Execute query
    const jobs = await query.lean();
    
    // Calculate total pages
    const totalPages = Math.ceil(total / limit);
    
    // Send response with pagination info
    res.json({
      success: true,
      count: jobs.length,
      total,
      totalPages,
      currentPage: page,
      data: jobs
    });
    
  } catch (e) {
    console.error('Error fetching jobs:', e);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch jobs',
      error: process.env.NODE_ENV === 'development' ? e.message : undefined
    });
  }
};

// Get job by ID or slug
// GET /api/jobs/:idOrSlug
exports.getJobById = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    
    // Check if the parameter is a valid MongoDB ObjectId (24 char hex string)
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
    
    let job;
    
    if (isObjectId) {
      // If it's an ObjectId, search by _id
      job = await Job.findById(idOrSlug);
    } else {
      // Otherwise, search by slug
      job = await Job.findOne({ slug: idOrSlug });
    }
    
    if (!job) {
      return res.status(404).json({ 
        success: false, 
        message: 'Job not found' 
      });
    }
    
    // Increment view count
    job.views += 1;
    await job.save();
    
    res.json({
      success: true,
      data: job
    });
    
  } catch (e) {
    console.error('Error fetching job:', e);
    res.status(400).json({ 
      success: false, 
      message: 'Invalid job identifier',
      error: process.env.NODE_ENV === 'development' ? e.message : undefined
    });
  }
};

// Create a new job
// POST /api/jobs
exports.createJob = async (req, res) => {
  try {
    const {
      title, company, location, type, experience, jobDescription,
      responsibilities, requirements, skills, education, batch,
      salary, applyLink, lastDate, image, whatsapp, telegram, contact,
      metaTitle, metaDescription, isFeatured,
      aboutCompany, whyJoin, description, howToApply, finalThoughts, highlightText
    } = req.body;
    
    // Required fields validation
    if (!title || !company || !location || !type || !experience || !jobDescription || !education || !applyLink) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }
    
    // Create slug from title if not provided
    const slug = slugify(title, {
      lower: true,
      strict: true,
      trim: true
    });
    
    // Create job
    const job = await Job.create({
      title,
      slug,
      company,
      location,
      type,
      experience,
      jobDescription,
      responsibilities: Array.isArray(responsibilities) ? responsibilities : [responsibilities].filter(Boolean),
      requirements: Array.isArray(requirements) ? requirements : [requirements].filter(Boolean),
      skills: Array.isArray(skills) ? skills : [skills].filter(Boolean),
      education,
      batch,
      salary,
      applyLink,
      lastDate: lastDate || null,
      image,
      whatsapp,
      telegram,
      contact,
      aboutCompany: aboutCompany || '',
      whyJoin: whyJoin || '',
      description: description || '',
      howToApply: howToApply || '',
      finalThoughts: finalThoughts || '',
      highlightText: highlightText || '',
      metaTitle: metaTitle || `${title} - ${company} - Job Openings`,
      metaDescription: metaDescription || `${title} at ${company} in ${location}. ${jobDescription.substring(0, 150)}...`,
      isFeatured: isFeatured || false,
      postedBy: req.user?.id
    });
    
    res.status(201).json({
      success: true,
      data: job
    });
    
  } catch (e) {
    console.error('Error creating job:', e);
    
    // Handle duplicate key error (e.g., duplicate slug)
    if (e.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A job with this title already exists',
        field: Object.keys(e.keyPattern)[0]
      });
    }
    
    res.status(400).json({
      success: false,
      message: 'Failed to create job',
      error: process.env.NODE_ENV === 'development' ? e.message : undefined
    });
  }
};

// Update a job
// PUT /api/jobs/:id
exports.updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // If title is being updated, update the slug as well
    if (updates.title) {
      updates.slug = slugify(updates.title, {
        lower: true,
        strict: true,
        trim: true
      });
    }
    
    const job = await Job.findByIdAndUpdate(
      id, 
      updates, 
      { 
        new: true,  // Return the updated document
        runValidators: true  // Run model validators on update
      }
    );
    
    if (!job) {
      return res.status(404).json({ 
        success: false, 
        message: 'Job not found' 
      });
    }
    
    res.json({
      success: true,
      data: job
    });
    
  } catch (e) {
    console.error('Error updating job:', e);
    
    // Handle duplicate key error
    if (e.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A job with this title already exists',
        field: Object.keys(e.keyPattern)[0]
      });
    }
    
    res.status(400).json({
      success: false,
      message: 'Failed to update job',
      error: process.env.NODE_ENV === 'development' ? e.message : undefined
    });
  }
};

// Delete a job
// DELETE /api/jobs/:id
exports.deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    // Log deletion attempt
    // eslint-disable-next-line no-console
    console.log(`[DELETE] Attempting to delete job with ID: ${jobId}`);

    // Find and delete the job from database
    const deletedJob = await Job.findByIdAndDelete(jobId);

    if (!deletedJob) {
      // eslint-disable-next-line no-console
      console.warn(`[DELETE] Job not found with ID: ${jobId}`);
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Log successful deletion
    // eslint-disable-next-line no-console
    console.log(`[DELETE] ✓ Job successfully deleted from database - Title: "${deletedJob.title}", ID: ${jobId}`);

    res.json({
      success: true,
      message: 'Job deleted successfully',
      deletedJob: {
        id: deletedJob._id,
        title: deletedJob.title,
        company: deletedJob.company
      }
    });

  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(`[DELETE] Error deleting job:`, e);
    res.status(400).json({
      success: false,
      message: 'Failed to delete job',
      error: process.env.NODE_ENV === 'development' ? e.message : undefined
    });
  }
};

// Get related jobs
// GET /api/jobs/:id/related
exports.getRelatedJobs = async (req, res) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit, 10) || 5;
    
    // First get the current job to find related ones
    const currentJob = await Job.findById(id);
    
    if (!currentJob) {
      return res.status(404).json({ 
        success: false, 
        message: 'Job not found' 
      });
    }
    
    // Find related jobs (same company, similar title, or same location)
    const relatedJobs = await Job.find({
      _id: { $ne: id }, // Exclude current job
      $or: [
        { company: currentJob.company },
        { location: currentJob.location },
        { type: currentJob.type },
        { experience: currentJob.experience },
        { skills: { $in: currentJob.skills } }
      ]
    })
    .limit(limit)
    .select('title company location type experience salary slug')
    .lean();
    
    res.json({
      success: true,
      count: relatedJobs.length,
      data: relatedJobs
    });
    
  } catch (e) {
    console.error('Error fetching related jobs:', e);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch related jobs',
      error: process.env.NODE_ENV === 'development' ? e.message : undefined
    });
  }
};
