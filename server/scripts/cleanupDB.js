/**
 * MongoDB Cleanup Script
 * ─────────────────────────────────────────────────────────────
 * Frees up Atlas storage by deleting old job records.
 * Run: node server/scripts/cleanupDB.js
 * ─────────────────────────────────────────────────────────────
 */

require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI not found in .env');
  process.exit(1);
}

// ── How many days old to keep (delete older than this) ──
const KEEP_DAYS = 5; // keep only last 5 days of jobs

async function main() {
  console.log('🔗 Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 15000 });
  console.log('✅ Connected!\n');

  const db = mongoose.connection.db;

  // ── 1. List all collections and their sizes ──
  console.log('📊 Collection sizes:');
  const collections = await db.listCollections().toArray();
  for (const col of collections) {
    const stats = await db.command({ collStats: col.name });
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    const storageMB = (stats.storageSize / (1024 * 1024)).toFixed(2);
    const count = stats.count;
    console.log(`  📁 ${col.name.padEnd(20)} docs: ${String(count).padStart(6)}  data: ${sizeMB.padStart(7)} MB  storage: ${storageMB.padStart(7)} MB`);
  }

  // ── 2. Delete old jobs ──
  const Job = mongoose.model('Job', new mongoose.Schema({}, { strict: false }), 'jobs');
  const cutoff = new Date(Date.now() - KEEP_DAYS * 24 * 60 * 60 * 1000);
  console.log(`\n🗑️  Deleting jobs older than ${KEEP_DAYS} days (before ${cutoff.toLocaleDateString('en-IN')})...`);

  const totalJobs = await Job.countDocuments();
  const toDelete = await Job.countDocuments({ createdAt: { $lt: cutoff } });

  console.log(`   Total jobs: ${totalJobs}`);
  console.log(`   Jobs to delete: ${toDelete}`);
  console.log(`   Jobs to keep: ${totalJobs - toDelete}`);

  if (toDelete === 0) {
    console.log('   ℹ️  No old jobs to delete.');
  } else {
    const result = await Job.deleteMany({ createdAt: { $lt: cutoff } });
    console.log(`   ✅ Deleted ${result.deletedCount} old jobs!`);
  }

  // ── 3. Also compact/check scraper logs if they exist ──
  const logCollections = ['scraperlogs', 'scraper_logs', 'logs'];
  for (const colName of logCollections) {
    try {
      const col = db.collection(colName);
      const count = await col.countDocuments();
      if (count > 0) {
        console.log(`\n🗑️  Found ${count} records in '${colName}' — deleting all logs older than 3 days...`);
        const logCutoff = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
        const res = await col.deleteMany({ createdAt: { $lt: logCutoff } });
        console.log(`   ✅ Deleted ${res.deletedCount} old log records`);
      }
    } catch { /* collection doesn't exist */ }
  }

  // ── 4. Also purge sessions if they exist ──
  const sessionCollections = ['sessions', 'session'];
  for (const colName of sessionCollections) {
    try {
      const col = db.collection(colName);
      const count = await col.countDocuments();
      if (count > 0) {
        console.log(`\n🗑️  Deleting all ${count} expired sessions from '${colName}'...`);
        const res = await col.deleteMany({});
        console.log(`   ✅ Deleted ${res.deletedCount} sessions`);
      }
    } catch { /* collection doesn't exist */ }
  }

  // ── 5. Print updated stats ──
  console.log('\n📊 Updated collection sizes after cleanup:');
  for (const col of collections) {
    try {
      const stats = await db.command({ collStats: col.name });
      const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      const count = stats.count;
      console.log(`  📁 ${col.name.padEnd(20)} docs: ${String(count).padStart(6)}  data: ${sizeMB.padStart(7)} MB`);
    } catch { /* skip */ }
  }

  console.log('\n✅ Cleanup complete! MongoDB Atlas writes should be unblocked now.');
  console.log('⚠️  Note: Atlas storage reclaims space gradually. If still blocked after 5 min, run again or compact via Atlas UI.');
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
