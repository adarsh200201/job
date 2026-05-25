import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function StudentCareerCenter() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "1. Skill Foundation",
      subtitle: "Focus on building a core tech stack & basic projects.",
      tasks: [
        "Master 1 core language (JavaScript, Python, Java, or C++)",
        "Understand basic DSA (Data Structures & Algorithms)",
        "Build 3 mini-projects (portfolio-ready)",
        "Set up a professional GitHub profile & learn Git"
      ]
    },
    {
      title: "2. Profile & Branding",
      subtitle: "Optimize your resume, LinkedIn, and presence.",
      tasks: [
        "Create an ATS-friendly, clean resume (no icons or multi-columns)",
        "Write a compelling LinkedIn headline & About summary",
        "Document your project builds with README files & architecture diagrams",
        "Contribute to open source or local volunteer tech work"
      ]
    },
    {
      title: "3. Internship Hunting",
      subtitle: "Apply strategically and build real experience.",
      tasks: [
        "Apply to 5-10 targeted internship openings daily",
        "Write personalized cold-outreach emails to hiring managers",
        "Prepare for technical interviews (Leetcode easy/medium, OOP concepts)",
        "Perform mock interviews and practice detailing your project architecture"
      ]
    },
    {
      title: "4. Full-Time Conversion",
      subtitle: "Leverage your internship and network into a full-time role.",
      tasks: [
        "Request regular feedback during internships and implement suggestions",
        "Exceed project goals and document your contributions & business impact",
        "Network across teams inside the company to find internal openings",
        "Prepare final presentations of your work to senior leadership"
      ]
    }
  ];

  const resumeTemplates = [
    {
      id: "ats-minimalist",
      name: "ATS-Friendly Minimalist",
      desc: "Single-column, standard headings, optimized for automated screening engines.",
      content: `[Your Name] | [Your Email] | [Your Phone] | [LinkedIn Link] | [GitHub Link]

SUMMARY
Motivated software engineer with experience building full-stack web applications. Skilled in React, Node.js, and MongoDB. Proven ability to solve complex problems and write clean, scalable code.

EXPERIENCE
Software Engineer Intern | Tech Corp (June 2025 - Present)
- Developed and shipped 3 key React dashboard features, reducing load times by 20%.
- Integrated REST APIs with Mongoose, ensuring data validation and security protocols.
- Assisted in unit testing coverage, increasing backend test suite coverage by 15%.

PROJECTS
Job Board Portal (React, Express, Node.js)
- Implemented full-stack user authentication using JWT and Passport Google OAuth.
- Engineered responsive job-search dashboard with filtering and mobile-first layouts.
- Integrated Cloudinary API for secure employer logo uploads and storage.

EDUCATION
B.S. Computer Science | Tech University (Expected Graduation: May 2026)
- GPA: 3.8/4.0 | Coursework: Data Structures, Web Development, Databases.`
    },
    {
      id: "tech-creative",
      name: "Modern Tech Creative",
      desc: "Clean layout, accent coloring, ideal for sharing with recruiters and startups.",
      content: `====================================================
  [Your Name] | Portfolio: [Link] | [Email] | [Phone]
====================================================

CORE STACKS
Frontend: React, Redux, HTML5, CSS3, TailwindCSS
Backend: Node.js, Express, PostgreSQL, MongoDB, JWT
Tools: Git, Docker, AWS (S3, EC2), Jest, Vite

HIGHLIGHTED PROJECTS
-------------------------------------------
1. Job Search Automator Bot (Python, Pillow)
- Automated image generation of job advertisements with Pillow dynamic rendering.
- Programmed automatic wake-up and retry exponential backoff for server cold starts.
- Scheduled scripts posting advertisements on Twitter, Telegram, and LinkedIn APIs.

2. Real-Time Chat Application (React, Socket.io)
- Orchestrated web socket connections ensuring sub-50ms message latency.
- Structured PostgreSQL database for storing user history, groups, and logs.

RECENT WORK HISTORY
-------------------------------------------
Junior Web Developer | Innovate Web LLC (Oct 2024 - May 2025)
- Collaborated in an agile team of 5 developers building e-commerce websites.
- Maintained legacy CSS styling and optimized responsive breakpoints for mobile.

EDUCATION & AWARDS
-------------------------------------------
B.Tech Computer Science | IIT (Graduated 2024)
- Winner, Smart City Hackathon 2023 (Best Innovation)`
    }
  ];

  const handleDownload = (template) => {
    const element = document.createElement("a");
    const file = new Blob([template.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${template.id}-template.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const highValueInternships = [
    {
      title: "DevOps Engineer Intern",
      company: "CloudScale Systems",
      loc: "Remote (India)",
      stipend: "₹25,000 / month",
      duration: "6 Months",
      link: "/?q=DevOps"
    },
    {
      title: "Software Engineer Intern",
      company: "NextJobPost Tech",
      loc: "Bangalore (On-site)",
      stipend: "₹35,000 / month",
      duration: "6 Months",
      link: "/?q=Software+Engineer"
    },
    {
      title: "UI/UX Designer Intern",
      company: "PixelPerfect Studios",
      loc: "Remote (India)",
      stipend: "₹18,000 / month",
      duration: "3 Months",
      link: "/?q=UI/UX"
    }
  ];

  return (
    <div className="student-career-center" style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#1e293b' }}>
      
      {/* Hero Banner */}
      <section style={{
        background: 'linear-gradient(135deg, #2e0057 0%, #120024 100%)',
        padding: '4rem 2rem',
        borderRadius: '16px',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: '3rem',
        boxShadow: '0 10px 30px rgba(46,0,87,0.15)'
      }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
          Student Career Center 🎓
        </h1>
        <p style={{ fontSize: '1.15rem', color: '#e9d5ff', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
          Your launching pad from classroom to dream career. Find resources, download templates, and start your path today.
        </p>
      </section>

      {/* Main Grid */}
      <div className="row g-4">
        
        {/* Left Col: Roadmap Timeline */}
        <div className="col-lg-8">
          <div style={{
            background: '#ffffff',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            marginBottom: '2rem'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', color: '#2d0057' }}>
              Your 4-Step Career Roadmap
            </h2>

            {/* Steps selectors */}
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '2rem' }}>
              {steps.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  style={{
                    padding: '0.6rem 1.2rem',
                    border: 'none',
                    borderRadius: '8px',
                    backgroundColor: activeStep === idx ? '#6d28d9' : '#f3f4f6',
                    color: activeStep === idx ? '#ffffff' : '#4b5563',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 200ms ease'
                  }}
                >
                  Step {idx + 1}
                </button>
              ))}
            </div>

            {/* Roadmap detail pane */}
            <div style={{
              background: '#faf5ff',
              padding: '1.5rem',
              borderRadius: '10px',
              borderLeft: '4px solid #6d28d9'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e003b', marginBottom: '0.25rem' }}>
                {steps[activeStep].title}
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.95rem', marginBottom: '1.25rem' }}>
                {steps[activeStep].subtitle}
              </p>
              
              <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                {steps[activeStep].tasks.map((task, idx) => (
                  <li key={idx} style={{ marginBottom: '0.75rem', fontSize: '0.95rem', lineHeight: 1.5, color: '#374151' }}>
                    {task}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Resume Templates Area */}
          <div style={{
            background: '#ffffff',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: '#2d0057' }}>
              Free ATS Resume Templates
            </h2>
            <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Download pre-formatted text resumes optimized to pass Applicant Tracking Systems (ATS).
            </p>

            <div className="row g-3">
              {resumeTemplates.map((template) => (
                <div key={template.id} className="col-md-6">
                  <div style={{
                    border: '1.5px solid #e5e7eb',
                    borderRadius: '10px',
                    padding: '1.25rem',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 200ms ease'
                  }}>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#111827' }}>
                        {template.name}
                      </h4>
                      <p style={{ fontSize: '0.85rem', color: '#4b5563', lineHeight: 1.4, marginBottom: '1rem' }}>
                        {template.desc}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDownload(template)}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        backgroundColor: '#ffffff',
                        border: '1.5px solid #6d28d9',
                        borderRadius: '6px',
                        color: '#6d28d9',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        transition: 'all 200ms ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#6d28d9';
                        e.currentTarget.style.color = '#ffffff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#ffffff';
                        e.currentTarget.style.color = '#6d28d9';
                      }}
                    >
                      Download Template (.txt)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Curated Internships & Advices */}
        <div className="col-lg-4">
          
          {/* High Stipend Internships */}
          <div style={{
            background: '#ffffff',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            marginBottom: '2rem'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', color: '#2d0057' }}>
              Curated Internship Hub
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {highValueInternships.map((intern, idx) => (
                <div key={idx} style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  backgroundColor: '#f9fafb',
                  border: '1px solid #f3f4f6',
                  transition: 'transform 200ms ease'
                }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#6d28d9',
                    backgroundColor: '#faf5ff',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '10px',
                    display: 'inline-block',
                    marginBottom: '0.4rem'
                  }}>
                    {intern.stipend}
                  </span>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.2rem 0', color: '#111827' }}>
                    {intern.title}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0 0 0.6rem 0' }}>
                    {intern.company} • {intern.loc}
                  </p>
                  <Link
                    to={intern.link}
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: '#4f46e5',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    View Internship →
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Resources / Tips */}
          <div style={{
            background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
            padding: '2rem',
            borderRadius: '12px',
            color: '#ffffff',
            boxShadow: '0 4px 20px rgba(79,70,229,0.15)'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
              Career Center Tip 💡
            </h3>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.5, color: '#e0e7ff', margin: 0 }}>
              "Over 75% of resumes are discarded by ATS systems before ever reaching a human recruiter. Keep formatting simple: use standard fonts, avoid tables or graphic elements, and use exact keywords from the job description."
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
