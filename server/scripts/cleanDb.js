const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const Job = require('../models/Job');
const { connectDB } = require('../utils/db');

const isGarbageSlug = (slug) => {
  if (!slug) return true;
  if (slug.length < 12) {
    if (/^-/i.test(slug)) return true;
    const parts = slug.split('-');
    if (parts.length <= 2) {
      const base = parts[0].toLowerCase();
      if (['and', 'or', 'the', 'in', 'to', 'for', 'a', 'an', 'at', 'by', 'of', 'on', 'with', 'if'].includes(base)) {
        return true;
      }
    }
  }
  if (/^-[0-9a-fA-F]+$/i.test(slug) || /^[0-9a-fA-F]{6}$/i.test(slug)) return true;
  return false;
};

async function cleanDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await connectDB();
    console.log('✓ Connected successfully.');

    console.log('🔍 Fetching all jobs from database...');
    const allJobs = await Job.find({});
    console.log(`✓ Fetched ${allJobs.length} total jobs.`);

    const jobsToDelete = new Set();
    const garbageJobs = [];
    
    const duplicatesByUrl = new Map();
    const duplicatesByTitleAndCompany = new Map();

    for (const job of allJobs) {
      // 1. Identify garbage slugs
      if (isGarbageSlug(job.slug)) {
        garbageJobs.push(job);
        jobsToDelete.add(job._id.toString());
        continue;
      }

      // 2. Group by sourceUrl
      if (job.sourceUrl) {
        const urlClean = job.sourceUrl.trim().toLowerCase();
        if (!duplicatesByUrl.has(urlClean)) {
          duplicatesByUrl.set(urlClean, []);
        }
        duplicatesByUrl.get(urlClean).push(job);
      }

      // 3. Group by title + company
      const titleCompanyKey = `${job.title.trim().toLowerCase()}|${job.company.trim().toLowerCase()}`;
      if (!duplicatesByTitleAndCompany.has(titleCompanyKey)) {
        duplicatesByTitleAndCompany.set(titleCompanyKey, []);
      }
      duplicatesByTitleAndCompany.get(titleCompanyKey).push(job);
    }

    console.log(`\n🧹 Analyzing duplicates...`);

    // Process sourceUrl duplicates
    let urlDuplicateCount = 0;
    for (const [url, group] of duplicatesByUrl.entries()) {
      if (group.length > 1) {
        // Sort by createdAt descending (latest first)
        group.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Keep the first one (latest), mark others for deletion
        for (let i = 1; i < group.length; i++) {
          const idStr = group[i]._id.toString();
          if (!jobsToDelete.has(idStr)) {
            jobsToDelete.add(idStr);
            urlDuplicateCount++;
          }
        }
      }
    }
    console.log(`- Found ${urlDuplicateCount} duplicate jobs by sourceUrl matching.`);

    // Process title + company duplicates
    let titleDuplicateCount = 0;
    for (const [key, group] of duplicatesByTitleAndCompany.entries()) {
      if (group.length > 1) {
        // Sort by createdAt descending (latest first)
        group.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Keep the first one (latest), mark others for deletion
        for (let i = 1; i < group.length; i++) {
          const idStr = group[i]._id.toString();
          if (!jobsToDelete.has(idStr)) {
            jobsToDelete.add(idStr);
            titleDuplicateCount++;
          }
        }
      }
    }
    console.log(`- Found ${titleDuplicateCount} duplicate jobs by title + company matching.`);
    console.log(`- Found ${garbageJobs.length} garbage slug jobs.`);

    const totalToDelete = jobsToDelete.size;
    console.log(`\n🚨 Total unique jobs marked for deletion: ${totalToDelete}`);

    if (totalToDelete > 0) {
      const idsArray = Array.from(jobsToDelete).map(id => new mongoose.Types.ObjectId(id));
      
      // Print sample of items being deleted
      console.log('\n📋 Sample of jobs being deleted:');
      const sampleJobs = allJobs.filter(j => jobsToDelete.has(j._id.toString())).slice(0, 10);
      sampleJobs.forEach(j => {
        console.log(`  - Title: "${j.title}" | Company: "${j.company}" | Slug: "${j.slug}" | Created: ${j.createdAt}`);
      });

      console.log('\n🧹 Deleting jobs from MongoDB...');
      const deleteResult = await Job.deleteMany({ _id: { $in: idsArray } });
      console.log(`✓ Successfully deleted ${deleteResult.deletedCount} jobs from the database.`);
    } else {
      console.log('\n✓ Database is already clean. No jobs deleted.');
    }

    console.log('\n🎉 Database cleanup finished successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error during cleanup:', error);
    process.exit(1);
  }
}

cleanDatabase();
