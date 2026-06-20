const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGO_URI;
const SeoIndexStatus = require('../models/SeoIndexStatus');

async function main() {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully!");
    
    const total = await SeoIndexStatus.countDocuments();
    const indexed = await SeoIndexStatus.countDocuments({ status: 'Indexed' });
    const pending = await SeoIndexStatus.countDocuments({ status: 'Pending' });
    const failed = await SeoIndexStatus.countDocuments({ status: 'Failed' });
    const notIndexed = await SeoIndexStatus.countDocuments({ status: 'Not Indexed' });
    
    console.log("Total Count:", total);
    console.log("Indexed:", indexed);
    console.log("Pending:", pending);
    console.log("Failed:", failed);
    console.log("Not Indexed:", notIndexed);
    
    const samples = await SeoIndexStatus.find().limit(5).lean();
    console.log("Sample documents:", samples);
    
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.disconnect();
  }
}

main();
