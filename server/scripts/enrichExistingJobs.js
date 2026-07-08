/**
 * enrichExistingJobs.js
 * Script to retroactively enrich existing jobs in the database with rich career guide content.
 * Processes jobs in batches to avoid API rate limits.
 */
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from workspace root .env
dotenv.config({ path: path.join(__dirname, '../../.env') });

const Job = require('../models/Job');

const axios = require('axios');

const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('❌ Error: API_KEY is missing in environment variables.');
  process.exit(1);
}

async function connectDb() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/nextjobpost';
  console.log(`Connecting to MongoDB at: ${mongoUri.replace(/:([^@]+)@/, ':***@')}`);
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log('✅ Connected to MongoDB');
}

async function generateRichContentForJob(job) {
  const year = new Date().getFullYear();
  const jobCategory = job.isGovernment ? 'Government / Public Sector' : 'Private Sector / IT';
  const skillsStr = (job.skills && job.skills.length > 0) ? job.skills.join(', ') : 'General aptitude';

  const prompt = `You are a senior career counsellor and content editor at NextJobPost.in — India's trusted job notification platform.

Your task: Write ORIGINAL, EXPERT-LEVEL career guide content for this job listing. This is NOT a summary or rewrite of the notification. You are writing independent editorial content that helps Indian job seekers understand whether to apply, how to prepare, and what to expect.

Job Details (use as data source only, do not copy verbatim):
- Title: ${job.title}
- Employer / Company: ${job.company}
- Job Category: ${jobCategory}
- Location: ${job.location || 'Pan India'}
- Education Required: ${job.education || 'Graduate'}
- Experience Required: ${job.experience || 'Freshers welcome'}
- Skills Required: ${skillsStr}
- Total Vacancies: ${job.vacancies || 'As per official notification'}
- Salary / Pay Scale: ${job.salary || 'As per government pay matrix'}
- Year: ${year}

Generate a JSON object with these EXACT keys:

1. "introduction": ORIGINAL 220-word editorial introduction. Cover: What is this role about? Who should apply? What makes this opportunity notable in ${year}? Why is ${job.company} a good employer? Write for a graduate looking to build their career. Do NOT copy the notification — write in your own editorial voice.

2. "whyApply": ORIGINAL 160-word analysis of "Is this job worth applying for?". Discuss: salary competitiveness vs. market rate, job security, work culture if known, career ceiling, work-life balance for this role type, who should prioritize this application. Be honest and balanced.

3. "companyAnalysis": ORIGINAL 150-word background section on ${job.company}. Cover: What does this organization do? Size, scope, government or private, notable achievements, why it's a respected employer in India.

4. "selectionProcess": ORIGINAL 200-word explanation of the selection process stages. Cover: typical stages (written exam, interview, document verification, medical), what each stage tests, qualifying marks, and how to approach each stage strategically.

5. "preparationTips": ORIGINAL 200-word preparation strategy. Cover: key subjects to study, recommended study books (with author names), daily study schedule suggestion, important topics that historically carry high marks, online resources.

6. "applicationSteps": ORIGINAL numbered step-by-step guide (7 steps) for how to apply.

7. "salaryBreakdown": ORIGINAL 120-word salary analysis. Break down: basic pay, Dearness Allowance (DA), House Rent Allowance (HRA), Transport Allowance, gross monthly take-home, and annual CTC estimate.

8. "commonMistakes": Array of exactly 5 strings. Each string is a specific, actionable mistake to avoid when applying.

9. "faqs": Array of exactly 6 objects with "q" and "a" keys. Q should be actual search queries. A should be 60-80 word expert answers.

IMPORTANT RULES:
- NEVER mention competitor websites (sarkariresult, freejobalert, etc.)
- NEVER copy text verbatim from the job notification
- Write in clear, helpful Indian English
- Return ONLY valid JSON, no markdown fences
`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json'
        }
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const text = response.data.candidates[0].content.parts[0].text;
    const result = JSON.parse(text.trim());
    return result;
  } catch (error) {
    console.error(`Error generating content for job ${job._id}:`, error.response ? error.response.data : error.message);
    return null;
  }
}


async function main() {
  await connectDb();

  // Find all active jobs that do not have custom aboutCompany or howToApply filled yet
  const jobs = await Job.find({
    isActive: true,
    $or: [
      { aboutCompany: { $exists: false } },
      { aboutCompany: '' },
      { howToApply: { $exists: false } },
      { howToApply: '' }
    ]
  });

  console.log(`🔍 Found ${jobs.length} jobs needing content enrichment.`);

  let successCount = 0;
  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];
    console.log(`[${i + 1}/${jobs.length}] Enriching: "${job.title}" at "${job.company}"...`);

    const rich = await generateRichContentForJob(job);
    if (rich) {
      // Map rich content keys to MongoDB schema fields
      let richIntro = rich.introduction || '';
      if (rich.whyApply) {
        richIntro += `\n\n<h3>Is This Job Worth Applying For?</h3>\n${rich.whyApply}`;
      }
      if (rich.selectionProcess) {
        richIntro += `\n\n<h3>Selection Process</h3>\n${rich.selectionProcess}`;
      }
      if (rich.preparationTips) {
        richIntro += `\n\n<h3>Preparation Strategy</h3>\n${rich.preparationTips}`;
      }
      if (rich.salaryBreakdown) {
        richIntro += `\n\n<h3>Salary Breakdown</h3>\n${rich.salaryBreakdown}`;
      }

      job.jobDescription = richIntro;
      job.aboutCompany = rich.companyAnalysis || '';
      job.howToApply = rich.applicationSteps || '';

      if (rich.commonMistakes && Array.isArray(rich.commonMistakes)) {
        job.finalThoughts = "Common mistakes to avoid:\n" + rich.commonMistakes.map((m, idx) => `${idx + 1}. ${m}`).join('\n');
      }

      if (rich.faqs && Array.isArray(rich.faqs)) {
        job.faqs = rich.faqs;
      }

      await job.save();
      console.log(`✅ Successfully enriched and updated job: "${job.title}"`);
      successCount++;

      // Wait 1.5 seconds between requests to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }

  console.log(`\n🎉 Enrichment complete! Successfully updated ${successCount}/${jobs.length} jobs.`);
  mongoose.disconnect();
}

main().catch(err => {
  console.error('Fatal error during enrichment:', err);
  mongoose.disconnect();
});
