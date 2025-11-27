const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Job = require('../models/Job');

async function seedAdminIfNeeded() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password) return;
  const hash = await bcrypt.hash(password, 10);
  await Admin.findOneAndUpdate(
    { username },
    { username, password: hash },
    { upsert: true }
  );
  // eslint-disable-next-line no-console
  console.log('Seeded/updated admin user');
}

async function seedJobsIfNeeded() {
  const count = await Job.countDocuments();
  if (count > 0) return;
  const sample = [
    {
      title: 'Software Engineer - Fresher',
      company: 'Acme Tech',
      location: 'Remote',
      type: 'Full-Time',
      experience: '0-1 years',
      description: 'Join Acme Tech as a Software Engineer. Work on modern web applications and grow your skills.',
      applyLink: 'https://example.com/apply/acme',
      createdAt: new Date(),
    },
    {
      title: 'Frontend Developer Internship',
      company: 'Bright Labs',
      location: 'Bengaluru',
      type: 'Internship',
      experience: '0 years',
      description: 'A hands-on internship building UI components with React and Bootstrap.',
      applyLink: 'https://example.com/apply/bright',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    },
    {
      title: 'Junior QA Engineer',
      company: 'QualityFirst',
      location: 'Hyderabad',
      type: 'Full-Time',
      experience: '0-2 years',
      description: 'Work with a QA team to build robust test coverage for web apps.',
      applyLink: 'https://example.com/apply/qa',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    },
    {
      title: 'Part-time Content Writer',
      company: 'MediaWorks',
      location: 'Remote',
      type: 'Part-Time',
      experience: '0+ years',
      description: 'Write engaging job-related articles and company profiles.',
      applyLink: 'https://example.com/apply/media',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    },
    {
      title: 'Work From Home - Data Entry',
      company: 'HomeOffice Pvt Ltd',
      location: 'Remote',
      type: 'Remote',
      experience: '0 years',
      description: 'Flexible data entry work from home for freshers.',
      applyLink: 'https://example.com/apply/home',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
    },
  ];

  await Job.create(sample);
  // eslint-disable-next-line no-console
  console.log(`Seeded ${sample.length} sample jobs`);
}

const mongoose = require('mongoose');

async function ensureMinimumJobs(min = 12) {
  const count = await Job.countDocuments();
  if (count >= min) return;
  const more = [
    {
      title: 'Backend Developer - Node.js',
      company: 'ServerWorks',
      location: 'Pune',
      type: 'Full-Time',
      experience: '0-2 years',
      description: 'Build scalable APIs with Node.js and Express.',
      applyLink: 'https://example.com/apply/serverworks',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    },
    {
      title: 'DevOps Intern',
      company: 'CloudOps',
      location: 'Mumbai',
      type: 'Internship',
      experience: '0 years',
      description: 'Learn CI/CD and cloud infrastructure.',
      applyLink: 'https://example.com/apply/cloudops',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
    },
    {
      title: 'Graphic Designer (Part-Time)',
      company: 'DesignHub',
      location: 'Remote',
      type: 'Part-Time',
      experience: '0+ years',
      description: 'Create visuals and banners for job posts.',
      applyLink: 'https://example.com/apply/designhub',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6),
    },
    {
      title: 'Data Analyst - Fresher',
      company: 'DataSense',
      location: 'Delhi',
      type: 'Full-Time',
      experience: '0-1 years',
      description: 'Analyze datasets and create reports.',
      applyLink: 'https://example.com/apply/datasense',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8),
    },
    {
      title: 'Customer Support - Remote',
      company: 'Helply',
      location: 'Remote',
      type: 'Remote',
      experience: '0 years',
      description: 'Provide support via chat and email.',
      applyLink: 'https://example.com/apply/helply',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9),
    },
    {
      title: 'Marketing Executive (Fresher)',
      company: 'MarketPro',
      location: 'Chennai',
      type: 'Full-Time',
      experience: '0-1 years',
      description: 'Assist in digital marketing campaigns.',
      applyLink: 'https://example.com/apply/marketpro',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 11),
    },
  ];

  const need = min - count;
  await Job.create(more.slice(0, need));
  // eslint-disable-next-line no-console
  console.log(`Added ${Math.min(need, more.length)} more sample jobs`);

  // Ensure a detailed sample job with a fixed id exists for testing/demos
  const fixedId = '6912dfb9a9efb8b63c2de667';
  const exists = await Job.findById(fixedId).lean();
  if (!exists) {
    const detailed = {
      _id: mongoose.Types.ObjectId(fixedId),
      title: 'EPAM Off Campus Drive 2026 – Hiring Junior Software Engineer (Trainee)',
      company: 'EPAM Systems',
      location: 'Multiple Cities / Remote',
      type: 'Full-Time',
      experience: '0-1 years',
      description: `EPAM Off Campus Drive 2026 – Hiring Junior Software Engineer (Trainee)\n\nEPAM is hiring freshers for their trainee program. This role involves learning on-the-job, contributing to real projects, and receiving mentorship from senior engineers.\n\nResponsibilities:\n- Participate in training and development programs\n- Work on development tasks using modern web technologies\n- Collaborate with cross-functional teams\n\nEligibility:\n- B.E/B.Tech/MCA or equivalent\n- Good programming fundamentals\n- Strong communication skills\n\nHow to apply:\nApply using the link or contact via WhatsApp/Telegram provided.`,
      applyLink: 'https://example.com/apply/epam',
      image: 'https://cdn.builder.io/api/v1/image/assets%2F0652c10db86741bd95f51605c9719073%2F196590e2e83d4a159a955d16c0e8ebde?format=webp&width=800',
      whatsapp: '919999999999',
      telegram: 'EPAM_Official',
      contact: '+91-99999-99999',
      createdAt: new Date(),
    };
    await Job.create(detailed);
    // eslint-disable-next-line no-console
    console.log('Seeded detailed demo job with fixed id');
  }

  // Also ensure the Graduate Software Engineer demo exists with the requested id
  const gradId = '6912e407eb0140cbb350624e';
  const gradExists = await Job.findById(gradId).lean();
  if (!gradExists) {
    const graduate = {
      _id: mongoose.Types.ObjectId(gradId),
      title: 'Graduate Software Engineer',
      company: 'NextGen Soft',
      location: 'Hyderabad',
      type: 'Full-Time',
      experience: '0-1 years',
      description: `NextGen Soft is hiring Graduate Software Engineers.\n\nRole:\n- Work on backend services and APIs\n- Participate in code reviews and team sprints\n\nPerks:\n- Training and mentorship\n- Competitive stipend and benefits`,
      applyLink: 'https://example.com/apply/nextgen',
      image: '',
      whatsapp: '919888888888',
      telegram: '@NextGenJobs',
      contact: '+91-98888-88888',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    };
    await Job.create(graduate);
    // eslint-disable-next-line no-console
    console.log('Seeded Graduate Software Engineer demo job with fixed id');
  }
}

module.exports = { seedAdminIfNeeded, seedJobsIfNeeded, ensureMinimumJobs };
