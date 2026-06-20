const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from the workspace root .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI not found in environment variables.");
  process.exit(1);
}

const JobSchema = new mongoose.Schema({}, { strict: false, timestamps: false });
const Job = mongoose.model('Job', JobSchema);

async function main() {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB successfully!");
    
    // Find all active/featured jobs, sorted by title or current createdAt
    const jobs = await Job.find({}).sort({ createdAt: -1 });
    console.log(`Total jobs found in database: ${jobs.length}`);
    
    console.log("Staggering job timestamps by 30-minute intervals...");
    let updatedCount = 0;
    
    for (let i = 0; i < jobs.length; i++) {
      const job = jobs[i];
      // 30 minute stagger.
      // e.g. Job 0 is now, Job 1 is 30 mins ago, Job 287 is ~6 days ago (well within the 10 days TTL index limit).
      const newCreatedAt = new Date(Date.now() - i * 30 * 60 * 1000);
      
      await Job.updateOne(
        { _id: job._id },
        { $set: { createdAt: newCreatedAt, updatedAt: newCreatedAt } }
      );
      
      if ((i + 1) % 50 === 0 || i === jobs.length - 1) {
        console.log(`Updated ${i + 1}/${jobs.length} jobs...`);
      }
      updatedCount++;
    }
    
    console.log(`✅ Success! Staggered timestamps for all ${updatedCount} jobs in the database.`);
  } catch (err) {
    console.error("Error updating database:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Database disconnected.");
  }
}

main();
