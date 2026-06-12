const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://ADARSHSHARMA__:SITADEVI%401234765__@cluster1.tcdmjd6.mongodb.net/job";

const JobSchema = new mongoose.Schema({
  title: String,
  company: String,
  postType: String,
  createdAt: Date,
  isActive: Boolean,
  isGovernment: Boolean
}, { strict: false });

const Job = mongoose.model('Job', JobSchema);

async function main() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB successfully!");
    
    const job = await Job.findOne({ title: /NALCO/i }).lean();
    console.log("sourceUrl:", job.sourceUrl);
    console.log("jobDescription snippet:");
    console.log(job.jobDescription ? job.jobDescription.substring(0, 1500) : "No description");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.disconnect();
  }
}

main();
