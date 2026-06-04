/**
 * Deep MongoDB Cleanup Script — clears scrapeditems, compacts indexes
 * Run: node server/scripts/deepCleanDB.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) { console.error('❌ MONGO_URI not found'); process.exit(1); }

async function main() {
  console.log('🔗 Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 15000 });
  console.log('✅ Connected!\n');

  const db = mongoose.connection.db;

  // ── 1. Get total DB stats BEFORE ──
  const statsBefore = await db.command({ dbStats: 1, scale: 1024 * 1024 });
  console.log(`📊 DB Size BEFORE: ${statsBefore.dataSize?.toFixed(2)} MB data | ${statsBefore.storageSize?.toFixed(2)} MB storage | ${statsBefore.indexSize?.toFixed(2)} MB indexes`);
  console.log(`   Total objects: ${statsBefore.objects}`);

  // ── 2. Purge ALL scrapeditems (cached scraper data — fully regenerable) ──
  try {
    const scrapeditems = db.collection('scrapeditems');
    const count = await scrapeditems.countDocuments();
    console.log(`\n🗑️  Clearing 'scrapeditems' (${count} cached records — safe to delete)...`);
    const r = await scrapeditems.deleteMany({});
    console.log(`   ✅ Deleted ${r.deletedCount} scrapeditems`);
  } catch (e) { console.log('   ℹ scrapeditems not found'); }

  // ── 3. Purge ALL results (empty anyway) ──
  try {
    const results = db.collection('results');
    const count = await results.countDocuments();
    if (count === 0) console.log('\n✅ results collection already empty');
    else {
      const r = await results.deleteMany({});
      console.log(`\n🗑️  Deleted ${r.deletedCount} from results`);
    }
  } catch { /* skip */ }

  // ── 4. Purge analytics (empty) ──
  try {
    const analytics = db.collection('analytics');
    const count = await analytics.countDocuments();
    if (count > 0) {
      const r = await analytics.deleteMany({});
      console.log(`\n🗑️  Deleted ${r.deletedCount} from analytics`);
    }
  } catch { /* skip */ }

  // ── 5. Purge all scraper logs ──
  try {
    const logs = db.collection('scraperlogs');
    const count = await logs.countDocuments();
    if (count > 0) {
      const r = await logs.deleteMany({});
      console.log(`\n🗑️  Deleted ${r.deletedCount} scraper logs`);
    }
  } catch { /* skip */ }

  // ── 6. Purge old users (keep only admins) ──
  try {
    const users = db.collection('users');
    const count = await users.countDocuments();
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days old inactive
    const oldUsers = await users.countDocuments({ createdAt: { $lt: cutoff } });
    if (oldUsers > 0) {
      const r = await users.deleteMany({ createdAt: { $lt: cutoff } });
      console.log(`\n🗑️  Deleted ${r.deletedCount} old inactive user accounts`);
    }
  } catch { /* skip */ }

  // ── 7. Run compact on all collections (reclaims wiredTiger storage) ──
  console.log('\n🔧 Running compact on all collections to reclaim storage...');
  const collections = await db.listCollections().toArray();
  for (const col of collections) {
    try {
      await db.command({ compact: col.name });
      console.log(`   ✅ Compacted: ${col.name}`);
    } catch (e) {
      // Atlas M0 free tier doesn't support compact — this is expected
      if (e.message?.includes('not allowed')) {
        console.log(`   ℹ️  ${col.name}: compact not allowed on free tier (normal)`);
        break;
      }
    }
  }

  // ── 8. Get total DB stats AFTER ──
  const statsAfter = await db.command({ dbStats: 1, scale: 1024 * 1024 });
  console.log(`\n📊 DB Size AFTER:  ${statsAfter.dataSize?.toFixed(2)} MB data | ${statsAfter.storageSize?.toFixed(2)} MB storage | ${statsAfter.indexSize?.toFixed(2)} MB indexes`);
  console.log(`   Total objects: ${statsAfter.objects}`);
  
  const saved = ((statsBefore.storageSize || 0) - (statsAfter.storageSize || 0)).toFixed(2);
  if (saved > 0) console.log(`\n💾 Freed approximately ${saved} MB of storage!`);

  // ── 9. List final state ──
  console.log('\n📁 Final collection state:');
  for (const col of collections) {
    try {
      const stats = await db.command({ collStats: col.name });
      console.log(`   ${col.name.padEnd(20)} docs: ${String(stats.count).padStart(5)}`);
    } catch { /* skip */ }
  }

  console.log('\n✅ Deep cleanup done!');
  console.log('📌 Next step: Go to MongoDB Atlas → Cluster → ... → Compact/Rebuild Indexes');
  console.log('   or wait a few minutes for Atlas to reclaim storage automatically.');
  
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
