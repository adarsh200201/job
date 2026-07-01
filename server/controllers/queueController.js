const QueueJob = require('../models/QueueJob');
const FailedQueueJob = require('../models/FailedQueueJob');
const SeenJob = require('../models/SeenJob');
const LinkedinGovtPost = require('../models/LinkedinGovtPost');

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

// 2. Atomically retrieve and delete up to `limit` jobs (prioritizes private jobs)
exports.getJobsBatch = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || req.body.limit || 1, 10);
    const jobs = [];

    // Atomically find and delete limit number of jobs using findOneAndDelete to prevent race conditions
    for (let i = 0; i < limit; i++) {
      // 1. Try to fetch private jobs first (isGovernment = false)
      let job = await QueueJob.findOneAndDelete(
        { isGovernment: false },
        { sort: { priority: -1, timestamp: 1 } }
      );
      
      // 2. If no private jobs, fetch government jobs
      if (!job) {
        job = await QueueJob.findOneAndDelete(
          { isGovernment: true },
          { sort: { priority: -1, timestamp: 1 } }
        );
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
