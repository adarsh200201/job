const Job = require('../models/Job');
const slugify = require('slugify');
const { getProfileAndActivityData, calculateJobMatchScore, bustSimilarJobsCache } = require('./recommendationController');
const GovernmentJobPreferences = require('../models/GovernmentJobPreferences');

// Helper function to build filters for job search
function buildFilters(query) {
  const filters = {}; // Default empty filters
  
  // Only show active jobs by default, unless status=all is passed
  if (query.status !== 'all') {
    filters.isActive = true;
  }  
  // Text search across multiple fields
  if (query.q) {
    const qClean = query.q.trim().toLowerCase();
    // Use word boundary boundaries for short queries (2 letters or less) to avoid false-positive substring matching (e.g. up matching group)
    const pattern = qClean.length <= 2 ? `\\b${qClean}` : query.q;
    const regex = new RegExp(pattern, 'i');
    
    // Avoid matching template/description texts for government boards like SSC/UPSC
    const isGovtBoardSearch = qClean.includes('ssc') || qClean.includes('upsc');
    
    if (isGovtBoardSearch) {
      filters.$or = [
        { title: regex },
        { company: regex }
      ];
    } else {
      filters.$or = [
        { title: regex },
        { company: regex },
        { location: regex },
        { jobDescription: regex },
        { education: regex },
        { 'skills': { $in: [regex] } }
      ];
    }
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
    // 'Government Job' is the display label – match all equivalent DB values
    if (query.postType === 'Government Job') {
      filters.postType = { $in: ['Job', 'Job Post', 'Government Job'] };
    } else {
      filters.postType = query.postType;
    }
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

// ─── In-memory response cache (anonymous requests only) ───────────────────────
// Avoids hitting MongoDB on every page load for the same query.
// TTL: 5 minutes. Max 200 entries (auto-evicts oldest on overflow).
const jobsCache = new Map();
const singleJobCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const CACHE_MAX_SIZE = 200;

function getCacheKey(query) {
  // Build a stable key from the fields that affect the result
  const { q, type, location, experience, education, salary, featured, isGovernment,
          postType, excludePostType, sort, fields, page, limit, sessionId, status } = query;
  return JSON.stringify({ q, type, location, experience, education, salary, featured,
                          isGovernment, postType, excludePostType, sort, fields, page,
                          limit, status });
  // NOTE: sessionId deliberately excluded so anonymous users share cache
}

function getFromCache(key) {
  const entry = jobsCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL_MS) {
    jobsCache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key, data) {
  // Evict oldest entry if we hit the size limit
  if (jobsCache.size >= CACHE_MAX_SIZE) {
    jobsCache.delete(jobsCache.keys().next().value);
  }
  jobsCache.set(key, { ts: Date.now(), data });
}

function getFromSingleCache(key) {
  const entry = singleJobCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL_MS) {
    singleJobCache.delete(key);
    return null;
  }
  return entry.data;
}

function setSingleCache(key, data) {
  if (singleJobCache.size >= CACHE_MAX_SIZE) {
    singleJobCache.delete(singleJobCache.keys().next().value);
  }
  singleJobCache.set(key, { ts: Date.now(), data });
}

/** Call this whenever a job is created/updated/deleted to bust stale cache */
exports.bustJobsCache = function() {
  jobsCache.clear();
  singleJobCache.clear();
  if (typeof bustSimilarJobsCache === 'function') {
    bustSimilarJobsCache();
  }
};


// Get all jobs with filters
// GET /api/jobs?q=search&location=city&type=Full-Time&experience=Fresher&education=B.Tech
// GET /api/jobs?featured=true
// GET /api/jobs?limit=10&page=1
// GET /api/jobs?sort=-createdAt
// GET /api/jobs?fields=title,company,location,salary
exports.getJobs = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const sessionId = req.query.sessionId || '';

    // ─── Fast path: anonymous guest with no personalization ──────────────
    // Skip ALL profile/activity DB lookups for unauthenticated visitors.
    // This removes 1-2 MongoDB round-trips from the critical path for ~90%
    // of traffic and cuts server response time by 500ms–1.5s.
    const isAnonymous = !userId || req.user?.role === 'admin' || req.query.status === 'all';

    if (isAnonymous) {
      const cacheKey = getCacheKey(req.query);
      const cached = getFromCache(cacheKey);
      if (cached) {
        // Serve from memory cache — zero DB queries
        res.set('X-Cache', 'HIT');
        res.set('Cache-Control', 'public, max-age=120, stale-while-revalidate=300');
        return res.json(cached);
      }

      // Cache MISS — run the query, then store result
      const filters = buildFilters(req.query);
      const page  = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 20;
      const skip  = (page - 1) * limit;

      const [total, jobs] = await Promise.all([
        Job.countDocuments(filters),
        (() => {
          let q = Job.find(filters);
          q = q.sort(req.query.sort ? req.query.sort.split(',').join(' ') : '-createdAt');
          q = req.query.fields
            ? q.select(req.query.fields.split(',').join(' '))
            : q.select('-__v -updatedAt -jobDescription'); // strip heavy field for list view
          return q.skip(skip).limit(limit).lean();
        })(),
      ]);

      const payload = {
        success: true,
        count: jobs.length,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        data: jobs,
      };

      setCache(cacheKey, payload);
      res.set('X-Cache', 'MISS');
      res.set('Cache-Control', 'public, max-age=120, stale-while-revalidate=300');
      return res.json(payload);
    }

    // ─── Authenticated path: personalization lookup ───────────────────────
    const filters = buildFilters(req.query);
    const page  = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip  = (page - 1) * limit;

    let hasPrefs = false;
    let profile  = null;
    let activity = null;
    let govPrefs = null;

    const data = await getProfileAndActivityData(userId, sessionId);
    profile  = data.profile;
    activity = data.activity;

    hasPrefs = !!(
      (profile.roles      && profile.roles.length > 0)      ||
      (profile.locations  && profile.locations.length > 0)  ||
      (profile.skills     && profile.skills.length > 0)     ||
      (activity.viewedJobIds  && activity.viewedJobIds.length > 0)  ||
      (activity.savedJobIds   && activity.savedJobIds.length > 0)   ||
      (activity.appliedJobIds && activity.appliedJobIds.length > 0)
    );

    if (hasPrefs) {
      govPrefs = await GovernmentJobPreferences.findOne({ userId });
    }

    let jobs;
    let total;

    if (hasPrefs) {
      total = await Job.countDocuments(filters);
      const candidateLimit = Math.max(300, skip + limit + 100);
      const candidates = await Job.find(filters)
        .sort('-createdAt')
        .limit(candidateLimit)
        .select('-__v -updatedAt')
        .lean();

      const scoredJobs = candidates
        .map(job => ({ ...job, matchScore: calculateJobMatchScore(job, profile, activity, govPrefs) }))
        .sort((a, b) => {
          const d = b.matchScore - a.matchScore;
          return d !== 0 ? d : new Date(b.createdAt) - new Date(a.createdAt);
        });

      jobs = scoredJobs.slice(skip, skip + limit);
    } else {
      total = await Job.countDocuments(filters);
      let q = Job.find(filters);
      q = q.sort(req.query.sort ? req.query.sort.split(',').join(' ') : '-createdAt');
      q = req.query.fields ? q.select(req.query.fields.split(',').join(' ')) : q.select('-__v -updatedAt');
      jobs = await q.skip(skip).limit(limit).lean();
    }

    res.set('Cache-Control', 'private, no-store');
    return res.json({
      success: true,
      count: jobs.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: jobs,
    });

  } catch (e) {
    console.error('Error fetching jobs:', e);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
      error: process.env.NODE_ENV === 'development' ? e.message : undefined,
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
    
    // Check single job cache first
    const cachedJob = getFromSingleCache(idOrSlug);
    if (cachedJob) {
      // Increment views asynchronously in the background
      Job.updateOne({ _id: cachedJob._id }, { $inc: { views: 1 } }).catch(err => {
        console.error('Error incrementing views in background (cached):', err);
      });
      return res.json({
        success: true,
        data: cachedJob
      });
    }

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
    
    // Convert to plain object to store in cache
    const jobObj = job.toObject();
    
    // Cache it by slug/id
    setSingleCache(idOrSlug, jobObj);
    if (!isObjectId && job._id) {
      setSingleCache(job._id.toString(), jobObj);
    } else if (isObjectId && job.slug) {
      setSingleCache(job.slug, jobObj);
    }
    
    // Increment view count in the background (asynchronously) to keep response instant
    Job.updateOne({ _id: job._id }, { $inc: { views: 1 } }).catch(err => {
      console.error('Error incrementing views in background:', err);
    });
    
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

// Helper to generate a unique permanent slug
async function generateUniqueSlug(title, excludeJobId = null) {
  let slugBase = slugify(title, { lower: true, strict: true, trim: true });
  if (!slugBase) {
    slugBase = 'job';
  }
  
  let slug = slugBase;
  let counter = 1;
  while (true) {
    const query = { slug };
    if (excludeJobId) {
      query._id = { $ne: excludeJobId };
    }
    const collision = await Job.findOne(query);
    if (!collision) {
      break;
    }
    slug = `${slugBase}-${counter}`;
    counter++;
  }
  return slug;
}

const isGarbageTitle = (title) => {
  if (!title) return true;
  const t = title.trim().toLowerCase();
  
  // Exclude extremely short titles
  if (t.length < 8) return true;
  
  // Test/scrape keyword check
  if (/test|scrape|mock/i.test(t)) return true;
  
  // URL or domain check (Broken scraper titles)
  if (/http|https|www\.|foundthejob|govtjobsalert/i.test(t)) return true;

  // Junk word list check
  const cleanTitle = t.replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
  const words = cleanTitle.split(' ');
  const junkWords = new Set(['and', 'or', 'the', 'in', 'to', 'for', 'a', 'an', 'at', 'by', 'of', 'on', 'with', 'if', 'now', 'apply']);
  const allJunk = words.every(w => junkWords.has(w) || /^\d+$/.test(w));
  if (allJunk) return true;

  // Title starting or ending with trailing conjunctions/junk words
  if (/^(?:and|or)\b/i.test(t)) return true;
  if (/\b(?:and|or)$/i.test(t)) return true;

  return false;
};

const normalizeTitle = (title) => {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const normalizeCompany = (company) => {
  if (!company) return '';
  return company
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const sanitizeTextForCompetitors = (text) => {
  if (!text || typeof text !== 'string') return text;
  
  const competitorPattern = /https?:\/\/(?:\.in|\.com|\.org|\.net|\.co|\.info|\.us|\.xyz|[^\s]*\.(?:pdlink\.in|bit\.ly|tinyurl\.com|ow\.ly|goo\.gl|short\.ly|rebrand\.ly|cutt\.ly|t\.co|buff\.ly|dlvr\.it|internshala\.com|internshals\.com|naukri\.com|shine\.com|monster\.com|timesjobs\.com|freshersworld\.com|placementindia\.com|govtjobsalert\.in|sarkariresult\.com|rojgarresult\.com|freejobalert\.com|freshershunt\.in|fresherslive\.com|freshersvoice\.com|offcampusjobs4u\.in|youth4work\.com|ambitionbox\.com|glassdoor\.com|glassdoor\.co\.in|indeed\.com|indeed\.co\.in|foundthejob\.com))[^\s<"'>]*/gi;

  let val = text;
  
  // 1. Remove competitor/shortlink URLs
  val = val.replace(competitorPattern, '');
  
  // 2. Remove leftover empty anchor tags
  val = val.replace(/<a\b[^>]*>\s*<\/a>/gi, '');
  
  // 3. Clean up dangling labels inside HTML tags
  const danglingPatterns = [
    /<(strong|b|p|li|span)\b[^>]*>\s*(?:visit\s+the\s+full\s+details\s+and\s+application\s+page|apply\s*(?:now|online|link)?|registration\s*(?:link)?|click\s*here\s*to\s*apply|official\s*link|apply\s*here|link|join\s*here|job\s*link|careers?\s*link)\s*[:\-\–\—\s]*\s*<\/\1>/gi
  ];
  for (const pattern of danglingPatterns) {
    val = val.replace(pattern, '');
  }
  
  // 4. Clean up empty tags (repeat to handle nesting)
  for (let i = 0; i < 3; i++) {
    val = val.replace(/<(p|li|strong|b|span|div)\b[^>]*>\s*<\/\1>/gi, '');
  }
  
  // 5. Clean dangling prefixes in plain text followed by a dot, number, or end of string
  val = val.replace(/\b(?:visit\s+the\s+full\s+details\s+and\s+application\s+page|apply\s*(?:now|online|link)?|registration\s*(?:link)?|click\s*here\s*to\s*apply|official\s*link|apply\s*here|link|join\s*here|job\s*link|careers?\s*link)\s*[:\-\–\—\s]*\s*(?=\d|\.|$)/gi, '');
  
  // 6. Remove excess spacing
  val = val.replace(/\s{2,}/g, ' ');
  
  return val.trim();
};

const normalizeUrl = (url) => {
  if (!url) return '';
  let clean = url.trim().toLowerCase();
  clean = clean.replace(/^https?:\/\//i, '');
  clean = clean.replace(/^www\./i, '');
  if (clean.endsWith('/')) {
    clean = clean.slice(0, -1);
  }
  return clean;
};

const cleanCompany = (company) => {
  if (!company) return '';
  let clean = company.trim();
  clean = clean.replace(/^company\s*(?:name)?\s*[:\-–—]\s*/i, '');
  clean = clean.replace(/^company\s*(?:name)?\s+/i, '');
  clean = clean.replace(/\s*(?:mass\s*)?hiring\s*drive\s*/i, '');
  clean = clean.replace(/\s*(?:mass\s*)?hiring\s*/i, '');
  clean = clean.replace(/\s*recruitment\s*drive\s*/i, '');
  clean = clean.replace(/\s*recruitment\s*/i, '');
  clean = clean.replace(/\s*careers\s*/i, '');
  clean = clean.replace(/\s*jobs\s*/i, '');
  return clean.trim();
};

const cleanScrapedTitle = (title) => {
  if (!title) return '';
  let clean = title.trim();
  clean = clean.replace(/^company\s*(?:name)?\s*[:\-–—]\s*/i, '');
  clean = clean.replace(/^company\s*(?:name)?\s+/i, '');
  return clean;
};

const extractRoleFromDescription = (description) => {
  if (!description) return '';
  const text = description.replace(/<[^>]*>/g, '\n');
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  
  const patterns = [
    /^(?:job\s*)?role\s*s?\s*[:\-–—\s]+\s*(.+)$/i,
    /^(?:job\s*)?profile\s*s?\s*[:\-–—\s]+\s*(.+)$/i,
    /^(?:job\s*)?designation\s*s?\s*[:\-–—\s]+\s*(.+)$/i,
    /^(?:job\s*)?position\s*s?\s*[:\-–—\s]+\s*(.+)$/i,
    /^(?:job\s*)?title\s*s?\s*[:\-–—\s]+\s*(.+)$/i,
    /^(?:post\s*)?name\s*s?\s*[:\-–—\s]+\s*(.+)$/i
  ];

  for (const line of lines) {
    for (const regex of patterns) {
      const match = line.match(regex);
      if (match) {
        let role = match[1].trim();
        role = role.replace(/<[^>]*>/g, '').replace(/https?:\/\/\S+/gi, '').trim();
        role = role.replace(/^(?:a|an|the)\s+/i, '');
        if (role.length > 3 && role.length < 80 && !/http|www|apply/i.test(role)) {
          return role;
        }
      }
    }
  }
  return '';
};

const enrichThinDescription = (description, title, company, location, salary, experience, batch, role) => {
  if (!description) return '';
  const cleanText = description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = cleanText.split(' ').length;
  if (wordCount > 150) {
    return description;
  }
  
  const enrichedSection = `
<div class="enriched-job-content mt-4" style="border-top: 1px dashed #e2e8f0; padding-top: 1.5rem;">
  <h3 style="font-size: 1.25rem; font-weight: 700; color: #1e293b; margin-bottom: 0.75rem;">About the ${company} Recruitment Drive</h3>
  <p style="color: #475569; line-height: 1.6; margin-bottom: 1rem;">Apply for the latest ${role || title} position at ${company}. This role offers a fantastic opportunity to build a career in ${location || 'India'} at a leading organization. Qualified candidates matching the criteria below are encouraged to apply online immediately.</p>
  
  <h3 style="font-size: 1.25rem; font-weight: 700; color: #1e293b; margin-bottom: 0.75rem; margin-top: 1.5rem;">Role Overview & Eligibility Criteria</h3>
  <ul style="color: #475569; line-height: 1.6; margin-bottom: 1rem; padding-left: 1.25rem;">
    <li><strong>Hiring Company:</strong> ${company}</li>
    <li><strong>Job Profile:</strong> ${role || title}</li>
    <li><strong>Location:</strong> ${location || 'Pan India / Remote'}</li>
    <li><strong>Salary Package:</strong> ${salary || 'Best in Industry'}</li>
    <li><strong>Experience Required:</strong> ${experience || 'Freshers & Experienced Candidates'}</li>
    <li><strong>Eligible Batches:</strong> ${batch || '2026, 2025, 2024, 2023 graduates'}</li>
  </ul>

  <h3 style="font-size: 1.25rem; font-weight: 700; color: #1e293b; margin-bottom: 0.75rem; margin-top: 1.5rem;">Selection Process & How to Apply</h3>
  <p style="color: #475569; line-height: 1.6; margin-bottom: 1rem;">The selection process at ${company} generally consists of an initial online assessment, technical screening rounds, and a final HR evaluation. To submit your application, click the official apply link on this page, register with your updated details, and upload your resume.</p>
  
  <h3 style="font-size: 1.25rem; font-weight: 700; color: #1e293b; margin-bottom: 0.75rem; margin-top: 1.5rem;">Frequently Asked Questions (FAQ)</h3>
  <div style="margin-bottom: 1rem;">
    <strong style="color: #1e293b; display: block; margin-bottom: 0.25rem;">Q1: What is the last date to apply?</strong>
    <p style="color: #475569; line-height: 1.6; margin: 0;">A: The application window is open for a limited period. Candidates should submit their applications as early as possible before the link is closed by the company.</p>
  </div>
  <div>
    <strong style="color: #1e293b; display: block; margin-bottom: 0.25rem;">Q2: Does this job allow remote work?</strong>
    <p style="color: #475569; line-height: 1.6; margin: 0;">A: Please verify the job type specification on this page. Remote roles allow working from home, whereas hybrid/on-site roles require office attendance.</p>
  </div>
</div>
  `;
  return description + enrichedSection;
};

const enrichJobTitleAndCompany = (rawTitle, rawCompany, jobDescription, isGov) => {
  const companyCleaned = cleanCompany(rawCompany);
  const titleCleaned = cleanScrapedTitle(rawTitle || '');

  if (!titleCleaned) {
    return {
      title: isGov ? `${companyCleaned} Recruitment 2026` : `${companyCleaned} Hiring Drive 2026`,
      company: companyCleaned,
      role: ''
    };
  }

  const titleCleanedLower = titleCleaned.toLowerCase();
  const companyCleanedLower = companyCleaned.toLowerCase();
  const titleWithoutCompanyAndJunk = titleCleanedLower
    .replace(companyCleanedLower, '')
    .replace(/\b(?:mass\s*)?hiring\b/g, '')
    .replace(/\b(?:recruitment|drive|jobs|careers|job|posts|post|vacancies|vacancy)\b/g, '')
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  const isGeneric = titleWithoutCompanyAndJunk.length === 0 || titleWithoutCompanyAndJunk.split(/\s+/).length <= 1;
  const titleWords = titleCleaned.trim().split(/\s+/).filter(Boolean);
  const isTitleThin = isGeneric || titleWords.length <= 2 || titleCleanedLower === companyCleanedLower;
  
  let roleFromDesc = '';
  if (isTitleThin) {
    roleFromDesc = extractRoleFromDescription(jobDescription || '');
  }

  let finalTitle = titleCleaned;
  if (roleFromDesc) {
    finalTitle = `${companyCleaned} ${roleFromDesc} Hiring 2026`;
  } else {
    const finalWords = finalTitle.trim().split(/\s+/).filter(Boolean);
    const hasContextWord = /hiring|recruitment|program|career|job|drive|internship|apprentice|scholarship|admit|result/i.test(finalTitle);
    
    if (finalWords.length <= 3 || finalTitle.length < 25 || !hasContextWord) {
      if (isGov) {
        if (companyCleaned && !finalTitle.toLowerCase().includes(companyCleaned.toLowerCase())) {
          finalTitle = `${companyCleaned} ${finalTitle} Recruitment 2026`;
        } else if (!finalTitle.toLowerCase().includes('recruitment')) {
          finalTitle = `${finalTitle} Recruitment 2026`;
        }
      } else {
        if (companyCleaned && !finalTitle.toLowerCase().includes(companyCleaned.toLowerCase())) {
          if (/apprentice/i.test(finalTitle)) {
            finalTitle = `${companyCleaned} ${finalTitle} Program 2026`;
          } else {
            finalTitle = `${companyCleaned} ${finalTitle} Hiring 2026`;
          }
        } else {
          if (/apprentice/i.test(finalTitle)) {
            finalTitle = `${finalTitle} Program 2026`;
          } else if (!hasContextWord) {
            finalTitle = `${finalTitle} Hiring 2026`;
          }
        }
      }
    }
  }

  finalTitle = finalTitle.replace(/\s+/g, ' ').trim();
  
  if (companyCleaned && companyCleaned.length > 2) {
    const doubleCompanyRegex = new RegExp(`^(${companyCleaned})\\s+\\1\\b`, 'i');
    finalTitle = finalTitle.replace(doubleCompanyRegex, '$1');
  }

  return {
    title: finalTitle,
    company: companyCleaned,
    role: roleFromDesc
  };
};

const isDuplicateTitleAndCompany = (t1, c1, t2, c2) => {
  const nt1 = normalizeTitle(t1);
  const nt2 = normalizeTitle(t2);
  const nc1 = normalizeCompany(c1);
  const nc2 = normalizeCompany(c2);
  
  if (nt1 === nt2) {
    if (nc1 === nc2 || nc1.includes(nc2) || nc2.includes(nc1)) {
      return true;
    }
    const words1 = nc1.split(' ');
    const words2 = nc2.split(' ');
    const commonWords = words1.filter(w => words2.includes(w) && w.length > 2);
    if (commonWords.length > 0) return true;
  }
  
  if (nt1.length >= 15 && nt2.length >= 15) {
    if (nt1.includes(nt2) || nt2.includes(nt1)) {
      if (nc1 === nc2 || nc1.includes(nc2) || nc2.includes(nc1)) {
        return true;
      }
    }
  }

  const wordsT1 = nt1.split(' ').filter(w => w.length > 1);
  const wordsT2 = nt2.split(' ').filter(w => w.length > 1);
  if (wordsT1.length >= 4 && wordsT2.length >= 4) {
    const first4_1 = wordsT1.slice(0, 4).join(' ');
    const first4_2 = wordsT2.slice(0, 4).join(' ');
    if (first4_1 === first4_2) {
      if (nc1 === nc2 || nc1.includes(nc2) || nc2.includes(nc1)) {
        return true;
      }
    }
  }
  
  return false;
};


// Create a new job
// POST /api/jobs
exports.createJob = async (req, res) => {
  try {
    // Sanitize incoming text fields for competitor URLs
    const textFields = ['jobDescription', 'howToApply', 'finalThoughts', 'whyJoin', 'aboutCompany', 'description', 'shortSummary'];
    textFields.forEach(field => {
      if (req.body[field]) {
        req.body[field] = sanitizeTextForCompetitors(req.body[field]);
      }
    });

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

    // ─── Clean and Enrich Title ───
    const { title: cleanTitle, company: companyCleaned, role: roleFromDesc } = enrichJobTitleAndCompany(title, company, jobDescription, isGov);

    // Reject garbage/test postings
    if (isGarbageTitle(cleanTitle)) {
      return res.status(400).json({
        success: false,
        message: 'Job rejected: title identified as scraper garbage, test post, or containing URL link.'
      });
    }

    // Enrich thin job description
    const finalDescription = enrichThinDescription(
      jobDescription,
      cleanTitle,
      companyCleaned,
      location,
      salary,
      experience,
      batch,
      roleFromDesc
    );

    // ─── Duplicate Check & Update ───
    let existingJob = null;
    if (sourceUrl) {
      const normSourceUrl = normalizeUrl(sourceUrl);
      const dateLimit = new Date();
      dateLimit.setDate(dateLimit.getDate() - 15);
      const candidates = await Job.find({ createdAt: { $gte: dateLimit } });
      existingJob = candidates.find(c => c.sourceUrl && normalizeUrl(c.sourceUrl) === normSourceUrl);
    }

    if (!existingJob && cleanTitle && companyCleaned) {
      const dateLimit = new Date();
      dateLimit.setDate(dateLimit.getDate() - 15);
      const candidates = await Job.find({ createdAt: { $gte: dateLimit } });
      existingJob = candidates.find(c => 
        isDuplicateTitleAndCompany(c.title, c.company, cleanTitle, companyCleaned)
      );
    }

    if (existingJob) {
      // Update existing job fields instead of creating a duplicate document
      const updateData = {
        title: cleanTitle,
        company: companyCleaned,
        location: isGov ? '' : location,
        type: isGov ? 'Full-Time' : type,
        experience: isGov ? '' : experience,
        jobDescription: finalDescription,
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
        image: image || existingJob.image,
        whatsapp,
        telegram,
        contact,
        aboutCompany: aboutCompany || '',
        whyJoin: whyJoin || '',
        description: description || '',
        howToApply: howToApply || '',
        finalThoughts: finalThoughts || '',
        highlightText: highlightText || '',
        metaTitle: metaTitle || `${cleanTitle} - ${companyCleaned} - Job Openings`,
        metaDescription: metaDescription || (isGov 
          ? `${cleanTitle} at ${companyCleaned}. Eligibility: ${eligibility || ''}. Vacancies: ${vacancies || ''}.`
          : `${cleanTitle} at ${companyCleaned} in ${location}. ${finalDescription.replace(/<[^>]*>/g, '').substring(0, 150)}...`),
        isFeatured: isFeatured !== undefined ? isFeatured : existingJob.isFeatured,
        isActive: isActive !== undefined ? isActive : existingJob.isActive,
        postType: postType || existingJob.postType,
        sourceWebsite: sourceWebsite || existingJob.sourceWebsite,
        importantDates: importantDates || '',
        pdfLink: pdfLink || '',
        isGovernment: isGov
      };

      Object.assign(existingJob, updateData);
      await existingJob.save();

      exports.bustJobsCache(); // Invalidate list cache so updates reflect immediately
      return res.status(200).json({
        success: true,
        message: 'Job updated successfully (duplicate matched)',
        slug: existingJob.slug,
        data: existingJob
      });
    }
    
    // Create clean permanent slug from title (with collision checks)
    const slug = await generateUniqueSlug(cleanTitle);
    
    // Create job
    const job = await Job.create({
      title: cleanTitle,
      slug,
      company: companyCleaned,
      location: isGov ? '' : location,
      type: isGov ? 'Full-Time' : type, // Keep a valid default for database enum if needed
      experience: isGov ? '' : experience,
      jobDescription: finalDescription,
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
      metaTitle: metaTitle || `${cleanTitle} - ${companyCleaned} - Job Openings`,
      metaDescription: metaDescription || (isGov 
        ? `${cleanTitle} at ${companyCleaned}. Eligibility: ${eligibility || ''}. Vacancies: ${vacancies || ''}.`
        : `${cleanTitle} at ${companyCleaned} in ${location}. ${finalDescription.replace(/<[^>]*>/g, '').substring(0, 150)}...`),
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
    
    exports.bustJobsCache(); // Invalidate list cache so new job appears immediately
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
    
    // Sanitize updates text fields for competitor URLs
    const textFields = ['jobDescription', 'howToApply', 'finalThoughts', 'whyJoin', 'aboutCompany', 'description', 'shortSummary'];
    textFields.forEach(field => {
      if (updates[field]) {
        updates[field] = sanitizeTextForCompetitors(updates[field]);
      }
    });
    
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ 
        success: false, 
        message: 'Job not found' 
      });
    }

    // If title is being updated, clean/enrich and update the slug/description
    if (updates.title) {
      const isGov = (updates.isGovernment !== undefined) 
        ? (updates.isGovernment === true || updates.isGovernment === 'true') 
        : job.isGovernment;
      
      const rawCompany = updates.company || job.company;
      const rawDesc = updates.jobDescription || job.jobDescription;

      const { title: cleanTitle, company: companyCleaned, role: roleFromDesc } = enrichJobTitleAndCompany(updates.title, rawCompany, rawDesc, isGov);
      
      updates.title = cleanTitle;
      updates.company = companyCleaned;
      updates.slug = await generateUniqueSlug(cleanTitle, id);
      
      // Enrich description if thin
      updates.jobDescription = enrichThinDescription(
        rawDesc,
        cleanTitle,
        companyCleaned,
        updates.location || job.location,
        updates.salary || job.salary,
        updates.experience || job.experience,
        updates.batch || job.batch,
        roleFromDesc
      );

      const finalCompany = companyCleaned || job.company;
      let hasMissing = !updates.title || !finalCompany || !(updates.jobDescription || job.jobDescription) || !(updates.applyLink || job.applyLink);
      if (!isGov) {
        if (!(updates.location || job.location) || !(updates.type || job.type) || !(updates.experience || job.experience) || !(updates.education || job.education)) {
          hasMissing = true;
        }
      } else {
        if (!(updates.eligibility || job.eligibility) || !(updates.vacancies || job.vacancies)) {
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
    
    Object.assign(job, updates);
    await job.save();
    
    exports.bustJobsCache(); // Invalidate list cache so updates reflect immediately
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

    exports.bustJobsCache(); // Invalidate list cache so deletion reflects immediately
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
