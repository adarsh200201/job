const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const slugify = require('slugify');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const Job = require('../models/Job');
const { connectDB } = require('../utils/db');

const isGarbageSlug = (slug) => {
  if (!slug) return true;
  
  const parts = slug.toLowerCase().split('-').filter(Boolean);
  if (parts.length === 0) return true;
  
  // If the last part is a hex hash (e.g. 5-6 characters, alphanumeric/hex), remove it
  if (parts.length > 1) {
    const last = parts[parts.length - 1];
    if (/^[0-9a-f]{5,6}$/i.test(last)) {
      parts.pop();
    }
  }
  
  // Junk words list
  const junkWords = new Set([
    'and', 'or', 'the', 'in', 'to', 'for', 'a', 'an', 'at', 'by', 'of', 'on', 'with', 'if', 'now', 'apply', 'test', 'scrape', 'mock'
  ]);
  
  // Check if all remaining parts are junk words or pure numbers
  const allJunk = parts.every(p => junkWords.has(p) || /^\d+$/.test(p));
  if (allJunk) return true;
  
  // Check if any word contains suspicious scraper traces like website names
  const garbagePatterns = /foundthejob|govtjobsalert|http|https|www/i;
  if (parts.some(p => garbagePatterns.test(p))) return true;

  // Reject test/scrape keywords
  if (parts.some(p => p.includes('test') || p.includes('scrape') || p.includes('mock'))) {
    return true;
  }
  
  return false;
};

const normalizeTitle = (title) => {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const normalizeCompany = (company) => {
  if (!company) return '';
  return company
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const normalizeUrl = (url) => {
  if (!url) return '';
  let clean = url.trim().toLowerCase();
  clean = clean.replace(/^https?:\/\//i, '');
  clean = clean.replace(/^www\./i, '');
  if (clean.endsWith('/')) {
    clean = clean.slice(0, -1);
  }
  return clean;
};

const cleanCompany = (company) => {
  if (!company) return '';
  let clean = company.trim();
  clean = clean.replace(/^company\s*(?:name)?\s*[:\-–—]\s*/i, '');
  clean = clean.replace(/^company\s*(?:name)?\s+/i, '');
  clean = clean.replace(/\s*(?:mass\s*)?hiring\s*drive\s*/i, '');
  clean = clean.replace(/\s*(?:mass\s*)?hiring\s*/i, '');
  clean = clean.replace(/\s*recruitment\s*drive\s*/i, '');
  clean = clean.replace(/\s*recruitment\s*/i, '');
  clean = clean.replace(/\s*careers\s*/i, '');
  clean = clean.replace(/\s*jobs\s*/i, '');
  return clean.trim();
};

const cleanScrapedTitle = (title) => {
  if (!title) return '';
  let clean = title.trim();
  clean = clean.replace(/^company\s*(?:name)?\s*[:\-–—]\s*/i, '');
  clean = clean.replace(/^company\s*(?:name)?\s+/i, '');
  return clean;
};

const extractRoleFromDescription = (description) => {
  if (!description) return '';
  const text = description.replace(/<[^>]*>/g, '\n');
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  
  const patterns = [
    /^(?:job\s*)?role\s*s?\s*[:\-–—\s]+\s*(.+)$/i,
    /^(?:job\s*)?profile\s*s?\s*[:\-–—\s]+\s*(.+)$/i,
    /^(?:job\s*)?designation\s*s?\s*[:\-–—\s]+\s*(.+)$/i,
    /^(?:job\s*)?position\s*s?\s*[:\-–—\s]+\s*(.+)$/i,
    /^(?:job\s*)?title\s*s?\s*[:\-–—\s]+\s*(.+)$/i,
    /^(?:post\s*)?name\s*s?\s*[:\-–—\s]+\s*(.+)$/i
  ];

  for (const line of lines) {
    for (const regex of patterns) {
      const match = line.match(regex);
      if (match) {
        let role = match[1].trim();
        role = role.replace(/<[^>]*>/g, '').replace(/https?:\/\/\S+/gi, '').trim();
        role = role.replace(/^(?:a|an|the)\s+/i, '');
        if (role.length > 3 && role.length < 80 && !/http|www|apply/i.test(role)) {
          return role;
        }
      }
    }
  }
  return '';
};

const enrichThinDescription = (description, title, company, location, salary, experience, batch, role) => {
  if (!description) return '';
  const cleanText = description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = cleanText.split(' ').length;
  if (wordCount > 150) {
    return description;
  }
  
  const enrichedSection = `
<div class="enriched-job-content mt-4" style="border-top: 1px dashed #e2e8f0; padding-top: 1.5rem;">
  <h3 style="font-size: 1.25rem; font-weight: 700; color: #1e293b; margin-bottom: 0.75rem;">About the ${company} Recruitment Drive</h3>
  <p style="color: #475569; line-height: 1.6; margin-bottom: 1rem;">Apply for the latest ${role || title} position at ${company}. This role offers a fantastic opportunity to build a career in ${location || 'India'} at a leading organization. Qualified candidates matching the criteria below are encouraged to apply online immediately.</p>
  
  <h3 style="font-size: 1.25rem; font-weight: 700; color: #1e293b; margin-bottom: 0.75rem; margin-top: 1.5rem;">Role Overview & Eligibility Criteria</h3>
  <ul style="color: #475569; line-height: 1.6; margin-bottom: 1rem; padding-left: 1.25rem;">
    <li><strong>Hiring Company:</strong> ${company}</li>
    <li><strong>Job Profile:</strong> ${role || title}</li>
    <li><strong>Location:</strong> ${location || 'Pan India / Remote'}</li>
    <li><strong>Salary Package:</strong> ${salary || 'Best in Industry'}</li>
    <li><strong>Experience Required:</strong> ${experience || 'Freshers & Experienced Candidates'}</li>
    <li><strong>Eligible Batches:</strong> ${batch || '2026, 2025, 2024, 2023 graduates'}</li>
  </ul>

  <h3 style="font-size: 1.25rem; font-weight: 700; color: #1e293b; margin-bottom: 0.75rem; margin-top: 1.5rem;">Selection Process & How to Apply</h3>
  <p style="color: #475569; line-height: 1.6; margin-bottom: 1rem;">The selection process at ${company} generally consists of an initial online assessment, technical screening rounds, and a final HR evaluation. To submit your application, click the official apply link on this page, register with your updated details, and upload your resume.</p>
  
  <h3 style="font-size: 1.25rem; font-weight: 700; color: #1e293b; margin-bottom: 0.75rem; margin-top: 1.5rem;">Frequently Asked Questions (FAQ)</h3>
  <div style="margin-bottom: 1rem;">
    <strong style="color: #1e293b; display: block; margin-bottom: 0.25rem;">Q1: What is the last date to apply?</strong>
    <p style="color: #475569; line-height: 1.6; margin: 0;">A: The application window is open for a limited period. Candidates should submit their applications as early as possible before the link is closed by the company.</p>
  </div>
  <div>
    <strong style="color: #1e293b; display: block; margin-bottom: 0.25rem;">Q2: Does this job allow remote work?</strong>
    <p style="color: #475569; line-height: 1.6; margin: 0;">A: Please verify the job type specification on this page. Remote roles allow working from home, whereas hybrid/on-site roles require office attendance.</p>
  </div>
</div>
  `;
  return description + enrichedSection;
};

const sanitizeTextForCompetitors = (text) => {
  if (!text || typeof text !== 'string') return text;
  
  const competitorPattern = /https?:\/\/(?:(?:[^\s<"'>]*\.)?(?:pdlink\.in|bit\.ly|tinyurl\.com|ow\.ly|goo\.gl|short\.ly|rebrand\.ly|cutt\.ly|t\.co|buff\.ly|dlvr\.it|internshala\.com|internshals\.com|naukri\.com|shine\.com|monster\.com|timesjobs\.com|freshersworld\.com|placementindia\.com|govtjobsalert\.in|sarkariresult\.com|rojgarresult\.com|freejobalert\.com|freshershunt\.in|fresherslive\.com|freshersvoice\.com|offcampusjobs4u\.in|youth4work\.com|ambitionbox\.com|glassdoor\.com|glassdoor\.co\.in|indeed\.com|indeed\.co\.in|foundthejob\.com|internships\.com|internshipss\.com|offcampusjobs4u\.com|placementkit\.in|placementkit\.com|walkindrive\.com|fresherearth\.com|fresherearth\.in))[^\s<"'>]*/gi;

  let val = text;
  
  // 0. Remove button and icon tags entirely (e.g. LinkedIn public job details scraper remnants)
  val = val.replace(/<button[^>]*>[\s\S]*?<\/button>/gi, '');
  val = val.replace(/<icon[^>]*>[\s\S]*?<\/icon>/gi, '');
  
  // 1. Remove competitor/shortlink URLs
  val = val.replace(competitorPattern, '');
  
  // 2. Remove leftover empty anchor tags
  val = val.replace(/<a\b[^>]*>\s*<\/a>/gi, '');
  
  // 3. Clean up dangling labels inside HTML tags
  const danglingPatterns = [
    /<(strong|b|p|li|span)\b[^>]*>\s*(?:visit\s+the\s+full\s+details\s+and\s+application\s+page|apply\s*(?:now|online|link)?|registration\s*(?:link)?|click\s*here\s*to\s*apply|official\s*link|apply\s*here|link|join\s*here|job\s*link|careers?\s*link)\s*[:\-\–\—\s]*\s*<\/\1>/gi
  ];
  for (const pattern of danglingPatterns) {
    val = val.replace(pattern, '');
  }
  
  // 4. Clean up empty tags (repeat to handle nesting)
  for (let i = 0; i < 3; i++) {
    val = val.replace(/<(p|li|strong|b|span|div)\b[^>]*>\s*<\/\1>/gi, '');
  }
  
  // 5. Clean dangling prefixes in plain text followed by a dot, number, or end of string
  val = val.replace(/\b(?:visit\s+the\s+full\s+details\s+and\s+application\s+page|apply\s*(?:now|online|link)?|registration\s*(?:link)?|click\s*here\s*to\s*apply|official\s*link|apply\s*here|link|join\s*here|job\s*link|careers?\s*link)\s*[:\-\–\—\s]*\s*(?=\d|\.|$)/gi, '');
  
  // 6. Remove excess spacing
  val = val.replace(/\s{2,}/g, ' ');
  
  return val.trim();
};

const enrichJobTitleAndCompany = (rawTitle, rawCompany, jobDescription, isGov) => {
  const companyCleaned = cleanCompany(rawCompany);
  const titleCleaned = cleanScrapedTitle(rawTitle || '');

  if (!titleCleaned) {
    return {
      title: isGov ? `${companyCleaned} Recruitment 2026` : `${companyCleaned} Hiring Drive 2026`,
      company: companyCleaned,
      role: ''
    };
  }

  const titleCleanedLower = titleCleaned.toLowerCase();
  const companyCleanedLower = companyCleaned.toLowerCase();
  const titleWithoutCompanyAndJunk = titleCleanedLower
    .replace(companyCleanedLower, '')
    .replace(/\b(?:mass\s*)?hiring\b/g, '')
    .replace(/\b(?:recruitment|drive|jobs|careers|job|posts|post|vacancies|vacancy)\b/g, '')
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  const isGeneric = titleWithoutCompanyAndJunk.length === 0 || titleWithoutCompanyAndJunk.split(/\s+/).length <= 1;
  const titleWords = titleCleaned.trim().split(/\s+/).filter(Boolean);
  const isTitleThin = isGeneric || titleWords.length <= 2 || titleCleanedLower === companyCleanedLower;
  
  let roleFromDesc = '';
  if (isTitleThin) {
    roleFromDesc = extractRoleFromDescription(jobDescription || '');
  }

  let finalTitle = titleCleaned;
  if (roleFromDesc) {
    finalTitle = `${companyCleaned} ${roleFromDesc} Hiring 2026`;
  } else {
    const finalWords = finalTitle.trim().split(/\s+/).filter(Boolean);
    const hasContextWord = /hiring|recruitment|program|career|job|drive|internship|apprentice|scholarship|admit|result/i.test(finalTitle);
    
    if (finalWords.length <= 3 || finalTitle.length < 25 || !hasContextWord) {
      if (isGov) {
        if (companyCleaned && !finalTitle.toLowerCase().includes(companyCleaned.toLowerCase())) {
          finalTitle = `${companyCleaned} ${finalTitle} Recruitment 2026`;
        } else if (!finalTitle.toLowerCase().includes('recruitment')) {
          finalTitle = `${finalTitle} Recruitment 2026`;
        }
      } else {
        if (companyCleaned && !finalTitle.toLowerCase().includes(companyCleaned.toLowerCase())) {
          if (/apprentice/i.test(finalTitle)) {
            finalTitle = `${companyCleaned} ${finalTitle} Program 2026`;
          } else {
            finalTitle = `${companyCleaned} ${finalTitle} Hiring 2026`;
          }
        } else {
          if (/apprentice/i.test(finalTitle)) {
            finalTitle = `${finalTitle} Program 2026`;
          } else if (!hasContextWord) {
            finalTitle = `${finalTitle} Hiring 2026`;
          }
        }
      }
    }
  }

  finalTitle = finalTitle.replace(/\s+/g, ' ').trim();
  
  if (companyCleaned && companyCleaned.length > 2) {
    const escapedCompany = companyCleaned.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const doubleCompanyRegex = new RegExp(`^(${escapedCompany})\\s+\\1\\b`, 'i');
    finalTitle = finalTitle.replace(doubleCompanyRegex, '$1');
  }

  return {
    title: finalTitle,
    company: companyCleaned,
    role: roleFromDesc
  };
};

const isDuplicateTitleAndCompany = (t1, c1, t2, c2) => {
  const nt1 = normalizeTitle(t1);
  const nt2 = normalizeTitle(t2);
  const nc1 = normalizeCompany(c1);
  const nc2 = normalizeCompany(c2);
  
  if (nt1 === nt2) {
    if (nc1 === nc2 || nc1.includes(nc2) || nc2.includes(nc1)) {
      return true;
    }
    const words1 = nc1.split(' ');
    const words2 = nc2.split(' ');
    const commonWords = words1.filter(w => words2.includes(w) && w.length > 2);
    if (commonWords.length > 0) return true;
  }
  
  if (nt1.length >= 15 && nt2.length >= 15) {
    if (nt1.includes(nt2) || nt2.includes(nt1)) {
      if (nc1 === nc2 || nc1.includes(nc2) || nc2.includes(nc1)) {
        return true;
      }
    }
  }

  const wordsT1 = nt1.split(' ').filter(w => w.length > 1);
  const wordsT2 = nt2.split(' ').filter(w => w.length > 1);
  if (wordsT1.length >= 4 && wordsT2.length >= 4) {
    const first4_1 = wordsT1.slice(0, 4).join(' ');
    const first4_2 = wordsT2.slice(0, 4).join(' ');
    if (first4_1 === first4_2) {
      if (nc1 === nc2 || nc1.includes(nc2) || nc2.includes(nc1)) {
        return true;
      }
    }
  }
  
  return false;
};

async function cleanDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await connectDB();
    console.log('✓ Connected successfully.');

    console.log('🔍 Fetching all jobs from database...');
    const allJobs = await Job.find({});
    console.log(`✓ Fetched ${allJobs.length} total jobs.`);

    const jobsToDelete = new Set();
    const garbageJobs = [];
    
    // Group and detect duplicates using double loop over all jobs
    for (let i = 0; i < allJobs.length; i++) {
      const job1 = allJobs[i];
      const id1 = job1._id.toString();
      if (jobsToDelete.has(id1)) continue;
      
      // 1. Identify garbage slugs
      if (isGarbageSlug(job1.slug)) {
        garbageJobs.push(job1);
        jobsToDelete.add(id1);
        continue;
      }

      for (let j = i + 1; j < allJobs.length; j++) {
        const job2 = allJobs[j];
        const id2 = job2._id.toString();
        if (jobsToDelete.has(id2)) continue;
        
        let isDup = false;
        
        // Compare by sourceUrl
        if (job1.sourceUrl && job2.sourceUrl && job1.sourceUrl !== 'undefined' && job2.sourceUrl !== 'undefined') {
          if (normalizeUrl(job1.sourceUrl) === normalizeUrl(job2.sourceUrl)) {
            isDup = true;
          }
        }
        
        // Compare by advanced Title + Company matching
        if (!isDup) {
          if (isDuplicateTitleAndCompany(job1.title, job1.company, job2.title, job2.company)) {
            isDup = true;
          }
        }
        
        if (isDup) {
          // Keep the latest one, delete the older one
          if (new Date(job1.createdAt) >= new Date(job2.createdAt)) {
            jobsToDelete.add(id2);
          } else {
            jobsToDelete.add(id1);
            break; // job1 is marked for deletion, stop comparing it
          }
        }
      }
    }

    console.log(`\n🧹 Analyzing duplicates...`);
    console.log(`- Marked ${jobsToDelete.size - garbageJobs.length} duplicate jobs for deletion.`);
    console.log(`- Found ${garbageJobs.length} garbage slug jobs.`);

    const totalToDelete = jobsToDelete.size;
    console.log(`\n🚨 Total unique jobs marked for deletion: ${totalToDelete}`);

    if (totalToDelete > 0) {
      const idsArray = Array.from(jobsToDelete).map(id => new mongoose.Types.ObjectId(id));
      
      // Print sample of items being deleted
      console.log('\n📋 Sample of jobs being deleted:');
      const sampleJobs = allJobs.filter(j => jobsToDelete.has(j._id.toString())).slice(0, 10);
      sampleJobs.forEach(j => {
        console.log(`  - Title: "${j.title}" | Company: "${j.company}" | Slug: "${j.slug}" | Created: ${j.createdAt}`);
      });

      console.log('\n🧹 Deleting jobs from MongoDB...');
      const deleteResult = await Job.deleteMany({ _id: { $in: idsArray } });
      console.log(`✓ Successfully deleted ${deleteResult.deletedCount} jobs from the database.`);
    } else {
      console.log('\n✓ No jobs deleted.');
    }

    // Proactively clean and enrich remaining valid jobs
    console.log('\n✨ Enriching and upgrading remaining jobs...');
    let enrichedCount = 0;

    const generateUniqueSlugForCleanDb = async (title, excludeJobId) => {
      let slugBase = slugify(title, { lower: true, strict: true, trim: true });
      if (!slugBase) slugBase = 'job';
      let slug = slugBase;
      let counter = 1;
      while (true) {
        const collision = await Job.findOne({ slug, _id: { $ne: excludeJobId } });
        if (!collision) break;
        slug = `${slugBase}-${counter}`;
        counter++;
      }
      return slug;
    };

    for (const job of allJobs) {
      const idStr = job._id.toString();
      if (jobsToDelete.has(idStr)) continue;
      
      let changed = false;
      const updateFields = {};
      
      const { title: cleanTitle, company: companyCleaned, role: roleFromDesc } = enrichJobTitleAndCompany(job.title, job.company, job.jobDescription, job.isGovernment);
      
      if (companyCleaned !== job.company) {
        job.company = companyCleaned;
        updateFields.company = companyCleaned;
        changed = true;
      }
      
      if (cleanTitle !== job.title) {
        job.title = cleanTitle;
        job.slug = await generateUniqueSlugForCleanDb(cleanTitle, job._id);
        updateFields.title = cleanTitle;
        updateFields.slug = job.slug;
        changed = true;
      }
      
      const enrichedDesc = enrichThinDescription(
        job.jobDescription || '',
        job.title,
        job.company,
        job.location,
        job.salary,
        job.experience,
        job.batch,
        roleFromDesc
      );
      
      if (enrichedDesc !== job.jobDescription) {
        job.jobDescription = enrichedDesc;
        updateFields.jobDescription = enrichedDesc;
        changed = true;
      }
      
      // Sanitize all text fields for competitor URLs
      const textFields = ['jobDescription', 'howToApply', 'finalThoughts', 'whyJoin', 'aboutCompany', 'description', 'shortSummary'];
      textFields.forEach(field => {
        const originalVal = job[field];
        if (originalVal && typeof originalVal === 'string') {
          const cleanedVal = sanitizeTextForCompetitors(originalVal);
          if (cleanedVal !== originalVal) {
            job[field] = cleanedVal;
            updateFields[field] = cleanedVal;
            changed = true;
          }
        }
      });
      
      if (changed) {
        await Job.updateOne({ _id: job._id }, { $set: updateFields });
        enrichedCount++;
      }
    }
    console.log(`✓ Cleaned and enriched ${enrichedCount} active jobs in the database.`);

    console.log('\n🎉 Database cleanup finished successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error during cleanup:', error);
    process.exit(1);
  }
}

cleanDatabase();
