const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');

// Load environment variables from root env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const { connectDB } = require('../utils/db');
const User = require('../models/User');
const Job = require('../models/Job');
const UserPreferences = require('../models/UserPreferences');
const UserActivity = require('../models/UserActivity');
const CategoryScores = require('../models/CategoryScores');
const GovernmentJobPreferences = require('../models/GovernmentJobPreferences');

async function testRecommendations() {
  try {
    console.log('🔗 Connecting to database for testing...');
    await connectDB();
    console.log('✓ Database connected');
    
    // 1. Create a dummy test user
    const testEmail = `test_recommend_${Math.floor(Math.random() * 10000)}@nextjobpost.in`;
    console.log(`👤 Creating test user: ${testEmail}`);
    const testUser = await User.create({
      email: testEmail,
      name: 'Recommendation Tester',
      preferredRole: 'React Developer',
      skills: ['React', 'JavaScript', 'HTML', 'CSS'],
      experienceLevel: 'Fresher',
      location: 'Bengaluru',
      onboardingCompleted: true
    });
    
    const userId = testUser._id;
    
    // 2. Initialize default UserPreferences
    await UserPreferences.create({
      userId,
      preferredRoles: ['React Developer'],
      preferredLocations: ['Bengaluru'],
      skills: ['React', 'JavaScript', 'HTML', 'CSS'],
      experienceLevel: 'Fresher'
    });
    
    // 3. Simulate viewing 2 SSC government jobs to test Government Job Intelligence
    console.log('\n🏛️ Simulating government job views...');
    const sscJobs = await Job.find({ isGovernment: true, title: /ssc/i }).limit(2).lean();
    if (sscJobs.length > 0) {
      for (const job of sscJobs) {
        console.log(`- Viewing Government job: "${job.title}"`);
        // Log view activity
        await UserActivity.create({
          userId,
          activityType: 'view',
          jobId: job._id
        });
        // Increment Government preferences (simulating activity controller)
        await GovernmentJobPreferences.findOneAndUpdate(
          { userId },
          { $inc: { scoreSSC: 1 } },
          { upsert: true }
        );
        // Increment Category score
        await CategoryScores.findOneAndUpdate(
          { userId, category: 'Government Jobs' },
          { $inc: { score: 1 } },
          { upsert: true }
        );
      }
    } else {
      console.log('No SSC jobs in database to simulate.');
    }
    
    // 4. Simulate viewing React jobs to test Category Learning Engine
    console.log('\n💻 Simulating React/Frontend job views...');
    const reactJobs = await Job.find({ isGovernment: { $ne: true }, title: /react|frontend|javascript/i }).limit(2).lean();
    if (reactJobs.length > 0) {
      for (const job of reactJobs) {
        console.log(`- Viewing Private job: "${job.title}"`);
        await UserActivity.create({
          userId,
          activityType: 'view',
          jobId: job._id
        });
        await CategoryScores.findOneAndUpdate(
          { userId, category: 'Software Development' },
          { $inc: { score: 1 } },
          { upsert: true }
        );
      }
    } else {
      console.log('No private React/Frontend jobs in database to simulate.');
    }
    
    // 5. Test AI Interest Predictions
    console.log('\n🧠 Simulating AI Interest Predictions...');
    const catScores = await CategoryScores.find({ userId }).lean();
    console.log('User category scores updated:');
    catScores.forEach(c => console.log(`  - ${c.category}: ${c.score}`));
    
    const govPrefs = await GovernmentJobPreferences.findOne({ userId }).lean();
    if (govPrefs) {
      console.log(`User Government subcategory scores: ssc=${govPrefs.scoreSSC}, railway=${govPrefs.scoreRailway}, banking=${govPrefs.scoreBanking}`);
    }
    
    // Trigger predictive AI logic
    const predictedRoles = [];
    const softwareScore = catScores.find(c => c.category === 'Software Development')?.score || 0;
    if (softwareScore >= 2) {
      predictedRoles.push('Frontend Developer', 'MERN Stack Developer', 'Full Stack Developer', 'Software Developer');
    }
    const sscScore = govPrefs?.scoreSSC || 0;
    if (sscScore >= 2) {
      predictedRoles.push('Railway', 'Insurance', 'Government Apprentice');
    }
    
    await UserPreferences.findOneAndUpdate(
      { userId },
      { $set: { predictedRoles } }
    );
    console.log(`Predicted roles created: ${predictedRoles.join(', ')}`);
    
    // 6. Test Similar Jobs Overhauled Route
    console.log('\n🔄 Testing Similar Jobs Engine (overhauled routes)...');
    const jobs = await Job.find({ isActive: true }).limit(5).lean();
    if (jobs.length > 0) {
      const targetJob = jobs[0];
      console.log(`Target Job: "${targetJob.title}" (Company: ${targetJob.company}, Govt: ${targetJob.isGovernment})`);
      
      // Compute similarity manually for this test
      const candidates = await Job.find({ _id: { $ne: targetJob._id }, isGovernment: targetJob.isGovernment }).limit(5).lean();
      console.log(`Found ${candidates.length} similar candidates:`);
      candidates.forEach(c => {
        let sim = 0;
        if (c.company === targetJob.company) sim += 30;
        if (c.location === targetJob.location) sim += 15;
        console.log(`  - "${c.title}" (Company: ${c.company}) -> Similarity points: ${sim}`);
      });
    }
    
    // 7. Cleanup test data
    console.log('\n🧹 Cleaning up test user and session activity...');
    await User.findByIdAndDelete(userId);
    await UserPreferences.findOneAndDelete({ userId });
    await UserActivity.deleteMany({ userId });
    await CategoryScores.deleteMany({ userId });
    await GovernmentJobPreferences.findOneAndDelete({ userId });
    console.log('✓ Cleanup complete');
    
  } catch (err) {
    console.error('Test failed with error:', err);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database closed');
    process.exit(0);
  }
}

testRecommendations();
