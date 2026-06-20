const mongoose = require('mongoose');
const Job = require('../models/Job');
const slugify = require('slugify');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI not found in environment variables.');
  process.exit(1);
}

const sampleJobs = [
  {
    title: 'TCS Off Campus Drive 2026 – Hiring Systems Engineer (Trainee)',
    company: 'Tata Consultancy Services (TCS)',
    location: 'Across India (Mumbai, Pune, Bangalore, Hyderabad, Chennai, Noida)',
    type: 'Full-Time',
    experience: 'Freshers (0 years)',
    education: 'B.E/B.Tech/M.E/M.Tech/MCA/M.Sc',
    batch: '2025 - 2026 Batch',
    salary: '₹3.36 LPA to ₹7.0 LPA',
    description: 'TCS is hiring fresh engineering graduates for Systems Engineer Trainee roles through its national qualifier test. Opportunities available across multiple tech stacks.',
    jobDescription: `<h3>TCS Off Campus Recruitment Drive 2026</h3>
<p>Tata Consultancy Services (TCS) invites applications from young and enthusiastic engineering graduates for the Systems Engineer Trainee program. As part of our team, you will work on enterprise-level applications, cloud solutions, data analytics, and modern software architectures.</p>
<h4>Role & Responsibilities</h4>
<ul>
  <li>Participate in comprehensive technical onboarding and training modules.</li>
  <li>Assist in writing clean, well-tested, and efficient code for web and cloud platforms.</li>
  <li>Collaborate with cross-functional project teams to understand and document software requirements.</li>
  <li>Participate in code reviews, bug fixes, and testing tasks.</li>
</ul>
<h4>Eligibility Criteria</h4>
<ul>
  <li><strong>Qualifications:</strong> B.E / B.Tech / M.E / M.Tech / MCA / M.Sc (Computer Science or IT).</li>
  <li><strong>CGPA/Percentage:</strong> Minimum 60% or 6.0 CGPA throughout academic career (10th, 12th, Graduation).</li>
  <li><strong>Backlogs:</strong> No active backlogs allowed at the time of application.</li>
</ul>`,
    responsibilities: [
      'Complete software development tasks under senior guidance',
      'Learn cloud technologies, cybersecurity, and advanced frameworks',
      'Participate in agile sprint planning and daily standups',
      'Assist in building unit test suites'
    ],
    requirements: [
      'Strong knowledge of core programming (C, C++, Java, or Python)',
      'Basic understanding of Data Structures and SQL queries',
      'Excellent verbal and written communication skills',
      'Adaptability to work on diverse domains and tech stacks'
    ],
    skills: ['Java', 'Python', 'C++', 'SQL', 'HTML/CSS', 'Data Structures'],
    applyLink: 'https://www.tcs.com/careers',
    lastDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    createdAt: new Date(),
    isActive: true
  },
  {
    title: 'Wipro Elite National Talent Hunt 2026 – Project Engineer Trainee',
    company: 'Wipro Limited',
    location: 'Bangalore, Pune, Hyderabad, Gurgaon, Kolkata',
    type: 'Full-Time',
    experience: 'Freshers (0 years)',
    education: 'B.E/B.Tech (Any Branch) or MCA',
    batch: '2025 Batch',
    salary: '₹3.5 LPA to ₹5.0 LPA',
    description: 'Wipro Elite Talent Hunt is now open for engineering graduates. Join as a Project Engineer Trainee and undergo structured technical training in modern technologies.',
    jobDescription: `<h3>Wipro Elite NTH 2026 Recruitment Drive</h3>
<p>Wipro Limited is hiring fresh graduates for Project Engineer Trainee positions. This program is designed to build solid tech capabilities through expert-led training in Web Application Development, DevOps, Cloud Infrastructure, and Data Engineering.</p>
<h4>Role & Responsibilities</h4>
<ul>
  <li>Join specialized training modules for specific domain alignment (Java Full Stack, Python Analytics, Salesforce, or Cloud Engineering).</li>
  <li>Contribute to real project modules and write modular code.</li>
  <li>Verify code quality through testing scripts and automated quality checks.</li>
</ul>
<h4>Why Join Wipro?</h4>
<ul>
  <li>Excellent mentorship and peer-learning environment.</li>
  <li>Work with top global clients across various sectors.</li>
  <li>Comprehensive healthcare and insurance coverage.</li>
</ul>`,
    responsibilities: [
      'Write modular code based on requirements',
      'Identify bug fixes and optimize application performance',
      'Document system architectures and flowcharts',
      'Participate in company technical hackathons and trainings'
    ],
    requirements: [
      'Familiarity with OOP concepts',
      'Understanding of relational databases (MySQL/PostgreSQL)',
      'Good logical reasoning and problem-solving skills',
      'Flexible to relocate to any Wipro office across India'
    ],
    skills: ['JavaScript', 'MySQL', 'Core Java', 'Problem Solving', 'Git'],
    applyLink: 'https://careers.wipro.com',
    lastDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 25),
    createdAt: new Date(),
    isActive: true
  },
  {
    title: 'Infosys SP / DSE Recruitment 2026 – Specialist Programmer',
    company: 'Infosys Limited',
    location: 'Bangalore, Hyderabad, Pune, Mysore',
    type: 'Full-Time',
    experience: 'Freshers (0-1 years)',
    education: 'B.E/B.Tech/M.E/M.Tech/MCA',
    batch: '2024 - 2025 Batch',
    salary: '₹6.25 LPA to ₹9.5 LPA',
    description: 'Infosys is hiring for high-paying Specialist Programmer (SP) and Digital Specialist Engineer (DSE) roles. Direct assessment based on DSA and competitive programming.',
    jobDescription: `<h3>Infosys Specialist Programmer (SP) & DSE Hiring 2026</h3>
<p>Infosys is looking for exceptional coding talent for our advanced technology groups. As a Specialist Programmer, you will work on deep-tech projects involving Artificial Intelligence, Big Data, Blockchain, Cloud Architectures, and Enterprise Scale Applications.</p>
<h4>Assessment Pattern</h4>
<p>Selection is based entirely on a coding test containing questions on:</p>
<ul>
  <li>Data Structures (Trees, Graphs, HashMaps, Heaps)</li>
  <li>Algorithms (Dynamic Programming, Greedy, Divide & Conquer)</li>
  <li>System Design and Database Optimization</li>
</ul>`,
    responsibilities: [
      'Design, architect, and implement high-performance software modules',
      'Collaborate with product designers to map complex business requirements into tech logic',
      'Review existing systems for scalability and performance optimizations'
    ],
    requirements: [
      'Advanced skills in Java, Python, C++, or Go',
      'Strong competitive coding profile (Codechef, Codeforces, or Leetcode)',
      'Deep understanding of complexity analysis and memory optimization',
      'Familiarity with cloud infrastructures is a plus'
    ],
    skills: ['DSA', 'Competitive Coding', 'Java', 'Python', 'Go', 'Dynamic Programming'],
    applyLink: 'https://www.infosys.com/careers',
    lastDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 40),
    createdAt: new Date(),
    isActive: true
  },
  {
    title: 'Accenture Off Campus Drive 2026 – Associate Software Engineer',
    company: 'Accenture India',
    location: 'Bangalore, Hyderabad, Pune, Mumbai, Chennai, Delhi-NCR',
    type: 'Full-Time',
    experience: 'Freshers (0 years)',
    education: 'B.E/B.Tech/M.E/M.Tech/MCA/M.Sc',
    batch: '2025 Batch',
    salary: '₹4.5 LPA + Benefits',
    description: 'Accenture is accepting applications for the Associate Software Engineer (ASE) role. Open for all engineering streams and graduates.',
    jobDescription: `<h3>Accenture Associate Software Engineer (ASE) Recruitment</h3>
<p>Accenture is a global leader in professional services, helping organizations build digital cores, optimize operations, and accelerate growth. We invite fresh graduates to join us as Associate Software Engineers and drive innovations in cloud, analytics, security, and digital platforms.</p>
<h4>Role Description</h4>
<p>You will focus on developing, designing, and testing applications to solve complex business cases. You will collaborate with dynamic global teams and receive regular training on specialized technology suites.</p>`,
    responsibilities: [
      'Support the implementation of software features in agile teams',
      'Perform code tests, debugging tasks, and system integration tests',
      'Contribute to technical discussions and suggest design improvements'
    ],
    requirements: [
      'Basic programming knowledge in Java, Python, JavaScript, or C#',
      'Good cognitive and analytical capabilities',
      'Strong interpersonal and collaborative skills',
      'Familiarity with basic web concepts (HTML, CSS, JSON)'
    ],
    skills: ['JavaScript', 'HTML/CSS', 'Python', 'C#', 'SQL', 'Agile Methodologies'],
    applyLink: 'https://www.accenture.com/in-en/careers',
    lastDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 35),
    createdAt: new Date(),
    isActive: true
  },
  {
    title: 'Cognizant GenC Drive 2026 – Programmer Analyst Trainee',
    company: 'Cognizant Technology Solutions',
    location: 'Bangalore, Chennai, Pune, Kolkata, Coimbatore',
    type: 'Full-Time',
    experience: 'Freshers (0 years)',
    education: 'B.E/B.Tech/MCA/M.Sc (IT)',
    batch: '2025 Batch',
    salary: '₹4.01 LPA to ₹6.75 LPA',
    description: 'Cognizant is hiring for Programmer Analyst Trainee (PAT) positions through GenC. Multiple tracks available based on your coding test evaluation.',
    jobDescription: `<h3>Cognizant GenC Hiring – Programmer Analyst Trainee</h3>
<p>Cognizant is hiring fresh graduates for GenC developer tracks. The program matches candidates to specialized teams (Java Full Stack, Microsoft Dot Net, Salesforce, DevOps, AWS/Azure, Big Data, and QA Automation) based on their aptitude and coding performance.</p>
<h4>Eligibility Rules</h4>
<ul>
  <li>Regular, full-time engineering and MCA courses.</li>
  <li>Minimum 60% in 10th, 12th, and Graduation.</li>
  <li>No active backlogs.</li>
</ul>`,
    responsibilities: [
      'Complete designated certification paths in your assigned technology track',
      'Write clean, documented, and reusable code for system enhancements',
      'Write automated scripts for quality assurance'
    ],
    requirements: [
      'Strong conceptual understanding of OOPS, Database Management Systems, and networking',
      'Experience in basic web dev (HTML, CSS, JavaScript) or backend logic',
      'Good logical reasoning skills'
    ],
    skills: ['Java', 'C#', '.NET', 'SQL', 'Javascript', 'Cloud Fundamentals'],
    applyLink: 'https://www.cognizant.com/in/en/careers',
    lastDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20),
    createdAt: new Date(),
    isActive: true
  },
  {
    title: 'Amazon Web Services (AWS) Intern – Cloud Support Associate',
    company: 'Amazon India',
    location: 'Bangalore / Remote',
    type: 'Internship',
    experience: 'Students / Freshers',
    education: 'B.Tech/B.E (CSE/IT/ECE) or MCA',
    batch: '2026 Batch',
    salary: '₹60,000 / month (Stipend)',
    description: 'AWS is offering Cloud Support Internships for students. Learn cloud computing, network security, database management, and support enterprise customers.',
    jobDescription: `<h3>AWS Cloud Support Associate Internship 2026</h3>
<p>Amazon Web Services (AWS) provides trusted cloud infrastructure globally. We are offering a 6-month intensive internship for engineering students interested in cloud architectures, networking, operating systems, and virtualization.</p>
<h4>Internship Focus</h4>
<ul>
  <li>Learn AWS core services: EC2, S3, RDS, VPC, IAM, and Lambda.</li>
  <li>Learn to troubleshoot complex networking, security, and OS queries.</li>
  <li>Work closely with senior AWS support engineers and cloud architects.</li>
</ul>`,
    responsibilities: [
      'Learn cloud diagnostics tools and troubleshooting methodologies',
      'Reproduce customer technical scenarios in test cloud environments',
      'Collaborate with developers to resolve system bugs and infrastructure issues'
    ],
    requirements: [
      'Excellent understanding of networking protocols (TCP/IP, DNS, HTTP, SSL)',
      'Familiarity with Linux/Unix operating systems and bash scripting',
      'Good communication skills and customer-centric mindset'
    ],
    skills: ['Linux', 'Networking', 'AWS', 'TCP/IP', 'DNS', 'Shell Scripting'],
    applyLink: 'https://www.amazon.jobs',
    lastDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 18),
    createdAt: new Date(),
    isActive: true
  },
  {
    title: 'Capgemini Off Campus Drive 2026 – Software Engineer',
    company: 'Capgemini India',
    location: 'Pune, Mumbai, Bangalore, Hyderabad',
    type: 'Full-Time',
    experience: 'Freshers (0 years)',
    education: 'B.E/B.Tech/MCA/M.Sc (CS/IT)',
    batch: '2025 Batch',
    salary: '₹4.25 LPA to ₹5.75 LPA',
    description: 'Capgemini is hiring Software Engineers for cloud, data analytics, and digital solutions. Apply before the deadline.',
    jobDescription: `<h3>Capgemini Software Engineer Off Campus Drive</h3>
<p>Capgemini is a global leader in partnering with companies to transform and manage their business by harnessing the power of technology. We are looking for fresh software engineering talent to join our development centers in India.</p>
<h4>Key Responsibilities</h4>
<ul>
  <li>Design, write, and execute code snippets for cloud applications.</li>
  <li>Collaborate on testing and debugging activities.</li>
  <li>Contribute to agile ceremonies and product sprints.</li>
</ul>`,
    responsibilities: [
      'Develop front-end and back-end application features',
      'Support cloud-migration and system deployment tasks',
      'Ensure code compatibility and standard compliance'
    ],
    requirements: [
      'Basic database coding (SQL) and OOP logic',
      'Good analytical reasoning and communications skills',
      'Adaptability to work on agile project timelines'
    ],
    skills: ['SQL', 'Java', 'Python', 'Cloud Platforms', 'Git'],
    applyLink: 'https://www.capgemini.com/in-en/careers',
    lastDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    createdAt: new Date(),
    isActive: true
  },
  {
    title: 'HCLTech Off Campus Hiring 2026 – Software Engineer Trainee',
    company: 'HCL Technologies (HCLTech)',
    location: 'Noida, Chennai, Bangalore, Madurai, Nagpur',
    type: 'Full-Time',
    experience: 'Freshers (0-1 years)',
    education: 'B.Tech/B.E/MCA/M.Sc',
    batch: '2024 - 2025 Batch',
    salary: '₹3.65 LPA to ₹4.75 LPA',
    description: 'HCLTech is recruiting for the role of Software Engineer Trainee. Opportunities in web development, application support, and database management.',
    jobDescription: `<h3>HCLTech Graduate Recruitment Drive</h3>
<p>HCLTech is a global technology company, home to 220,000+ people across 60 countries. We are looking for fresh graduates for Graduate Engineer Trainee roles. You will start with an interactive tech training module and align with specialized development project groups.</p>`,
    responsibilities: [
      'Design software modules under lead supervisor guidance',
      'Resolve application support tickets and document system updates',
      'Write clean, reusable programming code'
    ],
    requirements: [
      'Good conceptual DBMS and SQL skills',
      'Programming knowledge in C, C++, Java, or C#',
      'Ability to learn fast and perform tasks independently'
    ],
    skills: ['C++', 'SQL', 'DBMS', 'Software Testing', 'HTML'],
    applyLink: 'https://www.hcltech.com/careers',
    lastDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 28),
    createdAt: new Date(),
    isActive: true
  },
  {
    title: 'Google India Intern 2026 – Software Engineering Intern',
    company: 'Google India',
    location: 'Bangalore, Hyderabad',
    type: 'Internship',
    experience: 'Students / Freshers',
    education: 'BS, MS, or PhD in Computer Science or related fields',
    batch: '2026 / 2027 Graduation',
    salary: '₹1,00,000 / month (Stipend)',
    description: 'Google India is hiring Software Engineering Interns for 2026. Opportunities to work on real Google services and build core coding skills.',
    jobDescription: `<h3>Google Software Engineering (SWE) Internship 2026</h3>
<p>Google Internships offer students a sneak peek into what a career at Google looks like. You will work on real engineering challenges, write product code, and collaborate with world-class engineers on scaled systems.</p>
<h4>Key Information</h4>
<ul>
  <li>Duration: 10-12 weeks.</li>
  <li>Mentorship: One-on-one guide and team support.</li>
  <li>Location: Google offices in Bangalore or Hyderabad.</li>
</ul>`,
    responsibilities: [
      'Write clean, well-tested code for core Google systems or features',
      'Conduct complexity assessments and performance benchmarks',
      'Participate in team meetings, code reviews, and design discussions'
    ],
    requirements: [
      'Experience in Java, C++, Python, or Go programming',
      'Strong knowledge of algorithms, space-time complexities, and data structures',
      'Experience with Unix/Linux development environments'
    ],
    skills: ['C++', 'Java', 'Python', 'Algorithms', 'Data Structures', 'Linux'],
    applyLink: 'https://careers.google.com',
    lastDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15),
    createdAt: new Date(),
    isActive: true
  },
  {
    title: 'React.js Developer Intern – TechStart Solutions',
    company: 'TechStart Solutions',
    location: 'Remote',
    type: 'Internship',
    experience: 'Freshers (0 years)',
    education: 'B.Tech/B.E/B.Sc/BCA (Any Branch)',
    batch: '2025 - 2026 Batch',
    salary: '₹12,000 to ₹18,000 / month',
    description: 'TechStart is hiring React.js interns. Join a 6-month remote internship and build front-end components for modern web applications.',
    jobDescription: `<h3>React.js Frontend Intern (Remote)</h3>
<p>TechStart Solutions builds high-speed SaaS tools. We are looking for a motivated React.js frontend intern to design, develop, and integrate user-facing modules using React, TailwindCSS, and state managers.</p>
<h4>What You Will Learn</h4>
<ul>
  <li>State management using Redux Toolkit and Context API.</li>
  <li>Integrating RESTful APIs and optimizing page layouts.</li>
  <li>Writing clean UI components with React hooks.</li>
</ul>`,
    responsibilities: [
      'Translate Figma mockups into pixel-perfect React components',
      'Integrate backend REST APIs with Axios/Fetch',
      'Conduct frontend testing and optimize assets for page load speeds'
    ],
    requirements: [
      'Proficiency in JavaScript (ES6+), HTML5, and CSS3',
      'Basic knowledge of React.js, hooks (useState, useEffect), and JSX',
      'Experience with Git/GitHub workflows'
    ],
    skills: ['React.js', 'JavaScript', 'TailwindCSS', 'Git', 'REST APIs', 'CSS'],
    applyLink: 'https://example.com/apply/techstart',
    lastDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 40),
    createdAt: new Date(),
    isActive: true
  }
];

// Generate more realistic jobs to make it a total of 40 quality posts
const techCompanies = [
  'LTIMindtree', 'Oracle India', 'Tech Mahindra', 'HCLTech', 'IBM India', 
  'Adobe India', 'Deloitte India', 'PwC India', 'EY India', 'KPMG India',
  'Salesforce India', 'Cisco India', 'Microsoft India', 'Genpact', 'Hexaware'
];

const jobTitles = [
  'Junior Full Stack Developer', 'Associate QA Automation Engineer', 'Cloud Infrastructure Associate',
  'Python Data Analyst', 'Salesforce Developer (Trainee)', 'Business Analyst Intern',
  'Junior UI/UX Designer', 'Network Support Engineer', 'Cyber Security Specialist Intern',
  'Technical Support Engineer', 'SQL Database Administrator Trainee', 'Content Writer & SEO Intern',
  'Mobile App Developer (Flutter/React Native)', 'Java Developer Intern', 'Embedded Systems Trainee'
];

const locations = ['Bangalore', 'Hyderabad', 'Pune', 'Noida', 'Chennai', 'Mumbai', 'Remote', 'Kolkata'];
const salaries = ['₹3.6 LPA', '₹4.2 LPA', '₹5.5 LPA', '₹6.0 LPA', '₹3.0 LPA', '₹4.8 LPA', '₹8.0 LPA'];

// Helper to randomize array selection
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Generate 30 additional randomized jobs
for (let i = 0; i < 30; i++) {
  const company = pick(techCompanies);
  const title = `${pick(jobTitles)} – ${company}`;
  const loc = pick(locations);
  const salary = pick(salaries);
  
  const techStack = ['Java', 'React', 'Node.js', 'Python', 'SQL', 'Docker', 'AWS', 'JavaScript', 'Django', 'Git', 'Tailwind'];
  const jobSkills = [pick(techStack), pick(techStack), pick(techStack), 'Problem Solving'];

  const cleanSlug = slugify(title, { lower: true, strict: true });

  sampleJobs.push({
    title,
    slug: `${cleanSlug}-${Date.now().toString().slice(-4)}`,
    company,
    location: loc,
    type: Math.random() > 0.3 ? 'Full-Time' : 'Internship',
    experience: Math.random() > 0.5 ? 'Freshers (0 years)' : '0-2 years',
    education: 'B.Tech/B.E/BCA/MCA/M.Sc',
    batch: '2024 - 2026 Batch',
    salary,
    description: `Exciting opportunity for freshers to work as a ${title.split(' – ')[0]} at ${company}. Expand your career horizons and build cutting-edge technical products.`,
    jobDescription: `<h3>Career Opportunity at ${company}</h3>
<p>We are seeking a proactive and enthusiastic ${title.split(' – ')[0]} to join our development center in ${loc}. In this role, you will collaborate with seasoned software engineers, help support enterprise deliverables, and build modern software services.</p>
<h4>Key Work Duties</h4>
<ul>
  <li>Write clear, structured, and modular code for app subsystems.</li>
  <li>Assist in system debugs, integration pipelines, and documentation.</li>
  <li>Engage in software testing and quality improvement activities.</li>
</ul>`,
    responsibilities: [
      'Execute code tasks under project manager guidelines',
      'Participate in technical design and testing workshops',
      'Resolve program issues and document updates'
    ],
    requirements: [
      'Basic knowledge of programming fundamentals and databases',
      'Good problem-solving mindset and logic skills',
      'Strong verbal and team collaboration capabilities'
    ],
    skills: jobSkills,
    applyLink: `https://example.com/apply/${company.toLowerCase().replace(/\s+/g, '')}`,
    lastDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * (20 + Math.floor(Math.random() * 30))),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * Math.floor(Math.random() * 10)),
    isActive: true
  });
}

// ── ADD SPECIAL POSTS FOR DYNAMIC SYLLABUS, RESULT, & ADMIT CARD HUBS ──
const specialPosts = [
  // ── SSC Syllabus ─────────────────────────────────────────────────────────────
  {
    title: 'SSC CGL Exam Syllabus 2026 – Tier 1 & Tier 2 Pattern PDF',
    company: 'Staff Selection Commission (SSC)',
    isGovernment: true,
    applyLink: 'https://ssc.gov.in',
    postType: 'Syllabus',
    description: 'Download the official Staff Selection Commission CGL syllabus for Tier 1 and Tier 2 CBT exams. Complete subject-wise topic list and marking scheme.',
    jobDescription: `<h3>SSC CGL Exam Syllabus & Pattern 2026</h3>
<p>The Staff Selection Commission (SSC) conducts the Combined Graduate Level (CGL) exam to recruit officers for Group B and Group C posts in various ministries and departments of the Government of India. Below is the detailed syllabus and pattern for Tier 1 and Tier 2.</p>
<h4>Tier 1 Exam Pattern</h4>
<ul>
  <li>General Intelligence & Reasoning: 25 Questions (50 Marks)</li>
  <li>General Awareness: 25 Questions (50 Marks)</li>
  <li>Quantitative Aptitude: 25 Questions (50 Marks)</li>
  <li>English Comprehension: 25 Questions (50 Marks)</li>
</ul>
<p>Total Time Duration: 60 minutes. There is a negative marking of 0.50 marks for each wrong answer.</p>
<h4>Tier 2 Exam Pattern</h4>
<p>Tier 2 consists of Paper-I (Compulsory for all posts) and Paper-II/III for specialized posts. Paper-I includes Mathematical Abilities, Reasoning, English Language, General Awareness, and Computer Knowledge modules.</p>`
  },
  {
    title: 'SSC CHSL Syllabus 2026 – Download Tier 1 & 2 CBT Syllabus PDF',
    company: 'Staff Selection Commission (SSC)',
    isGovernment: true,
    applyLink: 'https://ssc.gov.in',
    postType: 'Syllabus',
    description: 'Get the detailed syllabus for SSC CHSL (10+2) Tier 1 and Tier 2 written assessments. Subject wise topics for English, Quant, Reasoning, and GK.',
    jobDescription: `<h3>SSC CHSL Syllabus & Selection Scheme 2026</h3>
<p>Download the official Staff Selection Commission Combined Higher Secondary Level (CHSL) 10+2 exam syllabus. Learn about the CBT pattern, typing test rules, and subject-wise score weights.</p>`
  },
  {
    title: 'SSC MTS Exam Syllabus 2026 – Detailed Topic List & Marking Pattern',
    company: 'Staff Selection Commission (SSC)',
    isGovernment: true,
    applyLink: 'https://ssc.gov.in',
    postType: 'Syllabus',
    description: 'Official SSC Multi Tasking Staff (MTS) exam syllabus. Topic details for Numerical Ability, Reasoning, English, and General Awareness.',
    jobDescription: `<h3>SSC MTS Written Exam Syllabus 2026</h3>
<p>Get the complete syllabus for SSC MTS. The exam has two sessions: Session 1 (Quant & Reasoning - No negative marking) and Session 2 (English & GK - Negative marking of 1 mark per wrong answer).</p>`
  },

  // ── SSC Results ──────────────────────────────────────────────────────────────
  {
    title: 'SSC CGL Tier 1 Result 2026 – Download Merit List & Cut Off PDF',
    company: 'Staff Selection Commission (SSC)',
    isGovernment: true,
    applyLink: 'https://ssc.gov.in',
    postType: 'Result',
    description: 'Staff Selection Commission has declared the CGL Tier 1 written exam results. Access region wise merit lists and cut-off scores here.',
    jobDescription: `<h3>SSC CGL Tier 1 Exam Results 2026</h3>
<p>The Staff Selection Commission has officially released the results for the CGL Tier 1 CBT exam. Candidates who appeared for the exam can download the post-wise write-up and roll number merit lists.</p>
<h4>Category Wise Cut-Off Marks</h4>
<ul>
  <li>UR (General): 142.50</li>
  <li>OBC: 138.20</li>
  <li>EWS: 135.10</li>
  <li>SC: 119.80</li>
  <li>ST: 109.50</li>
</ul>`
  },
  {
    title: 'SSC GD Constable Written Exam Result 2026 – Selection Merit List',
    company: 'Staff Selection Commission (SSC)',
    isGovernment: true,
    applyLink: 'https://ssc.gov.in',
    postType: 'Result',
    description: 'Check SSC GD Constable CBT written test results, final state wise cut-off scores, and physical test eligibility merit lists.',
    jobDescription: `<h3>SSC GD Written Test Result & PET Cut Off 2026</h3>
<p>The merit list of candidates shortlisted for the Physical Efficiency Test (PET) and Physical Standard Test (PST) has been uploaded by the Staff Selection Commission. Direct PDF download links are available below.</p>`
  },

  // ── SSC Admit Cards ──────────────────────────────────────────────────────────
  {
    title: 'SSC CGL Tier 2 Admit Card 2026 – Region Wise Hall Ticket Links',
    company: 'Staff Selection Commission (SSC)',
    isGovernment: true,
    applyLink: 'https://ssc.gov.in',
    postType: 'Admit Card',
    description: 'Download Staff Selection Commission CGL Tier 2 written exam admit cards. CR, WR, NR, ER, SR, KKR, and MPR region hall ticket download links.',
    jobDescription: `<h3>SSC CGL Tier 2 Admit Card & Exam City Status 2026</h3>
<p>The Staff Selection Commission has activated the application status and admit card download links for the CGL Tier 2 CBT exam across all regional portals. Use your registration number and DOB to download.</p>`
  },
  {
    title: 'SSC GD Hall Ticket 2026 – Download regional Call Letter status',
    company: 'Staff Selection Commission (SSC)',
    isGovernment: true,
    applyLink: 'https://ssc.gov.in',
    postType: 'Admit Card',
    description: 'Download regional call letters for SSC GD Constable recruitment CBT. Direct region wise download links.',
    jobDescription: `<h3>SSC GD Constable Call Letter 2026</h3>
<p>Get regional call letters for the general duty constable computer-based examination. Keep your registration ID and password ready to download your hall ticket.</p>`
  },

  // ── Railway Syllabus ─────────────────────────────────────────────────────────
  {
    title: 'Railway RRB NTPC CBT 1 & 2 Syllabus 2026 – Download PDF',
    company: 'Railway Recruitment Board (RRB)',
    isGovernment: true,
    applyLink: 'https://indianrailways.gov.in',
    postType: 'Syllabus',
    description: 'Detailed syllabus and CBT exam pattern for RRB NTPC Graduate and Under Graduate posts. Subject wise marking for Maths, General Intelligence, and GK.',
    jobDescription: `<h3>RRB NTPC Exam Syllabus & CBT Schemes 2026</h3>
<p>Get the complete syllabus for Railway Recruitment Board Non-Technical Popular Categories (NTPC) recruitment CBT exams. CBT 1 contains 100 questions and CBT 2 contains 120 questions. Subject-wise topics are listed below.</p>`
  },
  {
    title: 'Railway RRB Group D CBT Exam Syllabus 2026 – Topic Wise List',
    company: 'Railway Recruitment Board (RRB)',
    isGovernment: true,
    applyLink: 'https://indianrailways.gov.in',
    postType: 'Syllabus',
    description: 'Download the official RRB RRC Group D CBT syllabus. Marks distribution for General Science, Mathematics, General Intelligence, and Current Affairs.',
    jobDescription: `<h3>RRB Group D CBT Syllabus & PET Criteria 2026</h3>
<p>Comprehensive subject details and PET standards for RRC Group D recruitment. 90-minute CBT contains 100 questions. Science syllabus matches standard CBSE class 10th level.</p>`
  },

  // ── Railway Results ──────────────────────────────────────────────────────────
  {
    title: 'Railway RRB NTPC CBT 1 Result 2026 – Merit List & Cut Offs',
    company: 'Railway Recruitment Board (RRB)',
    isGovernment: true,
    applyLink: 'https://indianrailways.gov.in',
    postType: 'Result',
    description: 'Railway Recruitment Board has officially announced the RRB NTPC CBT 1 results. Access zone wise scorecards and cut-off scores here.',
    jobDescription: `<h3>RRB NTPC CBT 1 Written Exam Results 2026</h3>
<p>The results for NTPC Computer Based Test 1 have been released by the Railway Recruitment Boards (RRB). Candidates can check their shortlist status for CBT 2 by searching their roll numbers in the PDF list.</p>`
  },
  {
    title: 'Railway RRB ALP CBT 1 Result 2026 – Shortlisted candidates list',
    company: 'Railway Recruitment Board (RRB)',
    isGovernment: true,
    applyLink: 'https://indianrailways.gov.in',
    postType: 'Result',
    description: 'Download zone wise lists of candidates shortlisted for Assistant Loco Pilot (ALP) CBT 2 exam. Scorecards and cut-off analysis.',
    jobDescription: `<h3>RRB ALP CBT 1 Selection Result 2026</h3>
<p>Zone wise result files for the Assistant Loco Pilot CBT 1 exam are now available for download. Access the list of roll numbers qualified for CBT 2.</p>`
  },

  // ── Railway Admit Cards ──────────────────────────────────────────────────────
  {
    title: 'Railway RRB NTPC Admit Card 2026 – Zone Wise CBT Hall Tickets',
    company: 'Railway Recruitment Board (RRB)',
    isGovernment: true,
    applyLink: 'https://indianrailways.gov.in',
    postType: 'Admit Card',
    description: 'Get direct links to download RRB NTPC CBT hall tickets and view exam city status for graduate and under-graduate exams.',
    jobDescription: `<h3>RRB NTPC CBT Hall Ticket & Exam Travel Pass 2026</h3>
<p>Download the RRB NTPC CBT admit card. SC/ST candidates can also download their free travel authorization pass. Hall tickets are active 4 days before the exam date.</p>`
  },
  {
    title: 'Railway RRB Group D CBT Admit Card 2026 – Hall Ticket Download Link',
    company: 'Railway Recruitment Board (RRB)',
    isGovernment: true,
    applyLink: 'https://indianrailways.gov.in',
    postType: 'Admit Card',
    description: 'Link to download hall tickets for Railway Group D computer based examination. Access exam date and venue details here.',
    jobDescription: `<h3>RRB Group D CBT Hall Ticket 2026</h3>
<p>Download your exam hall ticket for the RRC Group D written test. Access direct link, enter your registration ID and download call letter.</p>`
  }
];

// Append special posts to the sampleJobs array
specialPosts.forEach(post => {
  const cleanSlug = slugify(post.title, { lower: true, strict: true });
  sampleJobs.push({
    ...post,
    slug: `${cleanSlug}-${Date.now().toString().slice(-4)}`,
    location: 'Across India',
    type: 'Full-Time',
    experience: 'Freshers',
    education: 'Graduate / 12th Pass',
    createdAt: new Date(),
    isActive: true
  });
});

async function seedJobs() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected!');

    // First delete existing jobs if any, to avoid conflicts and start clean
    const count = await Job.countDocuments();
    console.log(`Current jobs count in database: ${count}`);
    
    // Stagger createdAt dates to look natural (30 min increments, within 8 days to avoid TTL expiry)
    sampleJobs.forEach((job, index) => {
      job.createdAt = new Date(Date.now() - index * 30 * 60 * 1000);
    });

    console.log('Inserting 40 high-quality sample jobs and 13 special hub updates...');
    await Job.create(sampleJobs);
    
    const newCount = await Job.countDocuments();
    console.log(`✅ Success! Database populated with ${newCount} total items.`);
    
  } catch (error) {
    console.error('❌ Error seeding jobs:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Database disconnected.');
  }
}

seedJobs();
