const bcrypt = require('bcryptjs');
const slugify = require('slugify');
const Admin = require('../models/Admin');
const Job = require('../models/Job');

// Helper function to ensure job has a slug
function ensureSlug(job) {
  if (!job.slug) {
    job.slug = slugify(job.title, {
      lower: true,
      strict: true,
      trim: true
    });
  }
  return job;
}

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
  try {
    // First, clean up any invalid jobs (missing required fields)
    await Job.deleteMany({ slug: { $exists: false } });
    await Job.deleteMany({ jobDescription: { $exists: false } });
    await Job.deleteMany({ education: { $exists: false } });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Warning: Could not clean invalid jobs', e.message);
  }

  const count = await Job.countDocuments();
  if (count > 0) return;

  // Add EPAM job to the seed data
  const epamJob = {
    title: 'EPAM Off Campus Drive 2026 – Hiring Junior Software Engineer (Trainee)',
    slug: 'epam-off-campus-drive-2026-hiring-junior-software-engineer-trainee',
    company: 'EPAM Systems',
    location: 'Across India (Bengaluru, Hyderabad, Pune, Chennai)',
    type: 'Full-Time',
    experience: 'Freshers',
    education: 'B.E/B.Tech (CSE/IT) or MCA',
    batch: '2025 Batch',
    salary: 'Up to ₹8 LPA (after training)',
    jobDescription: `<h3>EPAM Off Campus Drive 2026 – Junior Software Engineer (Trainee)</h3>
<p>EPAM Systems is a leading global provider of digital platform engineering and software development services. With over 50,000+ employees across 50+ countries, we are committed to innovation, digital transformation, and creating exceptional career opportunities for talented professionals.</p>

<h4>Program Overview</h4>
<p>EPAM is launching an exciting off-campus drive for fresh graduates interested in kickstarting their software engineering careers. This is a <strong>5-month intensive training program</strong> followed by a full-time Software Engineer position.</p>

<h4>About the Role</h4>
<p>As a Junior Software Engineer Trainee, you will:</p>
<ul>
<li>Participate in a structured 5-month training program covering industry-standard technologies</li>
<li>Build deep technical skills in software design, development, and testing</li>
<li>Learn through hands-on projects and mentorship from experienced engineers</li>
<li>Post-training, transition to a full-time Software Engineer role at EPAM</li>
<li>Work on challenging projects for global clients</li>
<li>Collaborate with diverse teams across multiple EPAM offices in India</li>
</ul>

<h4>Why Join EPAM?</h4>
<ul>
<li><strong>Global Career Opportunities:</strong> Work on international projects and gain exposure to world-class technologies</li>
<li><strong>Structured Training:</strong> Comprehensive training program designed to make you industry-ready</li>
<li><strong>Competitive Compensation:</strong> Attractive salary package with benefits from day one</li>
<li><strong>Growth Culture:</strong> Clear career progression path and continuous learning opportunities</li>
<li><strong>Innovation Focus:</strong> Work on cutting-edge technologies and digital transformation projects</li>
<li><strong>Work-Life Balance:</strong> Flexible work arrangements and wellness programs</li>
</ul>`,
    description: 'EPAM Off Campus Drive 2026 for fresh graduates. 5-month training program leading to full-time Software Engineer role. Up to ₹8 LPA after training. Great opportunity for career growth with a global IT company.',
    aboutCompany: `<h4>About EPAM Systems</h4>
<p>EPAM Systems is a leading digital platform engineering and software development company with a presence in 50+ countries. We deliver innovative solutions to Fortune 500 companies and help organizations transform digitally. With a culture of excellence, continuous learning, and innovation, EPAM is the perfect place to build your software engineering career.</p>

<p><strong>Key Facts:</strong></p>
<ul>
<li>Founded: 1993</li>
<li>Headquarters: Newtown, Pennsylvania, USA</li>
<li>Global Employees: 50,000+</li>
<li>Offices in India: Multiple centers in Bangalore, Hyderabad, Pune, Chennai, and other cities</li>
<li>Specialization: Digital platform engineering, cloud solutions, DevOps, mobile development, and AI/ML</li>
</ul>`,
    responsibilities: [
      'Complete comprehensive technical training in programming languages and frameworks (Java/Python, web technologies)',
      'Design and develop scalable, high-performance software applications',
      'Write clean, well-optimized, and reusable code following best practices',
      'Build and maintain automated tests using industry-standard tools (Selenium, JUnit, TestNG, Cypress, Playwright)',
      'Participate in all phases of the Software Development Life Cycle (SDLC)',
      'Collaborate with QA, DevOps, and product teams to deliver quality solutions',
      'Debug, code review, validate, and perform performance testing on applications',
      'Automate repetitive tasks and processes using modern frameworks and scripting',
      'Stay updated with emerging technologies and contribute to continuous improvement initiatives',
      'Document code and create technical specifications for assigned features'
    ],
    requirements: [
      'Bachelor\'s degree (B.E/B.Tech in CSE/IT) or MCA from 2025 batch',
      'Minimum 70% aggregate score in graduation',
      'Minimum 60% in 10th and 12th standards',
      'No active backlogs at the time of application',
      'No education gap in 10th-12th; maximum 1-year gap between 12th and graduation',
      'Strong understanding of core Computer Science fundamentals: Data Structures, Algorithms, OOP',
      'Proficiency in at least one programming language (Java, Python, C++, or C)',
      'Basic knowledge of SQL and database concepts',
      'Familiarity with version control systems (Git) and build automation tools',
      'Analytical thinking and strong problem-solving abilities',
      'Good communication skills in English',
      'Willingness to learn and adapt to new technologies',
      'Alignment with EPAM values: excellence, teamwork, and accountability'
    ],
    skills: ['Java', 'Python', 'C++', 'SQL', 'Data Structures', 'Algorithms', 'OOP', 'Git', 'REST APIs', 'Problem Solving', 'Communication'],
    howToApply: `<h4>Application Process</h4>
<ol>
<li><strong>Online Application:</strong> Apply through the official EPAM careers portal</li>
<li><strong>Technical Assessment:</strong> Shortlisted candidates will appear for an online technical assessment testing problem-solving skills, programming fundamentals, and data structures</li>
<li><strong>Coding Round:</strong> Solve real-world coding problems within the given time limit</li>
<li><strong>Technical Interview:</strong> Face-to-face technical interview with EPAM engineers covering core CS concepts and coding</li>
<li><strong>HR Interview:</strong> Final HR round to assess soft skills, cultural fit, and career goals</li>
<li><strong>Selection & Offer:</strong> Selected candidates will receive an offer letter with training and role details</li>
</ol>
<p><strong>Application Deadline:</strong> Apply as soon as possible for best consideration</p>`,
    whyJoin: `<h4>Why Join EPAM's Trainee Program?</h4>
<ul>
<li><strong>5-Month Structured Training:</strong> Industry-standard curriculum designed to make you job-ready covering modern tech stack</li>
<li><strong>Guaranteed Full-Time Role:</strong> Successful completion leads to permanent Software Engineer position</li>
<li><strong>Global Projects:</strong> Work on international projects and collaborate with teams worldwide</li>
<li><strong>Expert Mentorship:</strong> Learn from experienced engineers and architects within EPAM</li>
<li><strong>Competitive Salary:</strong> Starting from ₹8 LPA + performance incentives and benefits</li>
<li><strong>Growth Opportunities:</strong> Clear career progression path with regular skill-building and promotions</li>
<li><strong>Innovation Culture:</strong> Work with cutting-edge technologies and be part of digital transformation</li>
<li><strong>Work Flexibility:</strong> Remote/hybrid work options and flexible working hours</li>
<li><strong>Comprehensive Benefits:</strong> Health insurance, fitness programs, learning budgets, and wellness initiatives</li>
</ul>`,
    finalThoughts: `<h4>Join EPAM and Launch Your Tech Career!</h4>
<p>EPAM's Off Campus Drive 2026 is your gateway to a rewarding career in software engineering. With structured training, global exposure, and a company culture that values innovation and excellence, this is the perfect opportunity for fresh graduates to grow professionally and personally.</p>
<p><strong>Don't miss this chance to be part of one of the world's leading digital engineering companies. Apply now and take the first step towards an exciting career in technology!</strong></p>`,
    highlightText: 'Join EPAM as a Junior Software Engineer Trainee and launch your career with a 5-month training program followed by a permanent full-time role. Work on global projects with a leading digital engineering company. Up to ₹8 LPA after training.',
    applyLink: 'https://careers.epam.com/apply',
    image: 'https://cdn.builder.io/api/v1/image/assets%2F0652c10db86741bd95f51605c9719073%2F196590e2e83d4a159a955d16c0e8ebde?format=webp&width=1200',
    whatsapp: 'https://chat.whatsapp.com/LVpuUJluTpUEdIc4daAemQ',
    telegram: 'https://t.me/nextjobpost',
    contact: 'careers@epam.com',
    lastDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45),
    metaTitle: 'EPAM Off Campus Drive 2026 – Junior Software Engineer (Trainee) | 5-Month Training Program',
    metaDescription: 'EPAM Off Campus Drive 2026 for 2025 batch graduates. Hiring Junior Software Engineer (Trainee) positions. 5-month training, ₹8 LPA, global projects. Apply now!',
    createdAt: new Date(),
  };
  const sample = [epamJob,
    {
      title: 'Software Engineer - Fresher',
      company: 'Acme Tech',
      location: 'Bangalore, India',
      type: 'Full-Time',
      experience: '0-1 years',
      education: 'B.Tech/B.E (CSE/IT/ECE)',
      batch: '2024-2025 Batch',
      salary: '4-6 LPA',
      jobDescription: `Join Acme Tech as a Software Engineer and work on cutting-edge web applications that serve millions of users globally.

Our Company:
Acme Tech is a leading software development company specializing in cloud-based solutions and enterprise applications. With over 500+ employees across multiple offices, we're committed to innovation and excellence.

About the Role:
This is an exciting opportunity for freshers who want to launch their career in software development. You'll work with experienced mentors, develop full-stack web applications using modern technologies, and contribute to products used by companies worldwide.

What You'll Do:
- Develop and maintain scalable web applications using React and Node.js
- Write clean, well-tested code following industry best practices
- Collaborate with product managers and designers to understand requirements
- Participate in code reviews and contribute to improving team processes
- Debug and optimize application performance

Learning Opportunities:
- Structured mentorship from senior engineers
- Regular training sessions on latest technologies
- Opportunity to work with microservices architecture
- Exposure to cloud platforms (AWS/GCP)`,
      description: 'Join Acme Tech as a Software Engineer and work on modern web applications. Great mentorship and learning opportunities for freshers.',
      responsibilities: [
        'Develop responsive web applications using React, Node.js, and MongoDB',
        'Write unit tests and integration tests for your code',
        'Participate in daily stand-ups and sprint planning sessions',
        'Collaborate with product team to implement new features',
        'Debug and optimize application performance',
        'Contribute to technical documentation and code comments',
        'Attend weekly code review sessions with senior developers'
      ],
      requirements: [
        'B.Tech/B.E in Computer Science, IT, or related field',
        'Strong understanding of Data Structures and Algorithms',
        'Hands-on experience with JavaScript or any programming language',
        'Good problem-solving skills and analytical mindset',
        'Strong communication and team collaboration abilities',
        'Familiarity with HTML, CSS, and DOM concepts',
        'Willingness to learn and adapt to new technologies'
      ],
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'HTML/CSS', 'Git', 'REST APIs'],
      applyLink: 'https://example.com/apply/acme',
      image: 'https://cdn.builder.io/api/v1/image/assets%2F0652c10db86741bd95f51605c9719073%2Fa3f90db9ab1140a59e27ef90e6d8a2d3?format=webp&width=1200',
      whatsapp: '9876543210',
      telegram: '@AcmeTechJobs',
      contact: '+91-80-XXXX-XXXX',
      lastDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      createdAt: new Date(),
    },
    {
      title: 'Frontend Developer Internship (6 months)',
      company: 'Bright Labs',
      location: 'Bangalore, India',
      type: 'Internship',
      experience: '0 years',
      education: 'B.Tech/B.E (CSE/IT/IS)',
      batch: '2025 Batch',
      salary: 'Stipend: ₹15,000-25,000/month',
      jobDescription: `Bright Labs is looking for talented Frontend Interns to build stunning user interfaces for our web applications.

About Bright Labs:
We are a fast-growing startup focused on building innovative web solutions. Our team is passionate about creating beautiful, user-friendly interfaces that users love.

Internship Overview:
This 6-month paid internship is an excellent opportunity to work on real projects, learn from experienced developers, and build a strong portfolio. You'll work with modern frontend technologies and be mentored by our senior developers.

What You'll Learn:
- React.js and component-based architecture
- Responsive web design with Bootstrap and Tailwind CSS
- State management with Redux
- API integration with REST and GraphQL
- Git version control and collaborative development
- Agile/Scrum methodology`,
      description: 'Hands-on 6-month internship building UI components with React, Bootstrap, and modern web technologies. Great learning experience for 2025 batch.',
      responsibilities: [
        'Build reusable React components with modern ES6+ JavaScript',
        'Implement responsive designs using Bootstrap and Tailwind CSS',
        'Integrate REST APIs and manage application state',
        'Participate in sprint planning and daily stand-ups',
        'Create responsive layouts that work across devices',
        'Collaborate with design team to implement UI mockups',
        'Write documentation for components and features'
      ],
      requirements: [
        'Currently pursuing B.Tech/B.E in CSE/IT/IS',
        'Basic understanding of HTML, CSS, and JavaScript',
        'Familiarity with React or willingness to learn quickly',
        'Good communication and team collaboration skills',
        'Attention to detail and design aesthetics',
        'Problem-solving mindset'
      ],
      skills: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'React', 'Bootstrap', 'Responsive Design', 'Git'],
      applyLink: 'https://example.com/apply/bright',
      image: 'https://cdn.builder.io/api/v1/image/assets%2F0652c10db86741bd95f51605c9719073%2Fc8e2a8f3d4b2a1f9e7c5b3a1?format=webp&width=1200',
      whatsapp: '9123456789',
      telegram: '@BrightLabsHiring',
      contact: 'careers@brightlabs.in',
      lastDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    },
    {
      title: 'Junior QA Engineer',
      company: 'QualityFirst',
      location: 'Hyderabad',
      type: 'Full-Time',
      experience: '0-2 years',
      education: 'B.Tech/B.E (CSE/IT)',
      batch: '2023-2025 Batch',
      jobDescription: '<p>Work with a QA team to build robust test coverage for web applications.</p><ul><li>Manual and automated testing</li><li>Test case creation and execution</li><li>Bug reporting and tracking</li></ul>',
      description: 'Join QualityFirst as a Junior QA Engineer. Build robust test coverage for web apps. Great learning opportunity in QA domain.',
      responsibilities: ['Write comprehensive test cases', 'Find bugs and document them', 'Automate tests using Selenium', 'Participate in test planning sessions', 'Create test reports'],
      requirements: ['QA knowledge', 'Attention to detail', 'Analytical mindset', 'Good communication skills'],
      skills: ['Selenium', 'JIRA', 'Testing', 'Manual Testing'],
      applyLink: 'https://example.com/apply/qa',
      lastDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    },
    {
      title: 'Part-time Content Writer',
      company: 'MediaWorks',
      location: 'Remote',
      type: 'Part-Time',
      experience: '0+ years',
      education: 'B.Tech/B.A (Any)',
      batch: '2024-2026 Batch',
      jobDescription: '<p>Write engaging job-related articles, company profiles, and career blogs.</p><ul><li>Research company information</li><li>Write SEO-optimized content</li><li>Meet publication deadlines</li></ul>',
      description: 'Write engaging job-related articles and company profiles for MediaWorks. Flexible part-time opportunity for writers interested in tech and career content.',
      responsibilities: ['Create high-quality content', 'Research companies and roles', 'Meet editorial deadlines', 'Edit and proofread content', 'Collaborate with editorial team'],
      requirements: ['Good writing skills', 'Interest in tech', 'Research ability', 'Time management'],
      skills: ['Writing', 'Content', 'Research', 'SEO'],
      applyLink: 'https://example.com/apply/media',
      lastDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 25),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    },
    {
      title: 'Work From Home - Data Entry',
      company: 'HomeOffice Pvt Ltd',
      location: 'Remote',
      type: 'Remote',
      experience: '0+ years',
      education: '10+2 or Above',
      batch: '2024-2025 Batch',
      jobDescription: '<p>Flexible data entry work from home for freshers. Process and organize data with accuracy.</p><ul><li>Data entry from various sources</li><li>Data verification and validation</li><li>Meet daily targets</li><li>Work from home flexibility</li></ul>',
      description: 'Flexible work from home data entry job. Perfect for freshers seeking flexible working hours. No experience required. Good typing speed and attention to detail needed.',
      responsibilities: ['Perform data entry tasks', 'Meet daily entry targets', 'Quality check own work', 'Maintain data confidentiality', 'Report progress'],
      requirements: ['Computer knowledge', 'Typing speed (40+ WPM)', 'Attention to detail', 'Reliable internet connection'],
      skills: ['Data Entry', 'MS Office', 'Typing'],
      applyLink: 'https://example.com/apply/home',
      lastDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 40),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
    },
  ];

  // Ensure all jobs have slugs before creating
  const jobsWithSlugs = sample.map(ensureSlug);
  await Job.create(jobsWithSlugs);
  // eslint-disable-next-line no-console
  console.log(`Seeded ${jobsWithSlugs.length} sample jobs`);
}

const mongoose = require('mongoose');

async function seedDetailedJob() {
  const jobId = 'detailed-job-showcase-2025';
  try {
    // Clean up any invalid jobs
    await Job.deleteMany({ slug: { $exists: false } });
    await Job.deleteMany({ jobDescription: { $exists: false } });
    await Job.deleteMany({ education: { $exists: false } });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Warning: Could not clean invalid jobs', e.message);
  }

  const exists = await Job.findOne({ title: 'Full Stack Developer - Fresher Program' }).lean();
  if (exists) return;

  const detailedJob = {
    title: 'Full Stack Developer - Fresher Program',
    company: 'TechVision Solutions',
    location: 'Bangalore, India',
    type: 'Full-Time',
    experience: '0-1 years',
    education: 'B.Tech/B.E (CSE/IT/ECE)',
    batch: '2024-2025 Batch',
    salary: '4.5-6.5 LPA',
    jobDescription: `TechVision Solutions - Full Stack Developer Fresher Program 2025

About TechVision Solutions:
We are a fast-growing technology company specializing in web and mobile application development. With a team of 200+ developers across Bangalore and Pune offices, we build innovative solutions for startups and Fortune 500 companies.

Program Overview:
This is a structured 2-year fresher development program where you'll:
- Learn full-stack development from scratch
- Work on real client projects
- Get certified in modern technologies
- Build a strong portfolio
- Grow into senior developer roles

Why Join Us:
✓ Industry-standard training curriculum
✓ Mentorship from senior architects
✓ Work on cutting-edge projects
✓ Competitive compensation
✓ Growth-oriented culture
✓ Health insurance from day 1

Tech Stack You'll Learn:
Frontend: React.js, Vue.js, Tailwind CSS
Backend: Node.js, Express, Django
Database: MongoDB, PostgreSQL, Redis
Cloud: AWS, Docker, Kubernetes
Tools: Git, Jenkins, JIRA

Role Responsibilities:
- Complete structured training on MERN stack
- Develop full-stack web applications
- Write clean, well-tested code
- Participate in code reviews and sprint planning
- Deploy and monitor applications
- Collaborate with designers and product teams
- Contribute to technical documentation
- Attend weekly knowledge sharing sessions`,
    description: 'Join TechVision Solutions as a Full Stack Developer Fresher. Learn MERN stack, work on real projects, and grow your career with industry mentors. Competitive salary, great benefits, and guaranteed growth path.',
    responsibilities: [
      'Complete comprehensive 3-month training on MERN stack (MongoDB, Express, React, Node.js)',
      'Develop and maintain full-stack web applications using assigned technologies',
      'Write unit tests and integration tests achieving 80%+ code coverage',
      'Participate in daily stand-ups, sprint planning, and retrospectives',
      'Collaborate with frontend and backend teams on assigned features',
      'Debug production issues and implement fixes within SLA',
      'Create and maintain technical documentation for developed features',
      'Attend weekly training sessions and upskill on new technologies',
      'Contribute to code quality improvement initiatives',
      'Present monthly project updates to team and stakeholders'
    ],
    requirements: [
      'B.Tech/B.E in Computer Science, IT, Electronics or related field',
      'Strong foundation in Data Structures and Algorithms',
      'Hands-on programming experience in at least one language (Java/Python/C++)',
      'Good understanding of OOPS concepts',
      'Knowledge of HTML, CSS, and JavaScript basics',
      'Logical thinking and problem-solving approach',
      'Strong communication skills in English',
      'Willingness to learn and adapt to new technologies',
      'Team player with collaborative mindset'
    ],
    skills: [
      'JavaScript (ES6+)',
      'React.js',
      'Node.js',
      'MongoDB',
      'Express.js',
      'HTML5',
      'CSS3',
      'REST APIs',
      'Git',
      'Problem Solving',
      'Team Collaboration'
    ],
    image: 'https://cdn.builder.io/api/v1/image/assets%2F0652c10db86741bd95f51605c9719073%2Fb8c3d7f0e1a2b4c5d6e7f8a9b0c1d2e3?format=webp&width=1200',
    applyLink: 'https://techvision.careers/apply/fullstack-2025',
    whatsapp: '9876543210',
    telegram: '@TechVisionCareers',
    contact: 'careers@techvision.in',
    lastDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60),
    metaTitle: 'Full Stack Developer Fresher Program - TechVision Solutions',
    metaDescription: 'Join TechVision Solutions as a Full Stack Developer Fresher. Learn MERN stack, work on real projects with experienced mentors. 4.5-6.5 LPA. Apply now!',
    createdAt: new Date(),
  };

  await Job.create(ensureSlug(detailedJob));
  // eslint-disable-next-line no-console
  console.log('Seeded detailed Full Stack Developer job with complete information');
}

async function ensureMinimumJobs(min = 12) {
  try {
    // Clean up any invalid jobs
    await Job.deleteMany({ slug: { $exists: false } });
    await Job.deleteMany({ jobDescription: { $exists: false } });
    await Job.deleteMany({ education: { $exists: false } });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Warning: Could not clean invalid jobs', e.message);
  }

  const count = await Job.countDocuments();
  if (count >= min) return;
  const more = [
    {
      title: 'Backend Developer - Node.js',
      company: 'ServerWorks',
      location: 'Pune',
      type: 'Full-Time',
      experience: '0-2 years',
      education: 'B.Tech/B.E (CSE/IT)',
      jobDescription: '<p>Build scalable APIs with Node.js and Express for enterprise applications.</p><ul><li>Develop RESTful APIs</li><li>Design database schemas</li><li>Optimize backend performance</li></ul>',
      description: 'Build scalable APIs with Node.js and Express for enterprise applications. Great opportunity for backend developers.',
      responsibilities: ['Develop and maintain Node.js APIs', 'Design database schemas', 'Optimize performance', 'Write unit tests'],
      requirements: ['Node.js knowledge', 'Express.js experience', 'Database design', 'Problem solving'],
      skills: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'REST APIs'],
      applyLink: 'https://example.com/apply/serverworks',
      lastDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    },
    {
      title: 'DevOps Intern',
      company: 'CloudOps',
      location: 'Mumbai',
      type: 'Internship',
      experience: '0 years',
      education: 'B.Tech/B.E (CSE/IT)',
      jobDescription: '<p>Learn CI/CD and cloud infrastructure on modern cloud platforms.</p><ul><li>Docker and Kubernetes</li><li>CI/CD pipelines</li><li>Cloud deployment</li></ul>',
      description: 'Learn CI/CD and cloud infrastructure. 3-month internship with hands-on learning in DevOps domain.',
      responsibilities: ['Learn DevOps fundamentals', 'Set up CI/CD pipelines', 'Deploy applications', 'Monitor systems'],
      requirements: ['Linux basics', 'Interest in DevOps', 'Problem solving', 'Team player'],
      skills: ['Docker', 'Kubernetes', 'CI/CD', 'Cloud Platforms'],
      applyLink: 'https://example.com/apply/cloudops',
      lastDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 35),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
    },
    {
      title: 'Graphic Designer (Part-Time)',
      company: 'DesignHub',
      location: 'Remote',
      type: 'Part-Time',
      experience: '0+ years',
      education: 'B.Tech/B.A (Design/Fine Arts/Any)',
      jobDescription: '<p>Create visuals, banners, and graphics for job posting campaigns.</p><ul><li>Design social media graphics</li><li>Create email banners</li><li>Design web visuals</li></ul>',
      description: 'Create visuals and banners for job posts. Flexible part-time design opportunity for creative professionals.',
      responsibilities: ['Create design assets', 'Design social graphics', 'Review feedback', 'Revise designs'],
      requirements: ['Design software knowledge', 'Creative thinking', 'Attention to detail', 'Time management'],
      skills: ['Graphic Design', 'Photoshop', 'Illustrator', 'Canva'],
      applyLink: 'https://example.com/apply/designhub',
      lastDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 50),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6),
    },
    {
      title: 'Data Analyst - Fresher',
      company: 'DataSense',
      location: 'Delhi',
      type: 'Full-Time',
      experience: '0-1 years',
      education: 'B.Tech/B.E (CSE/IT/ECE)',
      jobDescription: '<p>Analyze datasets using Python and SQL, create meaningful reports for stakeholders.</p><ul><li>Data analysis and visualization</li><li>SQL query optimization</li><li>Report generation</li></ul>',
      description: 'Analyze datasets and create reports. Great opportunity for freshers to start a data analytics career.',
      responsibilities: ['Analyze datasets', 'Create visualizations', 'Generate reports', 'Present findings'],
      requirements: ['Python knowledge', 'SQL basics', 'Data analysis mindset', 'Communication skills'],
      skills: ['Python', 'SQL', 'Data Analysis', 'Tableau/Power BI'],
      applyLink: 'https://example.com/apply/datasense',
      lastDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 28),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8),
    },
    {
      title: 'Customer Support - Remote',
      company: 'Helply',
      location: 'Remote',
      type: 'Remote',
      experience: '0 years',
      education: 'B.Tech/B.A/Diploma (Any)',
      jobDescription: '<p>Provide customer support via chat, email, and phone. Work from anywhere with flexible hours.</p><ul><li>Respond to customer inquiries</li><li>Troubleshoot issues</li><li>Maintain customer satisfaction</li></ul>',
      description: 'Provide support via chat and email. Work from home with flexible hours. Perfect for freshers.',
      responsibilities: ['Handle customer inquiries', 'Resolve issues', 'Maintain records', 'Meet targets'],
      requirements: ['Communication skills', 'Problem solving', 'Patience', 'Reliability'],
      skills: ['Customer Support', 'Communication', 'Problem Solving'],
      applyLink: 'https://example.com/apply/helply',
      lastDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9),
    },
    {
      title: 'Marketing Executive (Fresher)',
      company: 'MarketPro',
      location: 'Chennai',
      type: 'Full-Time',
      experience: '0-1 years',
      education: 'B.Tech/B.B.A/B.Com (Any)',
      jobDescription: '<p>Assist in digital marketing campaigns, social media management, and customer outreach.</p><ul><li>Manage social media accounts</li><li>Create marketing content</li><li>Run campaigns</li></ul>',
      description: 'Assist in digital marketing campaigns. Great opportunity for freshers to learn marketing in a growing company.',
      responsibilities: ['Manage social accounts', 'Create content', 'Run campaigns', 'Analyze metrics'],
      requirements: ['Marketing interest', 'Social media knowledge', 'Communication skills', 'Creativity'],
      skills: ['Digital Marketing', 'Social Media', 'Content Creation', 'Analytics'],
      applyLink: 'https://example.com/apply/marketpro',
      lastDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 11),
    },
  ];

  const need = min - count;
  const jobsToAdd = more.slice(0, need).map(ensureSlug);
  await Job.create(jobsToAdd);
  // eslint-disable-next-line no-console
  console.log(`Added ${Math.min(need, more.length)} more sample jobs`);

  // Ensure a detailed sample job with a fixed id exists for testing/demos
  const fixedId = '6912dfb9a9efb8b63c2de667';
  const exists = await Job.findById(fixedId).lean();
  if (!exists) {
    const detailed = {
      _id: mongoose.Types.ObjectId(fixedId),
      title: 'EPAM Off Campus Drive 2026 – Junior Software Engineer (Trainee)',
      company: 'EPAM Systems',
      location: 'Bangalore, Hyderabad, Pune / Remote',
      type: 'Full-Time',
      experience: '0-1 years',
      education: 'B.E/B.Tech/MCA (CSE/IT/ECE)',
      batch: '2024-2025 Batch',
      salary: '3.5-5 LPA + Benefits',
      jobDescription: `EPAM Off Campus Drive 2026 – Hiring Junior Software Engineer Trainees

About EPAM Systems:
EPAM Systems is a leading global software engineering company serving Fortune 500 clients worldwide. With over 50,000+ employees across 50+ countries, EPAM is committed to innovation, digital transformation, and employee development.

Program Overview:
EPAM's Trainee Program is designed for freshers to launch their career in software engineering. You'll receive:
- Structured on-the-job training (3-6 months)
- Mentorship from experienced engineers
- Real project exposure
- Clear career growth path

Role Responsibilities:
- Participate in comprehensive training on Java/Python and web technologies
- Develop and maintain software applications
- Collaborate with senior developers on real client projects
- Learn industry best practices and coding standards
- Contribute to technical documentation
- Participate in code reviews and quality assurance processes

Why Join EPAM:
- Global exposure and international opportunities
- Industry-leading learning and development programs
- Competitive compensation and benefits
- Career growth and skill development
- Diverse and inclusive workplace
- Work on cutting-edge technologies`,
      description: 'EPAM Off Campus Drive 2026 – Great opportunity for freshers to learn and grow as Software Engineer Trainees with global company EPAM Systems.',
      responsibilities: [
        'Complete structured training programs on core technologies (Java/Python, Web Development)',
        'Develop software solutions using assigned technologies',
        'Write clean, maintainable code following best practices',
        'Participate in daily stand-ups and sprint ceremonies',
        'Collaborate with team members on assigned projects',
        'Complete assigned tasks and meet project deadlines',
        'Attend knowledge sharing sessions and training workshops',
        'Contribute to continuous improvement initiatives'
      ],
      requirements: [
        'B.E/B.Tech in Computer Science/IT or related field',
        'Good programming fundamentals and DSA knowledge',
        'Knowledge of any programming language (Java/Python/C/C++)',
        'Strong communication skills in English',
        'Ability to work in a team environment',
        'Logical thinking and problem-solving ability',
        'Willingness to learn new technologies'
      ],
      skills: ['Core Java', 'Python', 'SQL', 'HTML/CSS/JavaScript', 'DSA', 'OOPS', 'Problem Solving'],
      applyLink: 'https://example.com/apply/epam',
      image: 'https://cdn.builder.io/api/v1/image/assets%2F0652c10db86741bd95f51605c9719073%2F196590e2e83d4a159a955d16c0e8ebde?format=webp&width=1200',
      whatsapp: '9876501234',
      telegram: '@EPAM_Hiring',
      contact: 'careers@epam.com',
      lastDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45),
      createdAt: new Date(),
    };
    await Job.create(detailed);
    // eslint-disable-next-line no-console
    console.log('Seeded detailed EPAM demo job with fixed id');
  }

  // Also ensure the Graduate Software Engineer demo exists with the requested id
  const gradId = '6912e407eb0140cbb350624e';
  const gradExists = await Job.findById(gradId).lean();
  if (!gradExists) {
    const graduate = {
      _id: mongoose.Types.ObjectId(gradId),
      title: 'Graduate Software Engineer',
      company: 'NextGen Soft Solutions',
      location: 'Hyderabad',
      type: 'Full-Time',
      experience: '0-2 years',
      education: 'B.Tech/B.E (CSE/IT/ECE)',
      batch: '2023-2025 Batch',
      salary: '3.5-5.5 LPA',
      jobDescription: `NextGen Soft Solutions is hiring talented Graduate Software Engineers.

About the Company:
NextGen Soft Solutions specializes in enterprise software development, cloud solutions, and digital transformation. We work with Fortune 500 companies and innovative startups to build world-class software products.

Role Description:
Join our growing team of engineers and build backend services, APIs, and scalable solutions. This is a great opportunity for fresh graduates to start their professional journey with mentorship from experienced developers.

What You'll Work On:
- Build robust backend services and RESTful APIs using Node.js or Python
- Design and optimize database schemas using MongoDB and PostgreSQL
- Implement microservices architecture patterns
- Deploy applications on cloud platforms (AWS/GCP)
- Write unit tests and ensure code quality

Career Growth:
- Clear career progression path
- Regular performance reviews and promotions
- Exposure to latest technologies
- Opportunity to lead small projects`,
      description: 'Exciting opportunity for fresh graduates to work on backend services, APIs, and cloud solutions with NextGen Soft Solutions. Great learning and growth potential.',
      responsibilities: [
        'Develop and maintain backend services using Node.js/Python and Express',
        'Design and optimize database schemas for performance',
        'Implement RESTful APIs and GraphQL endpoints',
        'Write clean, well-documented, and testable code',
        'Participate in code reviews and technical discussions',
        'Troubleshoot and debug production issues',
        'Collaborate with frontend teams and product managers',
        'Deploy and monitor applications in cloud environments'
      ],
      requirements: [
        'B.Tech/B.E in Computer Science/IT or related field',
        'Strong understanding of Data Structures and Algorithms',
        'Proficiency in Python, JavaScript, or Java',
        'Understanding of database concepts (SQL and NoSQL)',
        'Good communication and problem-solving skills',
        'Experience with version control systems (Git)',
        'Familiarity with REST APIs and HTTP protocols'
      ],
      skills: ['Node.js', 'Python', 'MongoDB', 'PostgreSQL', 'REST APIs', 'JavaScript', 'AWS', 'Git'],
      applyLink: 'https://example.com/apply/nextgen',
      image: 'https://cdn.builder.io/api/v1/image/assets%2F0652c10db86741bd95f51605c9719073%2F8f3c4d5e6a7b8c9d0e1f2a3b4c5d6e7f?format=webp&width=1200',
      whatsapp: '9888888888',
      telegram: '@NextGenSoftJobs',
      contact: 'hr@nextgensoft.com',
      lastDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 35),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    };
    await Job.create(ensureSlug(graduate));
    // eslint-disable-next-line no-console
    console.log('Seeded Graduate Software Engineer demo job with fixed id');
  }
}

module.exports = { seedAdminIfNeeded, seedJobsIfNeeded, ensureMinimumJobs, seedDetailedJob };
