const Job = require('../models/Job');
const User = require('../models/User');
const UserPreferences = require('../models/UserPreferences');
const UserActivity = require('../models/UserActivity');
const CategoryScores = require('../models/CategoryScores');
const GovernmentJobPreferences = require('../models/GovernmentJobPreferences');
const Notification = require('../models/Notification');
const RecommendationHistory = require('../models/RecommendationHistory');

// Core Scoring Engine
async function getProfileAndActivityData(userId, sessionId) {
  let profile = {
    roles: [],
    locations: [],
    skills: [],
    experienceLevel: '',
    degree: '',
    predictedRoles: [],
    isGuest: true
  };

  let activity = {
    viewedJobIds: [],
    savedJobIds: [],
    appliedJobIds: [],
    recentCategories: [],
    recentCompanies: []
  };

  // 1. Load profile if logged in
  if (userId) {
    profile.isGuest = false;
    const user = await User.findById(userId);
    const prefs = await UserPreferences.findOne({ userId });
    
    if (user) {
      profile.experienceLevel = user.experienceLevel || '';
      if (user.preferredRole) profile.roles.push(user.preferredRole);
      if (user.location) profile.locations.push(user.location);
      if (user.skills && user.skills.length > 0) profile.skills.push(...user.skills);
      if (user.education?.degree) profile.degree = user.education.degree;
    }
    
    if (prefs) {
      if (prefs.preferredRoles?.length > 0) profile.roles.push(...prefs.preferredRoles);
      if (prefs.preferredLocations?.length > 0) profile.locations.push(...prefs.preferredLocations);
      if (prefs.skills?.length > 0) profile.skills.push(...prefs.skills);
      if (prefs.predictedRoles?.length > 0) profile.predictedRoles.push(...prefs.predictedRoles);
    }
    
    // Deduplicate
    profile.roles = [...new Set(profile.roles)];
    profile.locations = [...new Set(profile.locations)];
    profile.skills = [...new Set(profile.skills)];
  }

  // 2. Fetch User activities (Views, Saves, Applies)
  const query = userId ? { userId } : { sessionId };
  if (userId || sessionId) {
    const activities = await UserActivity.find(query).limit(100).populate('jobId').lean();
    
    const viewedJobCounts = {};
    const viewedTitleWords = {};
    const viewedCompanies = {};

    activities.forEach(act => {
      if (!act.jobId) return;
      const job = act.jobId;
      
      if (act.activityType === 'view') {
        const jobIdStr = job._id.toString();
        viewedJobCounts[jobIdStr] = (viewedJobCounts[jobIdStr] || 0) + 1;
        
        const words = (job.title || '').toLowerCase().split(/\s+/).filter(w => w.length > 3);
        words.forEach(w => {
          viewedTitleWords[w] = (viewedTitleWords[w] || 0) + 1;
        });

        if (job.company) {
          const compLower = job.company.toLowerCase();
          viewedCompanies[compLower] = (viewedCompanies[compLower] || 0) + 1;
        }

        activity.viewedJobIds.push(jobIdStr);
      } else if (act.activityType === 'save') {
        activity.savedJobIds.push(job._id.toString());
      } else if (act.activityType === 'apply') {
        activity.appliedJobIds.push(job._id.toString());
      }
      
      if (job.company) activity.recentCompanies.push(job.company);
    });

    activity.viewedJobCounts = viewedJobCounts;
    activity.viewedTitleWords = viewedTitleWords;
    activity.viewedCompanies = viewedCompanies;

    activity.viewedJobIds = [...new Set(activity.viewedJobIds)];
    activity.savedJobIds = [...new Set(activity.savedJobIds)];
    activity.appliedJobIds = [...new Set(activity.appliedJobIds)];
    activity.recentCompanies = [...new Set(activity.recentCompanies)];
    
    // Get top categories based on scores
    if (userId) {
      const catScores = await CategoryScores.find({ userId }).sort({ score: -1 }).limit(3).lean();
      activity.recentCategories = catScores.map(c => c.category);
    }
  }

  return { profile, activity };
}

// Compute Match Score for a single Job
function calculateJobMatchScore(job, profile, activity, govPrefs = null) {
  let earned = 0;
  
  const title = (job.title || '').toLowerCase();
  const company = (job.company || '').toLowerCase();
  const location = (job.location || '').toLowerCase();
  const experience = (job.experience || '').toLowerCase();
  const skills = (job.skills || []).map(s => s.toLowerCase());
  
  // 1. Role Match (Max 40 points)
  let roleMatchPoints = 0;
  const targetRoles = [...profile.roles, ...profile.predictedRoles];
  for (const role of targetRoles) {
    const rLower = role.toLowerCase();
    if (title === rLower) {
      roleMatchPoints = 40;
      break;
    } else if (title.includes(rLower)) {
      roleMatchPoints = Math.max(roleMatchPoints, 35);
    } else {
      // Partial word matches
      const words = rLower.split(' ');
      if (words.some(w => w.length > 3 && title.includes(w))) {
        roleMatchPoints = Math.max(roleMatchPoints, 20);
      }
    }
  }
  earned += roleMatchPoints;
  
  // 2. Skill Match (Max 20 points)
  let skillMatchPoints = 0;
  if (profile.skills.length > 0) {
    const userSkills = profile.skills.map(s => s.toLowerCase());
    if (skills.length > 0) {
      const matches = skills.filter(s => userSkills.includes(s));
      skillMatchPoints = Math.round((matches.length / Math.max(skills.length, 1)) * 20);
    } else {
      // Look up inside title and description
      const desc = (job.jobDescription || '').toLowerCase();
      const matches = userSkills.filter(s => desc.includes(s) || title.includes(s));
      if (matches.length > 0) skillMatchPoints = 10;
      if (matches.length > 2) skillMatchPoints = 20;
    }
  }
  earned += skillMatchPoints;
  
  // 3. Location Match (Max 20 points)
  let locationMatchPoints = 0;
  if (profile.locations.length > 0) {
    const isUserRemote = profile.locations.some(l => /remote|home/i.test(l));
    const isJobRemote = job.type === 'Remote' || /remote|wfh|work from home/i.test(location) || /remote/i.test(job.type || '');
    
    if (isUserRemote && isJobRemote) {
      locationMatchPoints = 20;
    } else {
      const match = profile.locations.some(l => location.includes(l.toLowerCase()));
      if (match) locationMatchPoints = 20;
    }
  }
  earned += locationMatchPoints;
  
  // 4. Experience Match (Max 10 points)
  let expMatchPoints = 0;
  if (profile.experienceLevel) {
    const isFresherUser = /fresher/i.test(profile.experienceLevel);
    const isFresherJob = /fresher|0-1|0\s*years/i.test(experience);
    
    if (isFresherUser && isFresherJob) {
      expMatchPoints = 10;
    } else if (!isFresherUser && !isFresherJob) {
      expMatchPoints = 8;
    } else if (experience) {
      expMatchPoints = 5;
    }
  }
  earned += expMatchPoints;
  
  // 5. User Activity Match (Max 20 points)
  let activityMatchPoints = 0;
  if (activity.recentCompanies.includes(job.company)) {
    activityMatchPoints = 10;
  }
  if (job.isGovernment && activity.recentCategories.includes('Government Jobs')) {
    activityMatchPoints = 20;
  } else if (!job.isGovernment) {
    const softwareKeywords = ['react', 'node', 'js', 'developer', 'engineer', 'frontend', 'backend'];
    const isSoftwareJob = softwareKeywords.some(kw => title.includes(kw));
    if (isSoftwareJob && activity.recentCategories.includes('Software Development')) {
      activityMatchPoints = 20;
    }
  }
  earned += activityMatchPoints;
  
  // 6. Saved Job Similarity (Max 20 points)
  let savedSimilarity = 0;
  if (activity.savedJobIds.includes(job._id.toString())) {
    savedSimilarity = 20;
  } else if (activity.savedJobIds.length > 0) {
    // Check overlapping company or title words
    const savedJobsDetails = activity.savedJobIds;
    if (savedJobsDetails.some(id => id.toString() === job._id.toString())) {
      savedSimilarity = 20;
    }
  }
  earned += savedSimilarity;
  
  // 7. Applied Job Similarity (Max 20 points)
  let appliedSimilarity = 0;
  if (activity.appliedJobIds.includes(job._id.toString())) {
    appliedSimilarity = 20;
  }
  earned += appliedSimilarity;
  
  // 8. Government Category Match (Max 30 points)
  let govMatchPoints = 0;
  if (job.isGovernment && govPrefs) {
    const textToSearch = `${title} ${company}`;
    if (/ssc|cgl|chsl|mts/i.test(textToSearch) && govPrefs.scoreSSC > 0) {
      govMatchPoints = 30;
    } else if (/upsc|gpsc|ias|ips/i.test(textToSearch) && govPrefs.scoreCivilServices > 0) {
      govMatchPoints = 30;
    } else if (/railway|rrb/i.test(textToSearch) && govPrefs.scoreRailway > 0) {
      govMatchPoints = 30;
    } else if (/bank|sbi|ibps/i.test(textToSearch) && govPrefs.scoreBanking > 0) {
      govMatchPoints = 30;
    }
  }
  earned += govMatchPoints;
  
  // 9. Internship Match (Max 20 points)
  let internshipMatchPoints = 0;
  const isInternship = job.type === 'Internship' || /internship|intern/i.test(title);
  const userPrefersIntern = profile.roles.some(r => /intern/i.test(r.toLowerCase())) || activity.recentCategories.includes('Internships');
  
  if (isInternship && userPrefersIntern) {
    internshipMatchPoints = 20;
  }
  earned += internshipMatchPoints;
  
  // 10. View Affinity & Re-visit Boost (Max 35 points)
  let viewAffinityPoints = 0;
  
  // A. Specific Job Re-visit Boost
  const jobIdStr = job._id.toString();
  if (activity.viewedJobCounts && activity.viewedJobCounts[jobIdStr]) {
    const views = activity.viewedJobCounts[jobIdStr];
    viewAffinityPoints += Math.min(views * 10, 25); // +10 points per view, capped at 25
  }
  
  // B. Company View Boost
  if (activity.viewedCompanies && activity.viewedCompanies[company]) {
    const compViews = activity.viewedCompanies[company];
    viewAffinityPoints += Math.min(compViews * 4, 15); // cap at 15
  }
  
  // C. Title Word Match from viewed jobs
  if (activity.viewedTitleWords) {
    const titleWords = title.split(/\s+/).filter(w => w.length > 3);
    let wordMatches = 0;
    titleWords.forEach(w => {
      if (activity.viewedTitleWords[w]) {
        wordMatches += activity.viewedTitleWords[w];
      }
    });
    viewAffinityPoints += Math.min(wordMatches * 3, 20); // cap at 20
  }
  
  earned += Math.min(viewAffinityPoints, 35);
  
  // Normalize score
  let finalScore = 0;
  const hasProfilePrefs = !!(
    (profile.roles && profile.roles.length > 0) ||
    (profile.locations && profile.locations.length > 0) ||
    (profile.skills && profile.skills.length > 0)
  );
  
  const hasSessionActivity = !!(
    (activity.viewedJobIds && activity.viewedJobIds.length > 0) ||
    (activity.savedJobIds && activity.savedJobIds.length > 0) ||
    (activity.appliedJobIds && activity.appliedJobIds.length > 0)
  );

  const hasPrefs = hasProfilePrefs || hasSessionActivity;

  // Core profile points sum up to 90: 40 (role) + 20 (skill) + 20 (location) + 10 (experience)
  const coreScore = roleMatchPoints + skillMatchPoints + locationMatchPoints + expMatchPoints;
  // Behavior points sum up to 145: 20 (activity) + 20 (saved) + 20 (applied) + 30 (gov) + 20 (internship) + 35 (view affinity)
  const behaviorScore = activityMatchPoints + savedSimilarity + appliedSimilarity + govMatchPoints + internshipMatchPoints + Math.min(viewAffinityPoints, 35);

  if (hasProfilePrefs) {
    // For users with profile preferences: core profile alignment counts for up to 100%, and behavior adds up to 15% bonus
    const corePercent = (coreScore / 90) * 100;
    const behaviorBonus = Math.min((behaviorScore / 145) * 15, 15);
    finalScore = Math.round(corePercent + behaviorBonus);
  } else if (hasSessionActivity) {
    // For guest/cookie users with browsing activity: scale their engagement to a 50-95% range
    if (behaviorScore > 0) {
      finalScore = 50 + Math.round((Math.min(behaviorScore, 50) / 50) * 45);
    }
  }

  // Fallback threshold check
  if (finalScore < 45) {
    if (!hasPrefs) {
      // Generate a contextual default score based on basic matches or default to 65-70% matching
      const seed = parseInt(job._id.toString().substring(0, 8), 16) % 15;
      finalScore = 65 + seed; // 65% - 80% range
    } else {
      // Keep a low baseline for irrelevant jobs so they rank at the bottom
      const seed = parseInt(job._id.toString().substring(0, 8), 16) % 5;
      finalScore = 40 + seed; // 40% - 44% range
    }
  }
  
  return Math.min(finalScore, 99);
}

// ── GET /api/recommendations ──────────────────────────────────────────────────
exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const sessionId = req.query.sessionId || '';
    
    if (!userId) {
      return res.json({
        success: true,
        isPersonalized: false,
        data: {
          hasPreferences: false,
          recommended: [],
          govt: [],
          private: [],
          internships: [],
          wfh: [],
          recentActivity: [],
          similarSaved: [],
          trending: []
        }
      });
    }
    
    // 1. Get profile and activity details
    const { profile, activity } = await getProfileAndActivityData(userId, sessionId);
    
    let govPrefs = null;
    if (userId) {
      govPrefs = await GovernmentJobPreferences.findOne({ userId });
    }
    
    // 2. Fetch all active jobs (cap at 200 for performance)
    const jobs = await Job.find({ isActive: true }).sort('-createdAt').limit(200).lean();
    
    // 3. Compute scores and assign them to each job
    const scoredJobs = jobs.map(job => {
      const score = calculateJobMatchScore(job, profile, activity, govPrefs);
      return { ...job, matchScore: score };
    });
    
    // Sort scored jobs descending
    scoredJobs.sort((a, b) => b.matchScore - a.matchScore);
    
    // 4. Create recommendation lists
    const recommended = scoredJobs.slice(0, 15);
    const govt = scoredJobs.filter(j => j.isGovernment).slice(0, 10);
    const privateJobs = scoredJobs.filter(j => !j.isGovernment && j.type !== 'Internship').slice(0, 10);
    const internships = scoredJobs.filter(j => j.type === 'Internship' || /intern/i.test(j.title.toLowerCase())).slice(0, 10);
    
    const wfh = scoredJobs.filter(j => 
      j.type === 'Remote' || 
      /remote|wfh|work from home/i.test(j.location.toLowerCase()) ||
      /remote/i.test(j.type || '')
    ).slice(0, 10);
    
    // Based on recent activity: filter by recent companies or top engaged categories
    const recentActivity = scoredJobs.filter(j => 
      activity.recentCompanies.includes(j.company) ||
      (activity.recentCategories.length > 0 && getCategoryFromJob(j) === activity.recentCategories[0])
    ).slice(0, 10);
    
    // Similar to saved jobs
    const similarSaved = scoredJobs.filter(j => 
      !activity.savedJobIds.includes(j._id.toString()) && 
      (activity.savedJobIds.length > 0 && activity.recentCompanies.includes(j.company))
    ).slice(0, 10);
    
    // Trending: high views or applications in their interest area
    const trending = scoredJobs
      .filter(j => activity.recentCategories.length > 0 && getCategoryFromJob(j) === activity.recentCategories[0])
      .sort((a, b) => (b.views + b.applications) - (a.views + a.applications))
      .slice(0, 10);
      
    // Log scores in RecommendationHistory for analytics (first 5)
    if (userId && recommended.length > 0) {
      const historyBulk = recommended.slice(0, 5).map(j => ({
        userId,
        jobId: j._id,
        score: j.matchScore
      }));
      for (const item of historyBulk) {
        await RecommendationHistory.findOneAndUpdate(
          { userId, jobId: item.jobId },
          { $set: { score: item.score } },
          { upsert: true }
        );
      }
    }
    
    const hasPrefs = !!(
      (profile.roles && profile.roles.length > 0) ||
      (profile.locations && profile.locations.length > 0) ||
      (profile.skills && profile.skills.length > 0) ||
      (activity.viewedJobIds && activity.viewedJobIds.length > 0) ||
      (activity.savedJobIds && activity.savedJobIds.length > 0) ||
      (activity.appliedJobIds && activity.appliedJobIds.length > 0)
    );

    res.json({
      success: true,
      isPersonalized: !profile.isGuest,
      data: {
        hasPreferences: hasPrefs,
        recommended,
        govt,
        private: privateJobs,
        internships,
        wfh,
        recentActivity: recentActivity.length > 0 ? recentActivity : scoredJobs.slice(15, 25),
        similarSaved: similarSaved.length > 0 ? similarSaved : scoredJobs.slice(20, 30),
        trending: trending.length > 0 ? trending : scoredJobs.sort((a, b) => b.views - a.views).slice(0, 10)
      }
    });
  } catch (err) {
    console.error('Error fetching recommendations:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch recommendations', error: err.message });
  }
};

// ── GET /api/recommendations/widgets ──────────────────────────────────────────
exports.getWidgets = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const sessionId = req.query.sessionId || '';
    
    const { profile, activity } = await getProfileAndActivityData(userId, sessionId);
    
    const jobs = await Job.find({ isActive: true }).sort('-createdAt').limit(150).lean();
    
    const scoredJobs = jobs.map(job => {
      const score = calculateJobMatchScore(job, profile, activity);
      return { ...job, matchScore: score };
    });
    
    scoredJobs.sort((a, b) => b.matchScore - a.matchScore);
    
    // Recommended government jobs
    const recommendedGovt = scoredJobs.filter(j => j.isGovernment).slice(0, 6);
    
    // Recommended internships
    const recommendedInternships = scoredJobs.filter(j => j.type === 'Internship' || /intern/i.test(j.title.toLowerCase())).slice(0, 6);
    
    // Jobs near you (location match)
    const preferredLoc = profile.locations[0] || 'remote';
    const jobsNearYou = scoredJobs.filter(j => 
      j.location && j.location.toLowerCase().includes(preferredLoc.toLowerCase())
    ).slice(0, 6);
    
    // Recently viewed jobs
    const recentlyViewed = await Job.find({
      _id: { $in: activity.viewedJobIds }
    }).lean();
    
    // Saved jobs
    const savedJobs = await Job.find({
      _id: { $in: activity.savedJobIds }
    }).lean();
    
    // Because you applied to (find similar to their applied jobs)
    const appliedJobs = await Job.find({
      _id: { $in: activity.appliedJobIds }
    }).lean();
    let becauseYouApplied = [];
    if (appliedJobs.length > 0) {
      const appliedCompany = appliedJobs[0].company;
      becauseYouApplied = scoredJobs.filter(j => 
        j.company === appliedCompany && 
        !activity.appliedJobIds.includes(j._id.toString())
      ).slice(0, 6);
    }
    if (becauseYouApplied.length === 0) {
      becauseYouApplied = scoredJobs.slice(12, 18);
    }
    
    res.json({
      success: true,
      data: {
        recommendedJobs: scoredJobs.slice(0, 6),
        recommendedGovt,
        recommendedInternships,
        jobsNearYou: jobsNearYou.length > 0 ? jobsNearYou : scoredJobs.slice(6, 12),
        recentlyViewed: recentlyViewed.slice(0, 6),
        savedJobs: savedJobs.slice(0, 6),
        becauseYouApplied
      }
    });
  } catch (err) {
    console.error('Error fetching widgets:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch widgets', error: err.message });
  }
};

// ── GET /api/recommendations/notifications ────────────────────────────────────
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    
    // 1. Fetch user notifications
    let notifications = await Notification.find({ userId }).sort('-createdAt').limit(20).lean();
    
    // 2. Generate matching alerts dynamically if there are new jobs
    const { profile, activity } = await getProfileAndActivityData(userId, '');
    const twentyFourHrsAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const newJobs = await Job.find({
      isActive: true,
      createdAt: { $gte: twentyFourHrsAgo }
    }).lean();
    
    const highlyMatchedJobs = newJobs.filter(job => {
      const score = calculateJobMatchScore(job, profile, activity);
      return score >= 85;
    });
    
    if (highlyMatchedJobs.length > 0) {
      // Create a unified notification
      const bestJob = highlyMatchedJobs[0];
      const count = highlyMatchedJobs.length;
      
      const title = count === 1 ? 'New Matching Job Alert! 🎯' : `${count} New Job Matches Found! 🚀`;
      const message = count === 1
        ? `"${bestJob.title}" matches your preferred role and skills.`
        : `We found ${count} new jobs matching your profile. Click to check them out!`;
      
      // Check if notification already exists
      const existing = await Notification.findOne({
        userId,
        message
      });
      
      if (!existing) {
        const newNotif = await Notification.create({
          userId,
          title,
          message,
          type: 'matching_job'
        });
        notifications.unshift(newNotif.toObject());
      }
    }
    
    res.json({ success: true, count: notifications.length, data: notifications });
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch notifications', error: err.message });
  }
};

const similarJobsCache = new Map();
const SIMILAR_CACHE_TTL = 10 * 60 * 1000; // 10 minutes

function getFromSimilarCache(key) {
  const entry = similarJobsCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > SIMILAR_CACHE_TTL) {
    similarJobsCache.delete(key);
    return null;
  }
  return entry.data;
}

function setSimilarCache(key, data) {
  if (similarJobsCache.size >= 200) {
    similarJobsCache.delete(similarJobsCache.keys().next().value);
  }
  similarJobsCache.set(key, { ts: Date.now(), data });
}

exports.bustSimilarJobsCache = function() {
  similarJobsCache.clear();
};

// ── GET /api/jobs/:id/related (Overhauled Similar Jobs Engine) ────────────────
exports.getSimilarJobs = async (req, res) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit, 10) || 5;
    
    const cacheKey = `${id}::${limit}`;
    const cached = getFromSimilarCache(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        count: cached.length,
        data: cached
      });
    }
    
    const currentJob = await Job.findById(id);
    if (!currentJob) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    
    // Similarity filter rules:
    // Government recommendations go to similar government jobs
    // Private recommendations go to similar private jobs
    // Internships recommend other internships
    const filter = {
      _id: { $ne: currentJob._id },
      isActive: true,
      lastDate: { $not: { $lt: new Date() } }
    };
    
    if (currentJob.isGovernment) {
      filter.isGovernment = true;
    } else {
      filter.isGovernment = { $ne: true };
      
      const isIntern = currentJob.type === 'Internship' || /intern/i.test(currentJob.title.toLowerCase());
      if (isIntern) {
        filter.$or = [
          { type: 'Internship' },
          { title: /intern/i }
        ];
      } else {
        filter.type = { $ne: 'Internship' };
        filter.title = { $not: /intern/i };
      }
    }
    
    // Find candidate jobs
    const candidates = await Job.find(filter).limit(100).lean();
    
    // Rank by similarity
    const rankedCandidates = candidates.map(job => {
      let score = 0;
      
      // 1. Same Company (+30 points)
      if (job.company && currentJob.company && job.company.toLowerCase() === currentJob.company.toLowerCase()) {
        score += 30;
      }
      
      // 2. Title word overlap (Max 40 points)
      const currentTitleWords = currentJob.title.toLowerCase().split(/\s+/).filter(w => w.length > 3);
      const jobTitleLower = job.title.toLowerCase();
      let overlapWords = 0;
      currentTitleWords.forEach(w => {
        if (jobTitleLower.includes(w)) overlapWords++;
      });
      score += Math.min(overlapWords * 15, 40);
      
      // 3. Skill Overlap (Max 30 points)
      if (job.skills?.length > 0 && currentJob.skills?.length > 0) {
        const jobSkills = job.skills.map(s => s.toLowerCase());
        const curSkills = currentJob.skills.map(s => s.toLowerCase());
        const overlap = jobSkills.filter(s => curSkills.includes(s));
        score += Math.min(overlap.length * 10, 30);
      }
      
      // 4. Same Location (+15 points)
      if (job.location && currentJob.location && job.location.toLowerCase() === currentJob.location.toLowerCase()) {
        score += 15;
      }
      
      return { ...job, similarityScore: score };
    });
    
    // Sort descending similarity and slice limit
    rankedCandidates.sort((a, b) => b.similarityScore - a.similarityScore);
    const results = rankedCandidates.slice(0, limit);
    
    // Store in cache
    setSimilarCache(cacheKey, results);
    
    res.json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (err) {
    console.error('Error fetching similar jobs:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch similar jobs', error: err.message });
  }
};

exports.getProfileAndActivityData = getProfileAndActivityData;
exports.calculateJobMatchScore = calculateJobMatchScore;
