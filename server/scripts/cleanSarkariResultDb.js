/**
 * cleanSarkariResultDb.js
 * ─────────────────────────────────────────────────────────────
 * Deletes any Job postings and Scraped Items related to Sarkari Result.
 * Run: node server/scripts/cleanSarkariResultDb.js
 * ─────────────────────────────────────────────────────────────
 */

require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI not found in .env');
  process.exit(1);
}

async function main() {
  console.log('🔗 Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 15000 });
  console.log('✅ Connected!\n');

  const db = mongoose.connection.db;

  // Define dynamic models to avoid schema constraints
  const Job = mongoose.model('Job', new mongoose.Schema({}, { strict: false }), 'jobs');
  const ScrapedItem = mongoose.model('ScrapedItem', new mongoose.Schema({}, { strict: false }), 'scrapeditems');

  // We want to target anything with "sarkariresult" in the URL or source name
  const query = {
    $or: [
      { sourceWebsite: /sarkariresult/i },
      { sourceUrl: /sarkariresult/i },
      { applyLink: /sarkariresult/i },
      { pdfLink: /sarkariresult/i }
    ]
  };

  const scrapedItemQuery = {
    $or: [
      { sourceName: /sarkariresult/i },
      { rawUrl: /sarkariresult/i }
    ]
  };

  // 1. Check matching counts
  const totalJobs = await Job.countDocuments();
  const matchingJobs = await Job.countDocuments(query);
  const totalScrapedItems = await ScrapedItem.countDocuments();
  const matchingScrapedItems = await ScrapedItem.countDocuments(scrapedItemQuery);

  console.log(`📊 Current Database Stats:`);
  console.log(`   - Total Jobs: ${totalJobs}`);
  console.log(`   - Jobs matching 'sarkariresult': ${matchingJobs}`);
  console.log(`   - Total Scraped Items: ${totalScrapedItems}`);
  console.log(`   - Scraped Items matching 'sarkariresult': ${matchingScrapedItems}`);

  // 2. Perform deletion if any match
  if (matchingJobs > 0) {
    console.log(`\n🗑️  Deleting ${matchingJobs} jobs related to Sarkari Result...`);
    const res = await Job.deleteMany(query);
    console.log(`   ✅ Deleted ${res.deletedCount} jobs.`);
  } else {
    console.log('\nℹ️  No jobs related to Sarkari Result to delete.');
  }

  if (matchingScrapedItems > 0) {
    console.log(`\n🗑️  Deleting ${matchingScrapedItems} scraped items related to Sarkari Result...`);
    const res = await ScrapedItem.deleteMany(scrapedItemQuery);
    console.log(`   ✅ Deleted ${res.deletedCount} scraped items.`);
  } else {
    console.log('\nℹ️  No scraped items related to Sarkari Result to delete.');
  }

  console.log('\n✅ Database cleanup complete!');
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => {
  console.error('❌ Error during database cleanup:', err);
  process.exit(1);
});
