const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGO_URI;
const Job = require('../models/Job');

async function main() {
  if (!MONGO_URI) {
    console.error("❌ MONGO_URI not found in environment variables.");
    process.exit(1);
  }

  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully!");

    console.log("Fetching active jobs...");
    const jobs = await Job.find({ isActive: true }).sort({ createdAt: -1 });
    console.log(`Found ${jobs.length} active jobs.`);

    const exportedJobs = jobs.map(j => {
      const jobObj = j.toObject ? j.toObject() : j;
      return {
        title: jobObj.title,
        company: jobObj.company,
        location: jobObj.location || 'Across India',
        type: jobObj.type || 'Full-Time',
        experience: jobObj.experience || 'Freshers',
        education: jobObj.education || 'Graduate',
        batch: jobObj.batch || '',
        salary: jobObj.salary || 'Best in Industry',
        description: jobObj.description || '',
        jobDescription: jobObj.jobDescription || '',
        applyLink: jobObj.applyLink,
        image: jobObj.image || '',
        postType: jobObj.postType || 'Job',
        isGovernment: !!jobObj.isGovernment,
        slug: jobObj.slug,
        createdAt: jobObj.createdAt
      };
    });

    const outputPath = path.resolve(__dirname, '../../../Automation/website_jobs.json');
    fs.writeFileSync(outputPath, JSON.stringify(exportedJobs, null, 2), 'utf-8');
    console.log(`✅ Exported ${exportedJobs.length} jobs to ${outputPath}`);

  } catch (err) {
    console.error("❌ Error exporting jobs:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

main();
