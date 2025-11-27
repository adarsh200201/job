const Job = require('../models/Job');

function buildFilters(query) {
  const filters = {};
  if (query.q) {
    const regex = new RegExp(query.q, 'i');
    filters.$or = [
      { title: regex },
      { company: regex },
      { location: regex },
      { description: regex },
    ];
  }
  if (query.location) filters.location = new RegExp(`^${query.location}$`, 'i');
  if (query.type) filters.type = query.type;
  return filters;
}

exports.getJobs = async (req, res) => {
  try {
    const filters = buildFilters(req.query);
    const jobs = await Job.find(filters).sort({ createdAt: -1 }).lean();
    res.json(jobs);
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch jobs' });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).lean();
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (e) {
    res.status(400).json({ message: 'Invalid job id' });
  }
};

exports.createJob = async (req, res) => {
  try {
    const { title, company, location, type, experience, description, applyLink, image, whatsapp, telegram, contact } = req.body;
    if (!title || !company || !location || !type || !experience || !description || !applyLink) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const job = await Job.create({ title, company, location, type, experience, description, applyLink, image, whatsapp, telegram, contact });
    res.status(201).json(job);
  } catch (e) {
    res.status(400).json({ message: 'Failed to create job' });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const updates = req.body;
    const job = await Job.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (e) {
    res.status(400).json({ message: 'Failed to update job' });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ message: 'Job deleted' });
  } catch (e) {
    res.status(400).json({ message: 'Failed to delete job' });
  }
};
