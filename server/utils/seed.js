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
      jobDescription: 'Work with a QA team to build robust test coverage for web apps.',
      description: 'Work with a QA team to build robust test coverage for web apps.',
      responsibilities: ['Write test cases', 'Find bugs', 'Automate tests'],
      requirements: ['QA knowledge', 'Attention to detail', 'Analytical'],
      skills: ['Selenium', 'JIRA', 'Testing'],
      applyLink: 'https://example.com/apply/qa',
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
      jobDescription: 'Write engaging job-related articles and company profiles.',
      description: 'Write engaging job-related articles and company profiles.',
      responsibilities: ['Create content', 'Research companies', 'Meet deadlines'],
      requirements: ['Good writing', 'Tech interest', 'Research ability'],
      skills: ['Writing', 'Content', 'Research'],
      applyLink: 'https://example.com/apply/media',
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
      jobDescription: 'Flexible data entry work from home for freshers.',
      description: 'Flexible data entry work from home for freshers.',
      responsibilities: ['Data entry', 'Meet targets', 'Quality check'],
      requirements: ['Computer knowledge', 'Typing speed', 'Detail oriented'],
      skills: ['Data Entry', 'MS Office'],
      applyLink: 'https://example.com/apply/home',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
    },
  ];

  await Job.create(sample);
  // eslint-disable-next-line no-console
  console.log(`Seeded ${sample.length} sample jobs`);
}

const mongoose = require('mongoose');

async function seedDetailedJob() {
  const jobId = 'detailed-job-showcase-2025';
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

  await Job.create(detailedJob);
  // eslint-disable-next-line no-console
  console.log('Seeded detailed Full Stack Developer job with complete information');
}

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
    await Job.create(graduate);
    // eslint-disable-next-line no-console
    console.log('Seeded Graduate Software Engineer demo job with fixed id');
  }
}

module.exports = { seedAdminIfNeeded, seedJobsIfNeeded, ensureMinimumJobs, seedDetailedJob };
