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

  // Filter by salary range
  if (query.salary) {
    let salaryRegex;
    if (query.salary === '0-3') {
      salaryRegex = /(?:^[0-3](?:\.\d+)?\s*(?:lpa|lakh|lac))|(?:\b(?:[1-9]\d{3}|1\d{4}|2[0-5]\d{3})\b)/i;
    } else if (query.salary === '3-6') {
      salaryRegex = /(?:^[3-6](?:\.\d+)?\s*(?:lpa|lakh|lac))|(?:\b(?:2[5-9]\d{3}|[3-4]\d{4}|50000)\b)/i;
    } else if (query.salary === '6-10') {
      salaryRegex = /(?:^(?:[6-9]|10)(?:\.\d+)?\s*(?:lpa|lakh|lac))|(?:\b(?:5\d{4}|[6-7]\d{4}|8[0-5]\d{3})\b)/i;
    } else if (query.salary === '10-15') {
      salaryRegex = /(?:^(?:1[0-5])(?:\.\d+)?\s*(?:lpa|lakh|lac))|(?:\b(?:8[5-9]\d{3}|9\d{4}|1[0-2]\d{4})\b)/i;
    } else if (query.salary === '15+') {
      salaryRegex = /(?:^(?:1[5-9]|[2-9]\d)(?:\.\d+)?\s*(?:lpa|lakh|lac))|(?:\b(?:1[3-9]\d{4}|[2-9]\d{5})\b)/i;
    }
    if (salaryRegex) {
      filters.salary = salaryRegex;
    }
  }
  
  // Filter by featured jobs
  if (query.featured === 'true') {
    filters.isFeatured = true;
  }
  
  // Filter by government jobs
  if (query.isGovernment) {
    filters.isGovernment = query.isGovernment === 'true';
  }

  // Filter by post type
  if (query.postType) {
    filters.postType = query.postType;
  } else if (query.status !== 'all') {
    filters.postType = { $nin: ['Admit Card', 'Result', 'Answer Key'] };
  }

  // Exclude specific post types (comma-separated) e.g. excludePostType=Syllabus
  if (query.excludePostType) {
    const excludeList = query.excludePostType.split(',').map(s => s.trim()).filter(Boolean);
    if (excludeList.length > 0) {
      if (filters.postType && filters.postType.$nin) {
        // Merge with existing $nin array
        filters.postType.$nin = [...new Set([...filters.postType.$nin, ...excludeList])];
      } else if (!filters.postType) {
        filters.postType = { $nin: excludeList };
      }
    }
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
      metaTitle, metaDescription, isFeatured, isActive,
      aboutCompany, whyJoin, description, howToApply, finalThoughts, highlightText,
      postType, sourceWebsite, sourceUrl, importantDates, pdfLink, isGovernment,
      eligibility, vacancies
    } = req.body;
    
    // Required fields validation
    const isGov = isGovernment === true || isGovernment === 'true';
    let hasMissing = !title || !company || !jobDescription || !applyLink;
    if (!isGov) {
      if (!location || !type || !experience || !education) {
        hasMissing = true;
      }
    } else {
      if (!eligibility || !vacancies) {
        hasMissing = true;
      }
    }

    if (hasMissing) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }
    
    // Create slug from title with a unique suffix to prevent duplicate key errors
    const crypto = require('crypto');
    const slugBase = slugify(title, { lower: true, strict: true, trim: true });
    const slugSuffix = crypto.randomBytes(3).toString('hex'); // e.g. "a1b2c3"
    const slug = `${slugBase}-${slugSuffix}`;
    
    // Create job
    const job = await Job.create({
      title,
      slug,
      company,
      location: isGov ? '' : location,
      type: isGov ? 'Full-Time' : type, // Keep a valid default for database enum if needed
      experience: isGov ? '' : experience,
      jobDescription,
      responsibilities: Array.isArray(responsibilities) ? responsibilities : [responsibilities].filter(Boolean),
      requirements: Array.isArray(requirements) ? requirements : [requirements].filter(Boolean),
      skills: Array.isArray(skills) ? skills : [skills].filter(Boolean),
      education: isGov ? '' : education,
      batch: isGov ? '' : batch,
      eligibility: isGov ? eligibility : '',
      vacancies: isGov ? vacancies : '',
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
      metaDescription: metaDescription || (isGov 
        ? `${title} at ${company}. Eligibility: ${eligibility || ''}. Vacancies: ${vacancies || ''}.`
        : `${title} at ${company} in ${location}. ${jobDescription.substring(0, 150)}...`),
      isFeatured: isFeatured || false,
      isActive: isActive !== undefined ? isActive : true,
      postType: postType || 'Job',
      sourceWebsite: sourceWebsite || '',
      sourceUrl: sourceUrl || '',
      importantDates: importantDates || '',
      pdfLink: pdfLink || '',
      isGovernment: isGov,
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
      error: e.message  // Always expose for debugging
    });
  }
};

// Update a job
// PUT /api/jobs/:id
exports.updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // If title is being updated, update the slug as well and validate/sanitize government fields
    if (updates.title) {
      updates.slug = slugify(updates.title, {
        lower: true,
        strict: true,
        trim: true
      });

      const isGov = updates.isGovernment === true || updates.isGovernment === 'true';
      let hasMissing = !updates.title || !updates.company || !updates.jobDescription || !updates.applyLink;
      if (!isGov) {
        if (!updates.location || !updates.type || !updates.experience || !updates.education) {
          hasMissing = true;
        }
      } else {
        if (!updates.eligibility || !updates.vacancies) {
          hasMissing = true;
        }
      }

      if (hasMissing) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required fields' 
        });
      }

      // Sanitize fields based on government status
      if (isGov) {
        updates.location = '';
        updates.type = 'Full-Time';
        updates.experience = '';
        updates.education = '';
        updates.batch = '';
      } else {
        updates.eligibility = '';
        updates.vacancies = '';
      }
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

// Get job stats/counts for sidebar filters
// GET /api/jobs/stats
exports.getJobStats = async (req, res) => {
  try {
    const baseQuery = { isActive: true };

    const [
      // Work Mode & Type
      remoteTypeCount,
      hybridTypeCount,
      fullTimeCount,
      partTimeCount,
      internshipCount,

      // Experience
      fresherCount,
      exp1to3Count,
      exp3to5Count,
      exp5plusCount,

      // Job Category
      govCount,
      privateCount,

      // Locations
      remoteLocCount,
      delhiCount,
      blrCount,
      mumbaiCount,
      puneCount,
      hydCount,

      // Education
      graduateCount,
      btechCount,
      diplomaCount,
      twelfthCount,
      tenthCount,

      // Salary Ranges
      salary0to3Count,
      salary3to6Count,
      salary6to10Count,
      salary10to15Count,
      salary15plusCount
    ] = await Promise.all([
      // Work Mode & Type
      Job.countDocuments({ ...baseQuery, $or: [{ type: 'Remote' }, { location: /remote/i }] }),
      Job.countDocuments({ ...baseQuery, type: 'Hybrid' }),
      Job.countDocuments({ ...baseQuery, type: 'Full-Time' }),
      Job.countDocuments({ ...baseQuery, type: 'Part-Time' }),
      Job.countDocuments({ ...baseQuery, type: 'Internship' }),

      // Experience
      Job.countDocuments({ ...baseQuery, experience: /fresher/i }),
      Job.countDocuments({ ...baseQuery, experience: /1|2|3/ }),
      Job.countDocuments({ ...baseQuery, experience: /3|4|5/ }),
      Job.countDocuments({ ...baseQuery, experience: /[5-9]|10/ }),

      // Job Category
      Job.countDocuments({ ...baseQuery, isGovernment: true }),
      Job.countDocuments({ ...baseQuery, isGovernment: { $ne: true } }),

      // Locations
      Job.countDocuments({ ...baseQuery, $or: [{ location: /remote/i }, { type: 'Remote' }] }),
      Job.countDocuments({ ...baseQuery, location: /delhi|ncr|noida|gurgaon/i }),
      Job.countDocuments({ ...baseQuery, location: /bengaluru|bangalore/i }),
      Job.countDocuments({ ...baseQuery, location: /mumbai/i }),
      Job.countDocuments({ ...baseQuery, location: /pune/i }),
      Job.countDocuments({ ...baseQuery, location: /hyderabad/i }),

      // Education
      Job.countDocuments({ ...baseQuery, education: /graduate|degree/i }),
      Job.countDocuments({ ...baseQuery, education: /b\.?tech|b\.?e\.?|bachelor/i }),
      Job.countDocuments({ ...baseQuery, education: /diploma/i }),
      Job.countDocuments({ ...baseQuery, education: /12th|intermediate/i }),
      Job.countDocuments({ ...baseQuery, education: /10th|ssc|matric/i }),

      // Salary Ranges
      Job.countDocuments({ ...baseQuery, salary: /(?:^[0-3](?:\.\d+)?\s*(?:lpa|lakh|lac))|(?:\b(?:[1-9]\d{3}|1\d{4}|2[0-5]\d{3})\b)/i }),
      Job.countDocuments({ ...baseQuery, salary: /(?:^[3-6](?:\.\d+)?\s*(?:lpa|lakh|lac))|(?:\b(?:2[5-9]\d{3}|[3-4]\d{4}|50000)\b)/i }),
      Job.countDocuments({ ...baseQuery, salary: /(?:^(?:[6-9]|10)(?:\.\d+)?\s*(?:lpa|lakh|lac))|(?:\b(?:5\d{4}|[6-7]\d{4}|8[0-5]\d{3})\b)/i }),
      Job.countDocuments({ ...baseQuery, salary: /(?:^(?:1[0-5])(?:\.\d+)?\s*(?:lpa|lakh|lac))|(?:\b(?:8[5-9]\d{3}|9\d{4}|1[0-2]\d{4})\b)/i }),
      Job.countDocuments({ ...baseQuery, salary: /(?:^(?:1[5-9]|[2-9]\d)(?:\.\d+)?\s*(?:lpa|lakh|lac))|(?:\b(?:1[3-9]\d{4}|[2-9]\d{5})\b)/i })
    ]);

    res.json({
      success: true,
      data: {
        type: {
          Remote: remoteTypeCount,
          Hybrid: hybridTypeCount,
          'Full-Time': fullTimeCount,
          'Part-Time': partTimeCount,
          Internship: internshipCount
        },
        experience: {
          Fresher: fresherCount,
          '1-3 Years': exp1to3Count,
          '3-5 Years': exp3to5Count,
          '5+ Years': exp5plusCount
        },
        category: {
          Government: govCount,
          Private: privateCount
        },
        location: {
          Remote: remoteLocCount,
          Delhi: delhiCount,
          Bengaluru: blrCount,
          Mumbai: mumbaiCount,
          Pune: puneCount,
          Hyderabad: hydCount
        },
        education: {
          Graduate: graduateCount,
          Btech: btechCount,
          Diploma: diplomaCount,
          '12th': twelfthCount,
          '10th': tenthCount
        },
        salary: {
          '0-3': salary0to3Count,
          '3-6': salary3to6Count,
          '6-10': salary6to10Count,
          '10-15': salary10to15Count,
          '15+': salary15plusCount
        }
      }
    });
  } catch (e) {
    console.error('Error getting job stats:', e);
    res.status(500).json({
      success: false,
      message: 'Failed to get job statistics',
      error: process.env.NODE_ENV === 'development' ? e.message : undefined
    });
  }
};
