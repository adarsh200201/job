const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');

// Load env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const { connectDB } = require('../utils/db');
const User = require('../models/User');
const Job = require('../models/Job');
const UserPreferences = require('../models/UserPreferences');
const UserActivity = require('../models/UserActivity');
const { getProfileAndActivityData, calculateJobMatchScore } = require('../controllers/recommendationController');
const GovernmentJobPreferences = require('../models/GovernmentJobPreferences');

async function verifyPersonalization() {
  try {
    console.log('🔗 Connecting to database...');
    await connectDB();
    console.log('✓ Connected');

    // 1. Create a matching job and a non-matching job for testing
    console.log('Adding test jobs...');
    const matchJob = await Job.create({
      title: 'React Engineer Position',
      company: 'React Tech',
      location: 'Bengaluru',
      type: 'Full-Time',
      experience: 'Fresher',
      education: 'B.Tech',
      skills: ['React', 'JavaScript'],
      jobDescription: 'Looking for a React Engineer with React and JavaScript experience.',
      applyLink: 'https://example.com/apply',
      isActive: true
    });

    const nonMatchJob = await Job.create({
      title: 'Mali Gardener Post',
      company: 'Gardening Corp',
      location: 'Pune',
      type: 'Full-Time',
      experience: '1 Year',
      education: '10th',
      jobDescription: 'Mali gardener position.',
      applyLink: 'https://example.com/apply',
      isActive: true
    });

    // 2. Test Guest / Empty profile case (Regular Flow)
    console.log('\n--- Test Case 1: Guest User (No preferences) ---');
    const guestData = await getProfileAndActivityData(null, 'guest-session-id');
    const guestProfile = guestData.profile;
    const hasGuestPrefs = !!(
      (guestProfile.roles && guestProfile.roles.length > 0) ||
      (guestProfile.locations && guestProfile.locations.length > 0) ||
      (guestProfile.skills && guestProfile.skills.length > 0) ||
      (guestData.activity.viewedJobIds && guestData.activity.viewedJobIds.length > 0)
    );
    console.log(`Guest profile loaded. Has preferences: ${hasGuestPrefs} (Expected: false)`);

    // Fetch jobs like regular flow (mocking controller logic)
    const guestJobs = await Job.find({ isActive: true }).sort('-createdAt').limit(5).lean();
    console.log(`Retrieved ${guestJobs.length} jobs.`);
    guestJobs.forEach(job => {
      console.log(` - Job: "${job.title}", matchScore: ${job.matchScore || 'undefined'}`);
    });

    // Test Case 1.5: Guest User with Session Activity
    console.log('\n--- Test Case 1.5: Guest User with Session Activity ---');
    await UserActivity.create({
      sessionId: 'guest-session-id',
      activityType: 'view',
      jobId: matchJob._id
    });

    const guestData2 = await getProfileAndActivityData(null, 'guest-session-id');
    const guestProfile2 = guestData2.profile;
    const guestActivity2 = guestData2.activity;
    const hasGuestPrefs2 = !!(
      (guestProfile2.roles && guestProfile2.roles.length > 0) ||
      (guestProfile2.locations && guestProfile2.locations.length > 0) ||
      (guestProfile2.skills && guestProfile2.skills.length > 0) ||
      (guestActivity2.viewedJobIds && guestActivity2.viewedJobIds.length > 0)
    );
    console.log(`Guest profile reloaded with activity. Has preferences: ${hasGuestPrefs2} (Expected: true)`);

    // Mock personalized jobs list fetching for guest with activity
    const guestCandidates = await Job.find({ _id: { $in: [matchJob._id, nonMatchJob._id] } }).lean();
    const guestScoredJobs = guestCandidates.map(job => {
      const score = calculateJobMatchScore(job, guestProfile2, guestActivity2, null);
      return { ...job, matchScore: score };
    });
    guestScoredJobs.sort((a, b) => b.matchScore - a.matchScore);
    console.log('Guest Scored and Sorted Jobs (React job should be prioritized due to re-visit boost):');
    guestScoredJobs.forEach(job => {
      console.log(` - [Score: ${job.matchScore}%] "${job.title}"`);
    });

    // 3. Test User WITH preferences
    console.log('\n--- Test Case 2: User with Profile Preferences ---');
    const testEmail = `verify_pref_${Math.floor(Math.random() * 10000)}@nextjobpost.in`;
    const testUser = await User.create({
      email: testEmail,
      name: 'Verification User',
      preferredRole: 'React Engineer',
      skills: ['React', 'JavaScript'],
      location: 'Bengaluru',
      onboardingCompleted: true
    });
    const userId = testUser._id;

    // Load preferences
    const userData = await getProfileAndActivityData(userId, 'user-session-id');
    const userProfile = userData.profile;
    const userActivity = userData.activity;
    const hasUserPrefs = !!(
      (userProfile.roles && userProfile.roles.length > 0) ||
      (userProfile.locations && userProfile.locations.length > 0) ||
      (userProfile.skills && userProfile.skills.length > 0)
    );
    console.log(`User profile loaded. Has preferences: ${hasUserPrefs} (Expected: true)`);
    console.log(`Preferred Roles: ${userProfile.roles.join(', ')}`);
    console.log(`Preferred Locations: ${userProfile.locations.join(', ')}`);
    console.log(`Preferred Skills: ${userProfile.skills.join(', ')}`);

    const govPrefs = await GovernmentJobPreferences.findOne({ userId });

    // Mock personalized jobs list fetching
    const candidates = await Job.find({ _id: { $in: [matchJob._id, nonMatchJob._id] } }).lean();
    const scoredJobs = candidates.map(job => {
      const score = calculateJobMatchScore(job, userProfile, userActivity, govPrefs);
      return { ...job, matchScore: score };
    });

    // Sort: Match Score desc, createdAt desc
    scoredJobs.sort((a, b) => {
      const scoreDiff = b.matchScore - a.matchScore;
      if (Math.abs(scoreDiff) > 0) {
        return scoreDiff;
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    console.log('\nScored and Sorted Jobs:');
    scoredJobs.forEach((job, index) => {
      console.log(`${index + 1}. [Score: ${job.matchScore}%] "${job.title}" at ${job.company} (${job.location})`);
    });

    // Verify that the React job is prioritized first for React preferred user
    const topJob = scoredJobs[0];
    if (topJob.title.includes('React') || topJob.matchScore >= 80) {
      console.log('\n✓ SUCCESS: Matching job prioritized correctly at the top!');
    } else {
      console.log('\n⚠ WARNING: Matching job was not prioritized first. Check scoring metrics.');
    }

    // 4. Cleanup
    console.log('\n🧹 Cleaning up database...');
    await User.findByIdAndDelete(userId);
    await Job.findByIdAndDelete(matchJob._id);
    await Job.findByIdAndDelete(nonMatchJob._id);
    await UserActivity.deleteMany({ sessionId: 'guest-session-id' });
    console.log('✓ Cleanup done');

  } catch (e) {
    console.error('Test failed:', e);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connection closed');
  }
}

verifyPersonalization();
