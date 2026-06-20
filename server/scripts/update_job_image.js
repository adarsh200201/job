const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGO_URI;
const Job = require('../models/Job');

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error("Usage: node update_job_image.js <slug> <imageUrl>");
    process.exit(1);
  }

  const [slug, imageUrl] = args;

  if (!MONGO_URI) {
    console.error("❌ MONGO_URI not found in environment variables.");
    process.exit(1);
  }

  try {
    console.log(`Connecting to MongoDB to update image for slug: ${slug}...`);
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully!");

    const result = await Job.updateOne({ slug }, { $set: { image: imageUrl } });
    if (result.matchedCount > 0) {
      console.log(`✅ Success: Updated image URL to ${imageUrl} for job with slug: ${slug}`);
    } else {
      console.warn(`⚠️ Warning: No job found with slug: ${slug}`);
    }

  } catch (err) {
    console.error("❌ Error updating job image:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

main();
