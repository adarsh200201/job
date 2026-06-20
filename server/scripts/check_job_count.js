const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGO_URI;
const Job = require('../models/Job');
const SeoIndexStatus = require('../models/SeoIndexStatus');

async function main() {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully!");
    
    const jobCount = await Job.countDocuments();
    console.log("Total Jobs count in DB:", jobCount);
    
    const seoCount = await SeoIndexStatus.countDocuments();
    console.log("Total SeoIndexStatus count in DB:", seoCount);

    const SeoKeywordMetric = require('../models/SeoKeywordMetric');
    const keywordCount = await SeoKeywordMetric.countDocuments();
    console.log("Total SeoKeywordMetric count in DB:", keywordCount);
    
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.disconnect();
  }
}

main();
