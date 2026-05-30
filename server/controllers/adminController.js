const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const slugify = require('slugify');
const Admin = require('../models/Admin');
const Job = require('../models/Job');

exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Username and password required' });
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: admin._id.toString(), username: admin.username, role: 'admin' },
      process.env.JWT_SECRET || 'dev_secret_change_me',
      { expiresIn: '7d' }
    );
    res.json({ token, username: admin.username });
  } catch (e) {
    res.status(500).json({ message: 'Login failed' });
  }
};

// Seed sample jobs via admin action (protected route)
exports.seedJobs = async (req, res) => {
  try {
    const sample = [
      {
        title: 'Campus Hiring - Trainee Engineer',
        company: 'Tech Innovators',
        location: 'Bengaluru',
        type: 'Full-Time',
        experience: '0-1 years',
        education: 'B.Tech/B.E (CSE/IT)',
        batch: '2024-2025 Batch',
        jobDescription: 'A campus hiring opportunity for fresh graduates to join our engineering team as trainees. You will work on exciting projects and learn from experienced professionals.',
        description: 'Campus hiring opportunity for fresh graduates to join our engineering team as trainees.',
        applyLink: 'https://example.com/apply/tech-innovators',
        responsibilities: ['Work on assigned projects', 'Learn best practices', 'Collaborate with team'],
        requirements: ['B.Tech (CSE/IT)', 'Good communication', 'Problem-solving skills'],
        skills: ['JavaScript', 'Problem Solving'],
      },
      {
        title: 'Graduate Software Engineer',
        company: 'NextGen Soft',
        location: 'Hyderabad',
        type: 'Full-Time',
        experience: '0-1 years',
        education: 'B.Tech/B.E (CSE/IT)',
        batch: '2024 Batch',
        jobDescription: 'Join NextGen Soft as a graduate software engineer working on backend services and APIs. We offer mentorship and career growth opportunities.',
        description: 'Graduate software engineer position working on backend services.',
        applyLink: 'https://example.com/apply/nextgen',
        responsibilities: ['Develop backend services', 'Write unit tests', 'Participate in code reviews'],
        requirements: ['B.Tech (CSE/IT)', 'DSA knowledge', 'Communication skills'],
        skills: ['Node.js', 'MongoDB', 'REST APIs'],
      },
      {
        title: 'Intern - Frontend Developer',
        company: 'UI Labs',
        location: 'Remote',
        type: 'Internship',
        experience: '0 years',
        education: 'B.Tech/B.E (CSE/IT/Any)',
        batch: '2025 Batch',
        jobDescription: 'Frontend internship opportunity focusing on React and responsive web design. Learn modern web technologies and build portfolio projects.',
        description: 'Frontend internship focusing on React and Bootstrap.',
        applyLink: 'https://example.com/apply/uilabs',
        responsibilities: ['Build UI components', 'Implement responsive designs', 'Learn React basics'],
        requirements: ['HTML/CSS/JS basics', 'Enthusiasm to learn', 'Good communication'],
        skills: ['HTML5', 'CSS3', 'JavaScript', 'React'],
      },
    ];

    // Generate slug for each job
    const sampleWithSlugs = sample.map(job => ({
      ...job,
      slug: slugify(job.title, { lower: true, strict: true }),
    }));

    const created = await Job.create(sampleWithSlugs);
    res.json({ message: `Seeded ${created.length} jobs successfully` });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Seed failed', e);
    res.status(500).json({ message: `Seed failed: ${e.message}` });
  }
};

// Clear seeded/sample jobs (protected route)
exports.clearSeed = async (req, res) => {
  try {
    // Define titles/companies used by seeders to target sample entries only
    const sampleTitles = [
      'Campus Hiring - Trainee Engineer',
      'Graduate Software Engineer',
      'Intern - Frontend Developer',
      'Software Engineer - Fresher',
      'Frontend Developer Internship',
      'Junior QA Engineer',
      'Part-time Content Writer',
      'Work From Home - Data Entry',
      'Backend Developer - Node.js',
      'DevOps Intern',
      'Graphic Designer (Part-Time)',
      'Data Analyst - Fresher',
      'Customer Support - Remote',
      'Marketing Executive (Fresher)',
      'EPAM Off Campus Drive 2026 – Hiring Junior Software Engineer (Trainee)',
      'EPAM Off Campus Drive 2026 – Junior Software Engineer (Trainee)',
      'Full Stack Developer - Fresher Program',
    ];

    // Remove jobs matching any of these titles OR companies used by seeders
    const sampleCompanies = ['Tech Innovators', 'NextGen Soft', 'UI Labs', 'Acme Tech', 'Bright Labs', 'QualityFirst', 'MediaWorks', 'HomeOffice Pvt Ltd', 'ServerWorks', 'CloudOps', 'DesignHub', 'DataSense', 'Helply', 'MarketPro', 'EPAM Systems', 'TechVision Solutions'];

    const result = await Job.deleteMany({ $or: [ { title: { $in: sampleTitles } }, { company: { $in: sampleCompanies } } ] });

    res.json({ message: `Deleted ${result.deletedCount} seeded/sample jobs` });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Clear seed failed', e);
    res.status(500).json({ message: `Clear seed failed: ${e.message}` });
  }
};
