const mongoose = require('mongoose');
const Job = require('./server/models/Job');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

async function countJobs() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected!');

    const counts = await Job.aggregate([
      {
        $group: {
          _id: { postType: "$postType", isActive: "$isActive" },
          count: { $sum: 1 }
        }
      }
    ]);

    console.log('\n--- Job Counts by Post Type and Active Status ---');
    counts.forEach(c => {
      console.log(`PostType: ${c._id.postType || 'N/A'}, isActive: ${c._id.isActive}, Count: ${c.count}`);
    });

    console.log('\n--- Listing first 5 jobs in database ---');
    const sampleJobs = await Job.find({}).limit(5).select('title postType isActive slug');
    sampleJobs.forEach(job => {
      console.log(`- Title: "${job.title}", postType: "${job.postType}", isActive: ${job.isActive}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

countJobs();
