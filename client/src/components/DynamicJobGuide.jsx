import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// ─────────────────────────────────────────────────────────────────────────────
// Skill-based preparation strategy lookup
// Maps a technology/subject keyword → specific, actionable prep advice
// ─────────────────────────────────────────────────────────────────────────────
const SKILL_PREP_MAP = {
  // Programming Languages
  java: {
    label: 'Java',
    tips: [
      'Master OOP fundamentals — classes, interfaces, inheritance, polymorphism, and encapsulation.',
      'Study Java Collections Framework deeply: ArrayList, HashMap, LinkedList, TreeMap, and their time complexities.',
      'Practice common design patterns: Singleton, Factory, Observer, and Builder.',
      'Understand Java memory management — Stack vs Heap, garbage collection, and weak/soft references.',
      'Revise multi-threading: synchronized blocks, volatile, ReentrantLock, ExecutorService, and CompletableFuture.',
    ]
  },
  python: {
    label: 'Python',
    tips: [
      'Practice Python data structures thoroughly: lists, tuples, sets, dictionaries, and comprehensions.',
      'Learn Python decorators, generators, context managers, and metaclasses for advanced positions.',
      'Study NumPy and Pandas for data manipulation if applying for data/ML roles.',
      'Build at least 2 end-to-end projects using Flask or FastAPI for backend positions.',
      'Review Python\'s asyncio, threading, and multiprocessing for performance-critical roles.',
    ]
  },
  javascript: {
    label: 'JavaScript',
    tips: [
      'Master ES6+ features: arrow functions, destructuring, spread/rest, optional chaining, and Promises.',
      'Understand JavaScript\'s event loop, call stack, and asynchronous patterns (async/await).',
      'Practice DOM manipulation and browser APIs extensively.',
      'Learn module bundlers: Webpack, Vite, and esbuild basics.',
      'Study JavaScript design patterns — Module, Revealing Module, Observer, and Singleton.',
    ]
  },
  react: {
    label: 'React',
    tips: [
      'Master React hooks thoroughly: useState, useEffect, useContext, useReducer, useMemo, and useCallback.',
      'Understand React\'s virtual DOM diffing algorithm and reconciliation process.',
      'Practice state management with Context API, Redux Toolkit, and Zustand.',
      'Build and deploy a production-quality project using React + API integration.',
      'Learn React performance optimization: React.memo, lazy loading, Suspense, and code splitting.',
    ]
  },
  'node.js': {
    label: 'Node.js',
    tips: [
      'Understand Node.js event loop, streams, and non-blocking I/O architecture.',
      'Build RESTful APIs using Express.js with proper middleware, error handling, and authentication.',
      'Practice with JWT-based authentication, bcrypt hashing, and session management.',
      'Study Node.js cluster module and PM2 for production deployment.',
      'Learn database integration patterns with MongoDB (Mongoose) and PostgreSQL (Sequelize/Prisma).',
    ]
  },
  mongodb: {
    label: 'MongoDB',
    tips: [
      'Master CRUD operations and MongoDB query operators ($gte, $in, $regex, $elemMatch).',
      'Practice aggregation pipeline stages: $match, $group, $project, $lookup, and $unwind.',
      'Understand indexing strategies — single field, compound, text, and geospatial indexes.',
      'Study MongoDB schema design: embedding vs referencing, and when to use each pattern.',
      'Practice database transactions with multi-document ACID support in MongoDB 4.0+.',
    ]
  },
  sql: {
    label: 'SQL',
    tips: [
      'Master all types of JOINs: INNER, LEFT, RIGHT, FULL OUTER, CROSS, and SELF JOIN with practical examples.',
      'Practice complex aggregate queries using GROUP BY, HAVING, ROLLUP, and window functions (RANK, ROW_NUMBER, LAG, LEAD).',
      'Understand query optimization — execution plans, index types (B-tree, Hash, Composite), and query hints.',
      'Learn stored procedures, functions, triggers, and views.',
      'Practice normalization up to 3NF and understand when to denormalize for performance.',
    ]
  },
  aws: {
    label: 'AWS',
    tips: [
      'Study core AWS services in depth: EC2, S3, RDS, Lambda, CloudFront, Route53, and IAM.',
      'Understand VPC architecture — subnets, security groups, NACLs, and internet/NAT gateways.',
      'Practice infrastructure-as-code using CloudFormation or Terraform.',
      'Learn serverless architecture patterns using Lambda + API Gateway + DynamoDB.',
      'Prepare for AWS Certified Solutions Architect (Associate) — the most recognized cloud certification.',
    ]
  },
  docker: {
    label: 'Docker',
    tips: [
      'Master Docker fundamentals: images, containers, volumes, networks, and Dockerfile writing.',
      'Practice multi-stage Docker builds for production-optimized images.',
      'Learn Docker Compose for multi-service orchestration in development environments.',
      'Understand container security: running as non-root, image scanning, and secrets management.',
      'Study the transition from Docker Compose to Kubernetes for container orchestration at scale.',
    ]
  },
  kubernetes: {
    label: 'Kubernetes',
    tips: [
      'Master Kubernetes core concepts: Pods, Deployments, Services, ConfigMaps, Secrets, and Namespaces.',
      'Practice with kubectl commands for resource management, scaling, and rolling updates.',
      'Understand Kubernetes networking: ClusterIP, NodePort, LoadBalancer, and Ingress controllers.',
      'Study Helm charts for packaging and deploying Kubernetes applications.',
      'Learn resource limits, requests, HPA (Horizontal Pod Autoscaler), and node affinity.',
    ]
  },
  // Government exam subjects
  quantitative: {
    label: 'Quantitative Aptitude',
    tips: [
      'Focus first on high-weight topics: Percentage, Ratio & Proportion, Simple & Compound Interest, and Time-Work-Speed.',
      'Use R.S. Aggarwal Quantitative Aptitude as the primary reference — chapter-by-chapter study.',
      'Practice 30-40 MCQs daily under timed conditions to build calculation speed.',
      'Memorize table up to 25, squares up to 30, cubes up to 15, and common fraction-decimal equivalents.',
      'Analyze previous year papers topic-wise to identify the highest frequency question types.',
    ]
  },
  reasoning: {
    label: 'Logical Reasoning',
    tips: [
      'Start with easy, high-score topics: Analogy, Classification, Series, Blood Relations, and Direction Tests.',
      'Practice Seating Arrangement (Circular & Linear) and Puzzle sets daily — these carry 8-10 marks in most exams.',
      'Use M.K. Pandey Analytical & Logical Reasoning for systematic topic coverage.',
      'Attempt at least one full-length reasoning section test every 2-3 days.',
      'Review previous year papers to identify the exact difficulty gradient expected in your target exam.',
    ]
  },
  'general knowledge': {
    label: 'General Knowledge & Current Affairs',
    tips: [
      'Read one national newspaper daily — The Hindu or Indian Express — focusing on national, international, and economic sections.',
      'Use Lucent\'s General Knowledge for comprehensive static GK revision (Geography, History, Polity, Economy, Science).',
      'Maintain a 90-day current affairs diary noting key appointments, awards, summits, and government schemes.',
      'Practice monthly current affairs MCQ compilations from trusted platforms like GKToday or Vision IAS.',
      'Pay special attention to government schemes, budget highlights, and national statistical data for the exam year.',
    ]
  },
  english: {
    label: 'English Language',
    tips: [
      'Build vocabulary systematically: 15 new words daily with usage examples and antonyms.',
      'Practice Reading Comprehension passages under 12-minute limits — speed and comprehension go together.',
      'Master error-spotting: focus on subject-verb agreement, tense consistency, and correct preposition usage.',
      'Study sentence rearrangement (Para-jumbles) and cloze test patterns from previous year SSC/Banking papers.',
      'Use Wren & Martin for grammar rules and S.P. Bakshi for a comprehensive English preparation resource.',
    ]
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Career path generator based on job type
// ─────────────────────────────────────────────────────────────────────────────
function getCareerPath(job) {
  const title = (job.title || '').toLowerCase();
  const isGovt = job.isGovernment;
  const skills = (job.skills || []).map(s => s.toLowerCase());

  if (isGovt) {
    if (title.includes('constable') || title.includes('police')) {
      return {
        stages: ['Constable', 'Head Constable', 'Assistant Sub-Inspector (ASI)', 'Sub-Inspector (SI)', 'Inspector', 'Deputy Superintendent of Police (DSP)'],
        timeline: 'Constable to Inspector typically requires 12–18 years of service with departmental exam clearance at each promotion stage.',
        benefits: 'Uniform allowance, free medical for self and dependents, government quarters, pension under NPS, and 30 days paid leave annually.'
      };
    }
    if (title.includes('teacher') || title.includes('tgt') || title.includes('pgt') || title.includes('lecturer')) {
      return {
        stages: ['Assistant Teacher / TGT', 'Senior Teacher / PGT', 'Head of Department', 'Vice Principal', 'Principal', 'Education Officer'],
        timeline: 'TGT to Principal typically requires 15–22 years of service, enhanced by academic qualifications (B.Ed, M.Ed, Ph.D.) and departmental examinations.',
        benefits: 'Academic autonomy, summer and winter vacations (paid leave), medical coverage, government housing eligibility, and NPS pension.'
      };
    }
    if (title.includes('clerk') || title.includes('ldc') || title.includes('udc') || title.includes('assistant')) {
      return {
        stages: ['Lower Division Clerk (LDC)', 'Upper Division Clerk (UDC)', 'Assistant Section Officer', 'Section Officer', 'Under Secretary', 'Deputy Secretary'],
        timeline: 'LDC to Section Officer takes approximately 10–15 years via seniority and departmental limited competitive examinations (LDCE).',
        benefits: 'Central government medical scheme (CGHS), LTC (Leave Travel Concession), HRA, DA, and defined contribution pension under NPS.'
      };
    }
    if (title.includes('inspector') || title.includes('officer') || title.includes('cgl')) {
      return {
        stages: ['Inspector (Entry Level)', 'Senior Inspector', 'Superintendent', 'Deputy Commissioner', 'Joint Commissioner', 'Commissioner'],
        timeline: 'Inspector to Commissioner level can take 20–25 years, accelerated by clearing departmental promotion exams and posting performance.',
        benefits: 'Official vehicle, HRA, DA, departmental medical, LTC for family, subsidized canteen, and post-retirement gratuity and pension.'
      };
    }
    return {
      stages: ['Junior Level (Group C)', 'Senior Level (Group B Non-Gazetted)', 'Gazetted Officer (Group B/A)', 'Senior Officer', 'Director / Joint Secretary', 'Secretary Level'],
      timeline: 'Entry to senior levels in government typically takes 15–25 years via seniority promotions, departmental exams, and UPSC Limited Departmental Exams.',
      benefits: 'Job security for life, pension, free medical, HRA, DA, LTC, official housing eligibility, subsidized transport, and canteen facilities.'
    };
  }

  // Private tech company career paths
  const hasEngSkills = skills.some(s => ['react', 'node', 'java', 'python', 'javascript', 'aws', 'docker', 'kubernetes', 'sql'].includes(s));
  if (hasEngSkills) {
    return {
      stages: ['Associate / Junior Engineer', 'Software Engineer (SE)', 'Senior Software Engineer (SSE)', 'Lead Engineer / Tech Lead', 'Engineering Manager', 'Director of Engineering / VP Engineering'],
      timeline: 'Associate to Senior Engineer typically takes 3–6 years based on performance ratings, technical contributions, and promotion cycles (usually annual).',
      benefits: 'Variable pay (performance bonus), ESOPs/RSUs, health insurance for family, PF + gratuity, flexible WFH policy, and learning & development budget.'
    };
  }
  return {
    stages: ['Entry Level / Trainee', 'Executive / Analyst', 'Senior Executive / Senior Analyst', 'Assistant Manager / Lead', 'Manager', 'Senior Manager / Associate Director'],
    timeline: 'Entry level to Manager typically takes 5–10 years based on performance, cross-functional experience, and business impact.',
    benefits: 'Annual performance bonus, health & life insurance, PF + gratuity, paid leaves, and career development programs.'
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// FAQ generator
// ─────────────────────────────────────────────────────────────────────────────
function generateFAQs(job) {
  const title = job.title || 'this position';
  const company = job.company || 'the organization';
  const location = job.location || 'India';
  const isGovt = job.isGovernment;
  const lastDate = job.lastDate ? new Date(job.lastDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : null;

  const faqs = [];

  // Universal FAQs
  faqs.push({
    q: `What is the last date to apply for ${title} at ${company}?`,
    a: lastDate
      ? `The last date to submit applications for this position is ${lastDate}. We strongly recommend applying at least 3–5 days before the deadline to avoid server load issues and last-minute technical problems.`
      : `Please refer to the official notification PDF linked above for the exact application closing date. Application portals frequently experience high traffic near deadlines — always apply at least 2-3 days in advance.`
  });

  faqs.push({
    q: `Is there an application fee for ${title}?`,
    a: isGovt
      ? `Application fees vary by recruitment board. Government notifications typically have fees ranging from ₹0 (for SC/ST/Women/PwD) to ₹100–₹500 for other categories. The exact fee and exemption details are specified in the official notification PDF. Always pay fees only through official government payment portals — never through informal payment channels.`
      : `Private sector positions generally do not charge application fees. If any intermediary requests a fee to "process" your application for ${company}, it is a scam. Legitimate companies never charge candidates for applying or interviewing.`
  });

  faqs.push({
    q: `What documents are required for the application?`,
    a: `Standard documents typically required include: (1) Class 10 and 12 mark sheets and certificates, (2) Graduation/Post-graduation degree certificates, (3) Relevant experience certificates, (4) Recent passport-size photographs, (5) Government-issued photo ID (Aadhaar, PAN, or Passport), (6) Caste/category certificates if applicable, and (7) Any skill-specific certifications relevant to ${title}. Always refer to the official notification for the specific document list and prescribed formats.`
  });

  if (isGovt) {
    faqs.push({
      q: `What is the selection process for this government position?`,
      a: `Most government recruitment drives follow a multi-stage selection process: (1) Written Examination — objective or descriptive, testing general awareness, quantitative aptitude, reasoning, and domain knowledge. (2) Physical/Skill Test — for specific posts requiring physical fitness or typing/computer skills. (3) Personal Interview — for Group A and B officer posts. (4) Document Verification — confirming educational and category documents. (5) Medical Fitness Examination. Each stage's qualifying marks are specified in the official notification.`
    });
    faqs.push({
      q: `Are candidates from other states eligible to apply?`,
      a: `For central government positions, candidates from all states are eligible without restriction. For state government positions, most posts accept all Indian citizens but category-based reservations and age relaxations apply only to the state's domicile candidates. Some posts carry a specific state domicile requirement — this will be explicitly mentioned in the official notification.`
    });
  } else {
    faqs.push({
      q: `How many interview rounds does ${company} typically conduct?`,
      a: `Private sector companies typically conduct 3–5 rounds: (1) Resume/Application Screening, (2) Online Assessment (aptitude + coding/domain test), (3) Technical Interview Round 1 (problem-solving, technical concepts), (4) Technical Interview Round 2 (system design or advanced domain questions), and (5) HR Round (salary discussion, culture fit, background verification). Rounds may vary by role level and team.`
    });
    faqs.push({
      q: `Can I negotiate the offered salary for this position?`,
      a: `Yes — salary negotiation is expected and encouraged in the private sector. Research the typical compensation range for ${title} in ${location} on platforms like Glassdoor, AmbitionBox, and LinkedIn Salary before interviews. Negotiate based on your experience, skills, competing offers, and market data. Companies generally have a 10–20% flexibility above the initial offer for strong candidates.`
    });
  }

  faqs.push({
    q: `How do I stay updated if the application date is extended or the notification changes?`,
    a: `Bookmark this page — NextJobPost monitors all active notifications and updates them immediately when official changes are announced. You can also join our Telegram channel (@nextjobpost) or enable browser push notifications to receive real-time alerts. All updates are cross-verified with the official source before publication.`
  });

  return faqs;
}

// ─────────────────────────────────────────────────────────────────────────────
// Common mistakes generator
// ─────────────────────────────────────────────────────────────────────────────
function getCommonMistakes(job) {
  const isGovt = job.isGovernment;
  const common = [
    'Not reading the complete official notification PDF before applying — eligibility criteria have specific nuances that differ from the headline summary.',
    'Uploading documents in wrong formats or sizes — many portals reject applications with photo or signature files outside the specified dimensions and KB limits.',
    'Missing the application deadline by even one minute — government portals close exactly at the specified time with no exceptions.',
    'Providing incorrect personal details (spelling of name, date of birth, category) that do not match your official documents — these discrepancies cause rejection at document verification.',
  ];
  if (isGovt) {
    common.push('Applying without verifying you meet the age limit — applications that appear complete are rejected at the DV stage if age criteria are not met.');
    common.push('Not printing and saving the application confirmation number and fee receipt — these are required for hall ticket download and later reference.');
    common.push('Relying on third-party coaching centre summaries of the notification rather than reading the official PDF — errors in secondary sources are common.');
  } else {
    common.push('Submitting a generic resume without customizing it for the specific role and company — ATS systems rank tailored resumes significantly higher.');
    common.push('Applying without verifying you meet the minimum experience requirement — over-applying weakens your profile in applicant tracking systems.');
    common.push('Not following up after the interview — a polite thank-you email 24 hours after an interview demonstrates professionalism and keeps you top-of-mind.');
  }
  return common;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main DynamicJobGuide Component
// ─────────────────────────────────────────────────────────────────────────────
export default function DynamicJobGuide({ job, themeColor }) {
  const [openFaq, setOpenFaq] = useState(null);
  if (!job) return null;

  const careerPath = getCareerPath(job);
  const color = themeColor || '#2563eb';

  // Use custom FAQs if populated in DB, otherwise generate defaults
  const faqs = (job.faqs && job.faqs.length > 0) ? job.faqs : generateFAQs(job);

  // Parse mistakes from finalThoughts if it contains a list, otherwise generate defaults
  let mistakes = getCommonMistakes(job);
  if (job.finalThoughts && job.finalThoughts.toLowerCase().includes('mistake')) {
    const lines = job.finalThoughts.split('\n');
    const parsed = lines
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .filter(line => line && !line.toLowerCase().includes('mistakes to avoid') && line.length > 8);
    if (parsed.length > 0) {
      mistakes = parsed;
    }
  }


  // Build prep tips from job skills
  const skills = (job.skills || []).map(s => s.toLowerCase());
  const matchedSkills = Object.entries(SKILL_PREP_MAP).filter(([key]) =>
    skills.some(skill => skill.includes(key) || key.includes(skill))
  );
  // Fallback for govt jobs with no tech skills
  const govtFallbackSkills = [];
  if (job.isGovernment && matchedSkills.length === 0) {
    govtFallbackSkills.push(['quantitative', SKILL_PREP_MAP.quantitative]);
    govtFallbackSkills.push(['reasoning', SKILL_PREP_MAP.reasoning]);
    govtFallbackSkills.push(['general knowledge', SKILL_PREP_MAP['general knowledge']]);
    govtFallbackSkills.push(['english', SKILL_PREP_MAP.english]);
  }
  const prepSkills = matchedSkills.length > 0 ? matchedSkills.slice(0, 3) : govtFallbackSkills.slice(0, 3);

  const sectionStyle = {
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '16px',
    padding: '2rem',
    marginBottom: '1.75rem',
    boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
  };

  const headerStyle = {
    fontWeight: '800',
    color: '#1e293b',
    fontSize: '1.15rem',
    marginBottom: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  };

  return (
    <div style={{ marginTop: '2rem' }}>

      {/* ── CAREER GROWTH PATH ── */}
      <div style={sectionStyle}>
        <h2 style={headerStyle}>
          <span>🚀</span> Career Growth &amp; Promotion Pathway
        </h2>
        <p style={{ color: '#475569', fontSize: '0.94rem', lineHeight: '1.75', marginBottom: '1.25rem' }}>
          {careerPath.timeline}
        </p>
        {/* Visual stages */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem', alignItems: 'center' }}>
          {careerPath.stages.map((stage, i) => (
            <React.Fragment key={stage}>
              <div style={{
                background: i === 0 ? color : `${color}18`,
                color: i === 0 ? '#fff' : color,
                border: `1.5px solid ${color}40`,
                borderRadius: '8px',
                padding: '0.45rem 0.85rem',
                fontWeight: '700',
                fontSize: '0.82rem',
                whiteSpace: 'nowrap'
              }}>
                {stage}
              </div>
              {i < careerPath.stages.length - 1 && (
                <span style={{ color: '#94a3b8', fontWeight: '800', fontSize: '1rem' }}>→</span>
              )}
            </React.Fragment>
          ))}
        </div>
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem 1.25rem' }}>
          <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.88rem', marginBottom: '0.35rem' }}>💼 Benefits &amp; Perks</div>
          <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: '1.7', margin: 0 }}>{careerPath.benefits}</p>
        </div>
      </div>

      {/* ── SKILLS-BASED PREPARATION STRATEGY ── */}
      {prepSkills.length > 0 && (
        <div style={sectionStyle}>
          <h2 style={headerStyle}>
            <span>📖</span> Preparation Strategy for This Role
          </h2>
          <p style={{ color: '#475569', fontSize: '0.94rem', lineHeight: '1.75', marginBottom: '1.25rem' }}>
            Based on the skills and competencies required for <strong>{job.title}</strong>, here is your targeted preparation roadmap:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {prepSkills.map(([key, skill]) => (
              <div key={key} style={{ background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <div style={{
                  background: `${color}12`,
                  borderBottom: `1px solid ${color}25`,
                  padding: '0.75rem 1.1rem',
                  fontWeight: '800',
                  fontSize: '0.9rem',
                  color: color
                }}>
                  🎯 {skill.label} Preparation
                </div>
                <ul style={{ margin: 0, padding: '1rem 1.25rem 0.5rem', paddingLeft: '2rem', color: '#475569', fontSize: '0.88rem', lineHeight: '1.8' }}>
                  {skill.tips.map((tip, i) => <li key={i} style={{ marginBottom: '0.35rem' }}>{tip}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── REQUIRED DOCUMENTS CHECKLIST ── */}
      <div style={sectionStyle}>
        <h2 style={headerStyle}>
          <span>📋</span> Application Documents Checklist
        </h2>
        <p style={{ color: '#475569', fontSize: '0.94rem', lineHeight: '1.75', marginBottom: '1rem' }}>
          Prepare the following documents before starting your application to avoid interruptions:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.65rem' }}>
          {[
            { icon: '📄', doc: '10th class mark sheet & certificate (original + self-attested copy)' },
            { icon: '📄', doc: '12th class mark sheet & certificate (original + self-attested copy)' },
            { icon: '🎓', doc: 'Graduation / Post-graduation degree certificate (original + copy)' },
            { icon: '🪪', doc: 'Government photo ID: Aadhaar card, PAN card, or Passport' },
            { icon: '🖼️', doc: 'Recent passport-size photographs (white/blue background, JPEG, 20–50KB)' },
            { icon: '✍️', doc: 'Scanned signature (black ink on white paper, 10–30KB)' },
            ...(job.isGovernment ? [
              { icon: '📜', doc: 'Caste / Category certificate from competent authority (if applicable)' },
              { icon: '🏠', doc: 'Domicile / Residence certificate (for state government posts)' },
              { icon: '♿', doc: 'PwD certificate from medical board (if claiming disability relaxation)' },
            ] : [
              { icon: '📃', doc: 'Updated resume / CV (PDF format, maximum 2MB)' },
              { icon: '💼', doc: 'Previous employer experience letters (if applicable)' },
              { icon: '🏆', doc: 'Skill certifications relevant to the role (AWS, Google, Coursera, etc.)' },
            ]),
          ].map(({ icon, doc }) => (
            <div key={doc} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.6rem',
              padding: '0.65rem 0.85rem',
              background: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontSize: '0.84rem',
              color: '#374151',
              lineHeight: '1.5'
            }}>
              <span style={{ flexShrink: 0 }}>{icon}</span>
              <span>{doc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── COMMON MISTAKES ── */}
      <div style={sectionStyle}>
        <h2 style={headerStyle}>
          <span>⚠️</span> Common Application Mistakes to Avoid
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {mistakes.map((mistake, i) => (
            <div key={i} style={{
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-start',
              padding: '0.85rem 1rem',
              background: '#fef9f0',
              border: '1px solid #fed7aa',
              borderRadius: '10px'
            }}>
              <span style={{ flexShrink: 0, fontWeight: '900', fontSize: '0.9rem', color: '#d97706', marginTop: '1px' }}>{i + 1}.</span>
              <p style={{ margin: 0, color: '#92400e', fontSize: '0.9rem', lineHeight: '1.65' }}>{mistake}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── DYNAMIC FAQs ── */}
      <div style={sectionStyle}>
        <h2 style={headerStyle}>
          <span>❓</span> Frequently Asked Questions
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqs.map((faq, i) => (
            <div
              key={i}
              style={{
                border: `1px solid ${openFaq === i ? color + '50' : '#e2e8f0'}`,
                borderRadius: '10px',
                overflow: 'hidden',
                transition: 'border-color 0.2s'
              }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: '100%',
                  background: openFaq === i ? `${color}08` : '#f8fafc',
                  border: 'none',
                  padding: '1rem 1.1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  textAlign: 'left',
                  gap: '0.75rem',
                  transition: 'background 0.2s'
                }}
              >
                <span style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.93rem', lineHeight: '1.4' }}>
                  {faq.q}
                </span>
                <span style={{
                  flexShrink: 0,
                  color: color,
                  fontWeight: '900',
                  fontSize: '1.2rem',
                  transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s'
                }}>
                  +
                </span>
              </button>
              {openFaq === i && (
                <div style={{ padding: '0.85rem 1.1rem 1rem', borderTop: '1px solid #e2e8f0', background: '#fff' }}>
                  <p style={{ margin: 0, color: '#475569', fontSize: '0.9rem', lineHeight: '1.75' }}>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── FACT-CHECKING BADGE ── */}
      <div style={{
        background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)',
        border: '1px solid #86efac',
        borderRadius: '14px',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1rem',
        marginBottom: '1.75rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ fontSize: '2rem', flexShrink: 0 }}>✅</div>
        <div>
          <div style={{ fontWeight: '800', color: '#166534', fontSize: '0.95rem', marginBottom: '0.3rem' }}>
            Verified &amp; Fact-Checked by NextJobPost Editorial Team
          </div>
          <p style={{ color: '#166534', fontSize: '0.86rem', lineHeight: '1.65', margin: '0 0 0.5rem' }}>
            This notification has been cross-verified against the official recruitment source. Application and PDF links have been tested and redirect to official portals only. All eligibility, salary, and date details have been extracted directly from the official notification document.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/fact-checking-policy" style={{ color: '#15803d', fontWeight: '700', fontSize: '0.82rem', textDecoration: 'underline' }}>
              Our Fact-Checking Process →
            </Link>
            <Link to="/correction-policy" style={{ color: '#15803d', fontWeight: '700', fontSize: '0.82rem', textDecoration: 'underline' }}>
              Report an Inaccuracy
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
