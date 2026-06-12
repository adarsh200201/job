const UserActivity = require('../models/UserActivity');
const CategoryScores = require('../models/CategoryScores');
const GovernmentJobPreferences = require('../models/GovernmentJobPreferences');
const UserPreferences = require('../models/UserPreferences');
const SearchHistory = require('../models/SearchHistory');
const Job = require('../models/Job');

// Helper to determine category from job title, skills, and fields
function getCategoryFromJob(job) {
  if (job.isGovernment) return 'Government Jobs';
  
  const title = (job.title || '').toLowerCase();
  const skills = (job.skills || []).map(s => s.toLowerCase());

  const softwareKeywords = [
    'developer', 'engineer', 'frontend', 'backend', 'full stack', 'fullstack', 
    'react', 'node', 'javascript', 'js', 'java', 'python', 'c++', 'c#', 'php', 
    'devops', 'qa', 'test', 'web', 'html', 'css', 'ui', 'ux', 'designer', 'programmer'
  ];
  
  const dataAIKeywords = [
    'data', 'analyst', 'science', 'scientist', 'machine learning', 'ml', 'ai', 
    'artificial intelligence', 'nlp', 'deep learning', 'analytics', 'tableau', 
    'power bi', 'sql', 'python'
  ];
  
  if (softwareKeywords.some(kw => title.includes(kw) || skills.some(s => s.includes(kw)))) {
    return 'Software Development';
  }
  if (dataAIKeywords.some(kw => title.includes(kw) || skills.some(s => s.includes(kw)))) {
    return 'Data & AI';
  }
  
  if (job.type === 'Internship' || job.postType === 'Internship') {
    return 'Internships';
  }
  
  return 'Private Jobs';
}

// Helper to increment Category Score
async function updateCategoryScore(userId, category, points) {
  if (!userId || !category) return;
  try {
    await CategoryScores.findOneAndUpdate(
      { userId, category },
      { $inc: { score: points } },
      { upsert: true, new: true }
    );
  } catch (err) {
    console.error('Error updating category score:', err);
  }
}

// Helper to update Government Job preferences
async function updateGovPreferences(userId, job, points) {
  if (!userId || !job.isGovernment) return;
  
  const title = (job.title || '').toLowerCase();
  const company = (job.company || '').toLowerCase();
  const textToSearch = `${title} ${company}`;
  
  let fieldToInc = null;
  if (/ssc|cgl|chsl|mts|gd|cpo/i.test(textToSearch)) {
    fieldToInc = 'scoreSSC';
  } else if (/upsc|gpsc|ias|ips|civil/i.test(textToSearch)) {
    fieldToInc = 'scoreCivilServices';
  } else if (/railway|rrb|ntpc|group d|apprentice/i.test(textToSearch)) {
    fieldToInc = 'scoreRailway';
  } else if (/bank|sbi|ibps|clerk|po|rbi/i.test(textToSearch)) {
    fieldToInc = 'scoreBanking';
  }
  
  if (fieldToInc) {
    try {
      await GovernmentJobPreferences.findOneAndUpdate(
        { userId },
        { $inc: { [fieldToInc]: points } },
        { upsert: true, new: true }
      );
    } catch (err) {
      console.error('Error updating government preferences:', err);
    }
  }
}

// AI Interest Prediction Engine
async function runPredictiveAIEngine(userId) {
  if (!userId) return;
  try {
    // 1. Fetch category scores
    const categoryScores = await CategoryScores.find({ userId });
    const softwareScore = categoryScores.find(c => c.category === 'Software Development')?.score || 0;
    const dataScore = categoryScores.find(c => c.category === 'Data & AI')?.score || 0;
    
    // 2. Fetch government subcategory scores
    const govPrefs = await GovernmentJobPreferences.findOne({ userId });
    const sscScore = govPrefs?.scoreSSC || 0;
    const bankingScore = govPrefs?.scoreBanking || 0;
    const railwayScore = govPrefs?.scoreRailway || 0;
    const civilScore = govPrefs?.scoreCivilServices || 0;
    
    const predictedRoles = [];
    
    // Predictions for Software Development interest
    if (softwareScore >= 5) {
      predictedRoles.push('Frontend Developer', 'MERN Stack Developer', 'Full Stack Developer', 'Software Developer');
    }
    
    // Predictions for Data & AI interest
    if (dataScore >= 5) {
      predictedRoles.push('Data Analyst', 'Data Scientist', 'AI Engineer');
    }
    
    // Predictions for Government Job interest
    if (sscScore > 0 || bankingScore > 0 || railwayScore > 0 || civilScore > 0) {
      if (sscScore >= 3 || bankingScore >= 3) {
        predictedRoles.push('Railway', 'Insurance', 'Government Apprentice');
      }
      if (civilScore >= 3) {
        predictedRoles.push('UPSC Notifications', 'State PSC Notifications', 'Civil Services Content');
      }
      if (railwayScore >= 3) {
        predictedRoles.push('RRB NTPC', 'Group D', 'Railway Apprentice');
      }
    }
    
    if (predictedRoles.length > 0) {
      await UserPreferences.findOneAndUpdate(
        { userId },
        { $set: { predictedRoles: [...new Set(predictedRoles)] } },
        { upsert: true }
      );
    }
  } catch (err) {
    console.error('Error running predictive AI engine:', err);
  }
}

// Log a user interaction activity
exports.logActivity = async (req, res) => {
  try {
    const { activityType, jobId, category, details, sessionId } = req.body;
    const userId = req.user?.id || null;
    
    if (!activityType) {
      return res.status(400).json({ success: false, message: 'activityType is required' });
    }
    
    // 1. Create activity record
    const activity = await UserActivity.create({
      userId,
      sessionId,
      activityType,
      jobId: jobId || null,
      category: category || null,
      details: details || null
    });
    
    let resolvedCategory = category;
    let job = null;
    
    // 2. Fetch job details if interaction was with a specific job
    if (jobId) {
      job = await Job.findById(jobId);
      if (job) {
        resolvedCategory = getCategoryFromJob(job);
      }
    }
    
    // Calculate category learning score weight
    let points = 0;
    switch (activityType) {
      case 'view':
        points = 1;
        break;
      case 'click_category':
        points = 2;
        break;
      case 'save':
        points = 3;
        break;
      case 'apply':
        points = 5;
        break;
      case 'time_spent':
        const seconds = details?.seconds || 0;
        if (seconds > 60) points = 4;
        else if (seconds > 30) points = 2;
        else if (seconds > 10) points = 1;
        break;
      default:
        points = 0;
    }
    
    // 3. Update scores and run predictors if user is logged in
    if (userId) {
      if (resolvedCategory && points > 0) {
        await updateCategoryScore(userId, resolvedCategory, points);
      }
      if (job && job.isGovernment && points > 0) {
        await updateGovPreferences(userId, job, points);
      }
      if (activityType === 'view' || activityType === 'save' || activityType === 'apply') {
        await runPredictiveAIEngine(userId);
      }
    }
    
    // 4. Track searches
    if (activityType === 'view' && details?.query) {
      await SearchHistory.create({
        userId,
        sessionId,
        query: details.query
      });
      // Extract categories from search terms
      if (userId) {
        const queryLower = details.query.toLowerCase();
        if (/ssc|upsc|railway|banking|govt|government/i.test(queryLower)) {
          await updateCategoryScore(userId, 'Government Jobs', 2);
        } else if (/react|node|javascript|frontend|backend|fullstack|java/i.test(queryLower)) {
          await updateCategoryScore(userId, 'Software Development', 2);
        } else if (/data|analyst|analytics|ai|ml|python/i.test(queryLower)) {
          await updateCategoryScore(userId, 'Data & AI', 2);
        }
        await runPredictiveAIEngine(userId);
      }
    }
    
    res.json({ success: true, activity });
  } catch (err) {
    console.error('Error logging user activity:', err);
    res.status(500).json({ success: false, message: 'Failed to log activity', error: err.message });
  }
};
