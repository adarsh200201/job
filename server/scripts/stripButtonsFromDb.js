const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const Job = require('../models/Job');
const { connectDB } = require('../utils/db');

const stripButtons = (text) => {
  if (!text || typeof text !== 'string') return text;
  return text
    .replace(/<button[\s\S]*?<\/button>/gi, '')
    .replace(/<icon[\s\S]*?<\/icon>/gi, '')
    .replace(/https?:\/\/[^\s<"'>)]+/gi, '')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
};

async function run() {
  await connectDB();
  const jobs = await Job.find({}).lean();
  console.log('Loaded', jobs.length, 'jobs');

  const fields = ['jobDescription', 'howToApply', 'finalThoughts', 'whyJoin', 'aboutCompany', 'description', 'shortSummary'];
  let fixedJobs = 0;
  let fixedFields = 0;

  for (const job of jobs) {
    const updates = {};
    for (const f of fields) {
      if (!job[f]) continue;
      const cleaned = stripButtons(job[f]);
      if (cleaned !== job[f]) {
        updates[f] = cleaned;
        fixedFields++;
      }
    }
    if (Object.keys(updates).length > 0) {
      await Job.updateOne({ _id: job._id }, { $set: updates });
      fixedJobs++;
    }
  }

  console.log('Done! Fixed', fixedJobs, 'jobs across', fixedFields, 'fields');
  process.exit(0);
}

run().catch(function(e) { console.error(e.message); process.exit(1); });
