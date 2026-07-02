const QueueJob = require('../models/QueueJob');
const FailedQueueJob = require('../models/FailedQueueJob');
const SeenJob = require('../models/SeenJob');
const LinkedinGovtPost = require('../models/LinkedinGovtPost');
const Job = require('../models/Job');

// 1. Add job to queue
exports.addJob = async (req, res) => {
  try {
    const { jobData, jobHash, imagePath, isGovernment } = req.body;
    if (!jobHash || !jobData) {
      return res.status(400).json({ success: false, error: 'jobHash and jobData are required' });
    }

    // Calculate priority score (mirrors Python logic)
    let priority = 0;
    const jobText = JSON.stringify(jobData).toLowerCase();
    if (jobText.includes(' ssc') || jobText.includes(' upsc') || jobText.includes('army') || jobText.includes('bank')) {
      priority = 1;
    }

    // Find and update or insert (prevent duplicate hashes in queue)
    const existing = await QueueJob.findOne({ jobHash });
    if (existing) {
      return res.json({ success: true, message: 'Job already exists in queue', created: false });
    }

    await QueueJob.create({
      jobHash,
      jobData,
      imagePath: imagePath || '',
      isGovernment: !!isGovernment,
      priority,
      timestamp: Date.now() / 1000
    });

    res.json({ success: true, created: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 2. Atomically retrieve and delete up to `limit` jobs (aims for 80% private, 20% govt daily ratio)
exports.getJobsBatch = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || req.body.limit || 1, 10);
    const jobs = [];

    // Calculate how many jobs of each type have been posted today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const privateCount = await Job.countDocuments({ isGovernment: false, createdAt: { $gte: startOfDay } });
    const govtCount = await Job.countDocuments({ isGovernment: true, createdAt: { $gte: startOfDay } });
    const totalToday = privateCount + govtCount;

    // We target 20% government jobs daily.
    // If we have posted today, and the current government ratio is less than 20%, we prefer a government job.
    let preferGovernment = false;
    if (totalToday > 0) {
      const currentGovtRatio = govtCount / totalToday;
      if (currentGovtRatio < 0.20) {
        preferGovernment = true;
      }
    }

    for (let i = 0; i < limit; i++) {
      let job = null;

      if (preferGovernment) {
        // Try to fetch government job first
        job = await QueueJob.findOneAndDelete(
          { isGovernment: true },
          { sort: { priority: -1, timestamp: 1 } }
        );
        // Fallback to private job if no govt jobs are in queue
        if (!job) {
          job = await QueueJob.findOneAndDelete(
            { isGovernment: false },
            { sort: { priority: -1, timestamp: 1 } }
          );
        }
      } else {
        // Try to fetch private job first
        job = await QueueJob.findOneAndDelete(
          { isGovernment: false },
          { sort: { priority: -1, timestamp: 1 } }
        );
        // Fallback to government job if no private jobs are in queue
        if (!job) {
          job = await QueueJob.findOneAndDelete(
            { isGovernment: true },
            { sort: { priority: -1, timestamp: 1 } }
          );
        }
      }

      if (job) {
        jobs.push({
          id: job._id,
          job_hash: job.jobHash,
          job_data: JSON.stringify(job.jobData),
          image_path: job.imagePath,
          is_government: job.isGovernment ? 1 : 0,
          timestamp: job.timestamp,
          retries: job.retries
        });
        
        // Dynamically toggle preference for the next item in the batch (if limit > 1)
        if (job.isGovernment) {
          preferGovernment = false;
        } else {
          const tempTotal = totalToday + jobs.length;
          const tempGovtCount = govtCount + jobs.filter(j => j.is_government).length;
          preferGovernment = (tempGovtCount / tempTotal) < 0.20;
        }
      } else {
        break; // Queue is fully empty
      }
    }

    res.json({ success: true, data: jobs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 3. Return a job to the queue (increment retries)
exports.returnJobToQueue = async (req, res) => {
  try {
    const { jobHash, jobData, imagePath, isGovernment, retries } = req.body;
    if (!jobHash || !jobData) {
      return res.status(400).json({ success: false, error: 'jobHash and jobData are required' });
    }

    await QueueJob.findOneAndUpdate(
      { jobHash },
      {
        jobHash,
        jobData,
        imagePath: imagePath || '',
        isGovernment: !!isGovernment,
        retries: (retries || 0) + 1,
        timestamp: Date.now() / 1000
      },
      { upsert: true, new: true }
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 4. Add job to failed jobs queue
exports.addToFailedQueue = async (req, res) => {
  try {
    const { jobHash, jobData, errorMessage } = req.body;
    if (!jobHash || !jobData) {
      return res.status(400).json({ success: false, error: 'jobHash and jobData are required' });
    }

    await FailedQueueJob.create({
      jobHash,
      jobData,
      errorMessage: errorMessage || '',
      timestamp: Date.now() / 1000
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 5. Get current queue size
exports.getQueueSize = async (req, res) => {
  try {
    const size = await QueueJob.countDocuments();
    res.json({ success: true, size });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 6. Get queue breakdown by source
exports.getQueueBreakdown = async (req, res) => {
  try {
    const jobs = await QueueJob.find({}, 'jobData isGovernment');
    const breakdown = {};

    for (const job of jobs) {
      const data = job.jobData || {};
      const isGovt = job.isGovernment;
      let source = data.sourceWebsite || data.sourceUrl || '';
      
      if (!source) {
        source = data.telegramChannel || (isGovt ? 'Government Job' : 'Private Job');
      }

      const sourceLower = String(source).toLowerCase();
      if (sourceLower.includes('linkedin')) {
        source = 'LinkedIn';
      } else if (sourceLower.includes('telegram') || source.startsWith('@') || sourceLower.includes('t.me')) {
        source = 'Telegram';
      } else if (sourceLower.includes('weworkremotely')) {
        source = 'WeWorkRemotely';
      } else if (sourceLower.includes('internshala')) {
        source = 'Internshala';
      } else if (sourceLower.includes('freshersworld')) {
        source = 'Freshersworld';
      } else if (sourceLower.includes('adzuna')) {
        source = 'Adzuna';
      } else if (sourceLower.includes('govtjobsalert') || sourceLower.includes('govt')) {
        source = 'GovtJobsAlert';
      } else if (isGovt) {
        source = 'Government Scrapers';
      } else {
        source = 'Other Private';
      }

      breakdown[source] = (breakdown[source] || 0) + 1;
    }

    res.json({ success: true, data: breakdown });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 7. Get all seen job hashes
exports.getAllSeenHashes = async (req, res) => {
  try {
    const docs = await SeenJob.find({}, 'jobHash');
    const hashes = docs.map(d => d.jobHash);
    res.json({ success: true, data: hashes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 8. Check if a job hash has been seen
exports.isJobSeen = async (req, res) => {
  try {
    const { hash } = req.params;
    const exists = await SeenJob.exists({ jobHash: hash });
    res.json({ success: true, seen: !!exists });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 9. Mark job hash as seen
exports.markJobSeen = async (req, res) => {
  try {
    const { jobHash } = req.body;
    if (!jobHash) {
      return res.status(400).json({ success: false, error: 'jobHash is required' });
    }

    await SeenJob.findOneAndUpdate(
      { jobHash },
      { jobHash, timestamp: Date.now() / 1000 },
      { upsert: true, new: true }
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 10. Count LinkedIn government posts in the last 24 hours
exports.countLinkedinGovtPosts = async (req, res) => {
  try {
    const oneDayAgo = (Date.now() / 1000) - 86400;
    const count = await LinkedinGovtPost.countDocuments({ timestamp: { $gte: oneDayAgo } });
    res.json({ success: true, count });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 11. Log a new LinkedIn government post
exports.logLinkedinGovtPost = async (req, res) => {
  try {
    await LinkedinGovtPost.create({ timestamp: Date.now() / 1000 });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
