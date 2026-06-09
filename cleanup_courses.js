const mongoose = require('mongoose');
const Job = require('./server/models/Job');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

const forbiddenKeywords = ["certification", "course", "bootcamp", "training", "academy", "certified"];

async function cleanUp() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected!');

    // Fetch all jobs in the database
    const allJobs = await Job.find({});
    console.log(`Fetched ${allJobs.length} total jobs from database.`);

    let deletedCount = 0;

    for (const job of allJobs) {
      if (!job.title) continue;

      // Normalize unicode bold/italic mathematical alphanumeric chars to standard Latin
      const normalizedTitle = job.title.normalize('NFKD').toLowerCase();

      // Check if it contains any forbidden keywords
      const hasSpamKeyword = forbiddenKeywords.some(kw => normalizedTitle.includes(kw));

      if (hasSpamKeyword) {
        console.log(`🗑️ Deleting spam posting: "${job.title}" (ID: ${job._id})`);
        await Job.findByIdAndDelete(job._id);
        deletedCount++;
      }
    }

    console.log(`\n=============================================`);
    console.log(`✅ Cleanup Complete! Deleted ${deletedCount} spam posts.`);
    console.log(`=============================================`);

  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database.');
  }
}

cleanUp();
