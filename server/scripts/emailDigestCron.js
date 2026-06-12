const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const { connectDB } = require('../utils/db');
const User = require('../models/User');
const Job = require('../models/Job');
const UserPreferences = require('../models/UserPreferences');
const UserActivity = require('../models/UserActivity');
const CategoryScores = require('../models/CategoryScores');
const GovernmentJobPreferences = require('../models/GovernmentJobPreferences');

// Helper to determine category from job (duplicated here for independence)
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

// Compute Match Score (duplicated for standalone script usage)
function calculateJobMatchScore(job, profile, activity, govPrefs = null) {
  let earned = 0;
  
  const title = (job.title || '').toLowerCase();
  const company = (job.company || '').toLowerCase();
  const location = (job.location || '').toLowerCase();
  const experience = (job.experience || '').toLowerCase();
  const skills = (job.skills || []).map(s => s.toLowerCase());
  
  // 1. Role Match (40 pts)
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
      const words = rLower.split(' ');
      if (words.some(w => w.length > 3 && title.includes(w))) {
        roleMatchPoints = Math.max(roleMatchPoints, 20);
      }
    }
  }
  earned += roleMatchPoints;
  
  // 2. Skill Match (20 pts)
  let skillMatchPoints = 0;
  if (profile.skills.length > 0) {
    const userSkills = profile.skills.map(s => s.toLowerCase());
    if (skills.length > 0) {
      const matches = skills.filter(s => userSkills.includes(s));
      skillMatchPoints = Math.round((matches.length / Math.max(skills.length, 1)) * 20);
    } else {
      const desc = (job.jobDescription || '').toLowerCase();
      const matches = userSkills.filter(s => desc.includes(s) || title.includes(s));
      if (matches.length > 0) skillMatchPoints = 10;
      if (matches.length > 2) skillMatchPoints = 20;
    }
  }
  earned += skillMatchPoints;
  
  // 3. Location Match (20 pts)
  let locationMatchPoints = 0;
  if (profile.locations.length > 0) {
    const isUserRemote = profile.locations.some(l => /remote|home/i.test(l));
    const isJobRemote = job.type === 'Remote' || /remote|wfh|work/i.test(location) || /remote/i.test(job.type || '');
    if (isUserRemote && isJobRemote) {
      locationMatchPoints = 20;
    } else {
      const match = profile.locations.some(l => location.includes(l.toLowerCase()));
      if (match) locationMatchPoints = 20;
    }
  }
  earned += locationMatchPoints;
  
  // 4. Experience Match (10 pts)
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
  
  // 5. Activity Match (20 pts)
  let activityMatchPoints = 0;
  if (activity.recentCompanies.includes(job.company)) activityMatchPoints = 10;
  if (job.isGovernment && activity.recentCategories.includes('Government Jobs')) activityMatchPoints = 20;
  earned += activityMatchPoints;
  
  // 6. Saved Match (20 pts)
  let savedMatch = 0;
  if (activity.savedJobIds.includes(job._id.toString())) savedMatch = 20;
  earned += savedMatch;
  
  // 7. Applied Match (20 pts)
  let appliedMatch = 0;
  if (activity.appliedJobIds.includes(job._id.toString())) appliedMatch = 20;
  earned += appliedMatch;
  
  // 8. Government Category Match (30 pts)
  let govMatchPoints = 0;
  if (job.isGovernment && govPrefs) {
    const textToSearch = `${title} ${company}`;
    if (/ssc|cgl|chsl|mts/i.test(textToSearch) && govPrefs.scoreSSC > 0) govMatchPoints = 30;
    else if (/upsc|gpsc|ias|ips/i.test(textToSearch) && govPrefs.scoreCivilServices > 0) govMatchPoints = 30;
    else if (/railway|rrb/i.test(textToSearch) && govPrefs.scoreRailway > 0) govMatchPoints = 30;
    else if (/bank|sbi|ibps/i.test(textToSearch) && govPrefs.scoreBanking > 0) govMatchPoints = 30;
  }
  earned += govMatchPoints;
  
  // 9. Internship Match (20 pts)
  let internshipMatchPoints = 0;
  const isInternship = job.type === 'Internship' || /internship|intern/i.test(title);
  const userPrefersIntern = profile.roles.some(r => /intern/i.test(r.toLowerCase())) || activity.recentCategories.includes('Internships');
  if (isInternship && userPrefersIntern) {
    internshipMatchPoints = 20;
  }
  earned += internshipMatchPoints;
  
  const rawScore = earned;
  const normalized = Math.round((rawScore / 200) * 100);
  const seed = parseInt(job._id.toString().substring(0, 8), 16) % 15;
  const finalScore = normalized < 45 ? 65 + seed : normalized;
  
  return Math.min(finalScore, 99);
}

// Format single job card for HTML email
function formatEmailJobRow(job) {
  const badgeColor = job.isGovernment ? '#ff9933' : '#7c3aed';
  const scoreText = job.matchScore ? `<span style="background-color: ${job.matchScore >= 80 ? '#dcfce7' : '#f1f5f9'}; color: ${job.matchScore >= 80 ? '#16a34a' : '#475569'}; font-size: 11px; font-weight: bold; padding: 3px 8px; border-radius: 99px; margin-left: 10px;">🎯 ${job.matchScore}% Match</span>` : '';
  
  return `
    <div style="border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px; margin-bottom: 15px; background-color: #ffffff; border-left: 4px solid ${badgeColor};">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5px;">
        <span style="font-size: 12px; font-weight: bold; color: ${badgeColor}; text-transform: uppercase;">${job.company}</span>
        ${scoreText}
      </div>
      <h3 style="margin: 5px 0; font-size: 16px; font-weight: bold; color: #1e293b;">
        <a href="https://nextjobpost.in/${job.slug}" target="_blank" style="color: #1e293b; text-decoration: none;">${job.title}</a>
      </h3>
      <div style="margin-top: 8px; font-size: 13px; color: #64748b;">
        ${job.location ? `<span style="margin-right: 12px;">📍 ${job.location}</span>` : ''}
        ${job.type ? `<span style="margin-right: 12px;">💼 ${job.type}</span>` : ''}
        ${job.salary ? `<span>💰 ${job.salary}</span>` : ''}
      </div>
      <a href="https://nextjobpost.in/${job.slug}" target="_blank" style="display: inline-block; margin-top: 10px; font-size: 13px; font-weight: bold; color: #7c3aed; text-decoration: none;">View Job Details &rarr;</a>
    </div>
  `;
}

// Compile Daily Digest Email Body
function compileDailyDigestHTML(username, matchedJobs) {
  const jobListHTML = matchedJobs.length > 0 
    ? matchedJobs.map(formatEmailJobRow).join('') 
    : '<p style="color: #64748b; font-size: 14px;">We didn\'t find any new matches today. Try updating your profile keywords to get better recommendations.</p>';
    
  return `
    <div style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 20px; color: #1e293b; max-width: 600px; margin: 0 auto; border-radius: 16px; border: 1px solid #f1f5f9;">
      <div style="text-align: center; margin-bottom: 25px;">
        <h1 style="color: #7c3aed; font-size: 24px; font-weight: 800; margin: 0;">🎯 NextJobPost Daily matches</h1>
        <p style="color: #64748b; font-size: 14px; margin-top: 5px;">Hi ${username}, here are your personalized job matches for today!</p>
      </div>
      <div>
        ${jobListHTML}
      </div>
      <div style="text-align: center; margin-top: 25px; padding-top: 15px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
        <p>You received this because you registered at NextJobPost.in and opted into matching updates.</p>
        <p><a href="https://nextjobpost.in/dashboard" target="_blank" style="color: #7c3aed; text-decoration: underline;">Update Profile</a> | <a href="https://nextjobpost.in" target="_blank" style="color: #7c3aed; text-decoration: underline;">Unsubscribe</a></p>
      </div>
    </div>
  `;
}

// Compile Weekly Digest Email Body
function compileWeeklyDigestHTML(username, profileMatches, govUpdates, internships) {
  const matchHTML = profileMatches.length > 0 ? profileMatches.map(formatEmailJobRow).join('') : '<p style="color: #64748b; font-size: 13px;">No direct profile matches this week.</p>';
  const govHTML = govUpdates.length > 0 ? govUpdates.map(formatEmailJobRow).join('') : '<p style="color: #64748b; font-size: 13px;">No new government jobs this week.</p>';
  const internHTML = internships.length > 0 ? internships.map(formatEmailJobRow).join('') : '<p style="color: #64748b; font-size: 13px;">No new internship matches this week.</p>';
  
  return `
    <div style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 20px; color: #1e293b; max-width: 600px; margin: 0 auto; border-radius: 16px; border: 1px solid #f1f5f9;">
      <div style="text-align: center; margin-bottom: 25px;">
        <h1 style="color: #6d28d9; font-size: 26px; font-weight: 800; margin: 0;">✨ Your NextJobPost Weekly digest</h1>
        <p style="color: #64748b; font-size: 14px; margin-top: 5px;">Hi ${username}, here is a roundup of top opportunities matching your interest profile this week!</p>
      </div>
      
      <div style="margin-bottom: 30px;">
        <h2 style="font-size: 18px; font-weight: 800; color: #1e293b; border-bottom: 2px solid #7c3aed; padding-bottom: 6px; margin-bottom: 12px;">🎯 Top Matches For Your Profile</h2>
        ${matchHTML}
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="font-size: 18px; font-weight: 800; color: #1e293b; border-bottom: 2px solid #ff9933; padding-bottom: 6px; margin-bottom: 12px;">🏛️ Government Job Notifications</h2>
        ${govHTML}
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="font-size: 18px; font-weight: 800; color: #1e293b; border-bottom: 2px solid #2563eb; padding-bottom: 6px; margin-bottom: 12px;">🎓 Internship Opportunities</h2>
        ${internHTML}
      </div>
      
      <div style="text-align: center; margin-top: 25px; padding-top: 15px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
        <p>You received this because you registered at NextJobPost.in.</p>
        <p><a href="https://nextjobpost.in/dashboard" target="_blank" style="color: #7c3aed; text-decoration: underline;">Update Profile</a> | <a href="https://nextjobpost.in" target="_blank" style="color: #7c3aed; text-decoration: underline;">Unsubscribe</a></p>
      </div>
    </div>
  `;
}

// Main Runner
async function run() {
  let connection = null;
  try {
    console.log('🔗 Connecting to database...');
    await connectDB();
    console.log('✓ Connected');
    
    const args = process.argv.slice(2);
    const isWeekly = args.includes('--type=weekly') || args.includes('-w');
    console.log(`✉ Generating ${isWeekly ? 'WEEKLY' : 'DAILY'} smart email digests...`);
    
    // Fetch all registered users
    const users = await User.find({ onboardingCompleted: true }).lean();
    if (users.length === 0) {
      console.log('No users with completed onboarding found.');
      return;
    }
    
    // Fetch all active jobs
    const activeJobs = await Job.find({ isActive: true }).sort('-createdAt').limit(200).lean();
    console.log(`Processing ${users.length} users and matching against ${activeJobs.length} active jobs...`);
    
    for (const user of users) {
      const userId = user._id;
      
      // Load user preferences & activity
      const prefs = await UserPreferences.findOne({ userId }).lean();
      const govPrefs = await GovernmentJobPreferences.findOne({ userId }).lean();
      
      const profile = {
        roles: [user.preferredRole].filter(Boolean),
        locations: [user.location].filter(Boolean),
        skills: user.skills || [],
        experienceLevel: user.experienceLevel || '',
        predictedRoles: prefs?.predictedRoles || []
      };
      
      if (prefs) {
        if (prefs.preferredRoles?.length > 0) profile.roles.push(...prefs.preferredRoles);
        if (prefs.preferredLocations?.length > 0) profile.locations.push(...prefs.preferredLocations);
        if (prefs.skills?.length > 0) profile.skills.push(...prefs.skills);
        profile.roles = [...new Set(profile.roles)];
        profile.locations = [...new Set(profile.locations)];
        profile.skills = [...new Set(profile.skills)];
      }
      
      // Fetch activity details
      const activities = await UserActivity.find({ userId }).limit(100).lean();
      const activity = {
        viewedJobIds: [],
        savedJobIds: [],
        appliedJobIds: [],
        recentCompanies: [],
        recentCategories: []
      };
      
      activities.forEach(act => {
        if (act.activityType === 'view' && act.jobId) activity.viewedJobIds.push(act.jobId.toString());
        if (act.activityType === 'save' && act.jobId) activity.savedJobIds.push(act.jobId.toString());
        if (act.activityType === 'apply' && act.jobId) activity.appliedJobIds.push(act.jobId.toString());
      });
      
      // Compute scored matching jobs
      const scoredJobs = activeJobs.map(job => {
        const score = calculateJobMatchScore(job, profile, activity, govPrefs);
        return { ...job, matchScore: score };
      }).sort((a, b) => b.matchScore - a.matchScore);
      
      let html = '';
      if (isWeekly) {
        const profileMatches = scoredJobs.slice(0, 5);
        const govUpdates = scoredJobs.filter(j => j.isGovernment).slice(0, 3);
        const internships = scoredJobs.filter(j => j.type === 'Internship' || /intern/i.test(j.title.toLowerCase())).slice(0, 3);
        
        html = compileWeeklyDigestHTML(user.name || user.email, profileMatches, govUpdates, internships);
        console.log(`\n======================================================`);
        console.log(`✉ WEEKLY EMAIL DIGEST COMPILED FOR: ${user.email}`);
        console.log(`------------------------------------------------------`);
        console.log(`Matching scores: ${profileMatches.map(m => `${m.company}: ${m.matchScore}%`).join(', ')}`);
        console.log(`======================================================`);
      } else {
        const dailyMatches = scoredJobs.slice(0, 5);
        html = compileDailyDigestHTML(user.name || user.email, dailyMatches);
        console.log(`\n======================================================`);
        console.log(`✉ DAILY EMAIL DIGEST COMPILED FOR: ${user.email}`);
        console.log(`------------------------------------------------------`);
        console.log(`Top daily matches: ${dailyMatches.map(m => `${m.company} (${m.matchScore}%)`).join(', ')}`);
        console.log(`======================================================`);
      }
    }
    
    console.log('\n✓ Digest compilation completed successfully.');
  } catch (err) {
    console.error('Error compiling digests:', err);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

run();
