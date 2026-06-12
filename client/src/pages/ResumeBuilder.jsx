import React, { useState, useRef } from 'react';

const INITIAL = {
  name: '', email: '', phone: '', location: '', linkedin: '', github: '', website: '',
  summary: '',
  experience: [{ company: '', role: '', startDate: '', endDate: '', current: false, description: '' }],
  education: [{ institution: '', degree: '', field: '', year: '' }],
  projects: [{ name: '', description: '', tech: '', link: '' }],
  skills: '',
  certifications: '',
};

const TEMPLATES = [
  { id: 'modern', name: 'Modern', color: '#1A3A6B' },
  { id: 'minimal', name: 'Minimal', color: '#0f172a' },
  { id: 'creative', name: 'Creative', color: '#7c3aed' },
];

const STEPS = ['Personal', 'Summary', 'Experience', 'Education', 'Projects', 'Skills'];

export default function ResumeBuilder() {
  const [data, setData] = useState(INITIAL);
  const [step, setStep] = useState(0);
  const [template, setTemplate] = useState('modern');
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef(null);

  const update = (field, value) => setData(d => ({ ...d, [field]: value }));

  const updateArr = (field, idx, key, value) => {
    setData(d => {
      const arr = [...d[field]];
      arr[idx] = { ...arr[idx], [key]: value };
      return { ...d, [field]: arr };
    });
  };

  const addItem = (field, template) => setData(d => ({ ...d, [field]: [...d[field], { ...template }] }));
  const removeItem = (field, idx) => setData(d => ({ ...d, [field]: d[field].filter((_, i) => i !== idx) }));

  const color = TEMPLATES.find(t => t.id === template)?.color || '#1A3A6B';

  const handlePrint = () => {
    window.print();
  };

  const downloadTxt = () => {
    const skills = data.skills ? data.skills.split(',').map(s => s.trim()).join(' | ') : '';
    const txt = `${data.name}
${data.email} | ${data.phone} | ${data.location}
${data.linkedin ? `LinkedIn: ${data.linkedin}` : ''}
${data.github ? `GitHub: ${data.github}` : ''}

PROFESSIONAL SUMMARY
${data.summary}

EXPERIENCE
${data.experience.map(e => `${e.role} at ${e.company} (${e.startDate} – ${e.current ? 'Present' : e.endDate})\n${e.description}`).join('\n\n')}

EDUCATION
${data.education.map(e => `${e.degree} in ${e.field} – ${e.institution} (${e.year})`).join('\n')}

PROJECTS
${data.projects.map(p => `${p.name}: ${p.description}\nTech: ${p.tech}${p.link ? `\nLink: ${p.link}` : ''}`).join('\n\n')}

SKILLS
${skills}

CERTIFICATIONS
${data.certifications}
`.trim();

    const blob = new Blob([txt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.name.replace(/\s/g, '_') || 'resume'}_resume.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8faff', fontFamily: 'Inter,sans-serif' }}>
      {/* Print styles */}
      <style>{`
        @media print {
          body > *:not(#resume-print-area) { display: none !important; }
          #resume-print-area { display: block !important; position: static !important; width: 100% !important; box-shadow: none !important; }
          @page { margin: 15mm; }
        }
      `}</style>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#1e1b4b,#312e81)', padding: '1.5rem', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ margin: 0, color: '#fff', fontWeight: 800, fontSize: 'clamp(1.1rem,3vw,1.5rem)' }}>
              📄 ATS Resume Builder
            </h1>
            <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem' }}>
              Build a professional, ATS-optimized resume in minutes
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setShowPreview(p => !p)} style={{
              background: 'rgba(255,255,255,0.15)', color: '#fff',
              border: '1.5px solid rgba(255,255,255,0.4)',
              borderRadius: 10, padding: '8px 16px',
              fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
            }}>
              {showPreview ? '✏️ Editor' : '👁️ Preview'}
            </button>
            <button onClick={downloadTxt} style={{
              background: 'rgba(255,255,255,0.15)', color: '#fff',
              border: '1.5px solid rgba(255,255,255,0.4)',
              borderRadius: 10, padding: '8px 16px',
              fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
            }}>📥 .txt</button>
            <button onClick={handlePrint} style={{
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              color: '#fff', border: 'none',
              borderRadius: 10, padding: '8px 16px',
              fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
            }}>🖨️ Download PDF</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '1.5rem 1rem', display: 'grid', gridTemplateColumns: showPreview ? '1fr' : '1fr 1fr', gap: 24 }}>

        {/* ── EDITOR PANEL ── */}
        {!showPreview && (
          <div>
            {/* Template Picker */}
            <div style={{ background: '#fff', borderRadius: 14, padding: '1rem', marginBottom: 16, border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#64748b', marginBottom: 10 }}>🎨 Template</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {TEMPLATES.map(t => (
                  <button key={t.id} onClick={() => setTemplate(t.id)} style={{
                    padding: '6px 14px', borderRadius: 8,
                    border: template === t.id ? `2px solid ${t.color}` : '2px solid #e2e8f0',
                    background: template === t.id ? `${t.color}15` : '#fff',
                    color: template === t.id ? t.color : '#64748b',
                    fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: t.color }} />
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Step Progress */}
            <div style={{ background: '#fff', borderRadius: 14, padding: '1rem', marginBottom: 16, border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {STEPS.map((s, i) => (
                  <button key={i} onClick={() => setStep(i)} style={{
                    padding: '5px 12px', borderRadius: 8,
                    border: 'none',
                    background: step === i ? '#1A3A6B' : i < step ? '#10b98120' : '#f1f5f9',
                    color: step === i ? '#fff' : i < step ? '#10b981' : '#94a3b8',
                    fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer',
                  }}>{i < step ? '✓' : i + 1}. {s}</button>
                ))}
              </div>
            </div>

            {/* Step Forms */}
            <div style={{ background: '#fff', borderRadius: 14, padding: '1.5rem', border: '1px solid #e2e8f0' }}>
              {/* PERSONAL */}
              {step === 0 && (
                <div>
                  <h3 style={sectionTitle}>👤 Personal Details</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {[
                      ['name', 'Full Name *', 'John Doe'],
                      ['email', 'Email *', 'john@email.com'],
                      ['phone', 'Phone *', '+91-9876543210'],
                      ['location', 'Location', 'Mumbai, India'],
                      ['linkedin', 'LinkedIn URL', 'linkedin.com/in/johndoe'],
                      ['github', 'GitHub URL', 'github.com/johndoe'],
                    ].map(([key, label, ph]) => (
                      <div key={key}>
                        <label style={labelStyle}>{label}</label>
                        <input value={data[key]} onChange={e => update(key, e.target.value)}
                          placeholder={ph} style={inputStyle} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUMMARY */}
              {step === 1 && (
                <div>
                  <h3 style={sectionTitle}>📝 Professional Summary</h3>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: 10 }}>
                    Write 3-4 lines summarizing your skills, experience, and goals. This appears at the top of your resume.
                  </p>
                  <textarea
                    value={data.summary}
                    onChange={e => update('summary', e.target.value)}
                    placeholder="Motivated Full Stack Developer with 2+ years of experience in React, Node.js and MongoDB. Passionate about building scalable web applications..."
                    rows={5}
                    style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }}
                  />
                </div>
              )}

              {/* EXPERIENCE */}
              {step === 2 && (
                <div>
                  <h3 style={sectionTitle}>💼 Work Experience</h3>
                  {data.experience.map((exp, i) => (
                    <div key={i} style={{ marginBottom: 20, padding: '1rem', background: '#f8faff', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                        <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.85rem' }}>Experience #{i + 1}</div>
                        {data.experience.length > 1 && (
                          <button onClick={() => removeItem('experience', i)} style={removeBtn}>✕ Remove</button>
                        )}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        <div>
                          <label style={labelStyle}>Job Title *</label>
                          <input value={exp.role} onChange={e => updateArr('experience', i, 'role', e.target.value)}
                            placeholder="Software Engineer" style={inputStyle} />
                        </div>
                        <div>
                          <label style={labelStyle}>Company *</label>
                          <input value={exp.company} onChange={e => updateArr('experience', i, 'company', e.target.value)}
                            placeholder="Google Inc." style={inputStyle} />
                        </div>
                        <div>
                          <label style={labelStyle}>Start Date</label>
                          <input value={exp.startDate} onChange={e => updateArr('experience', i, 'startDate', e.target.value)}
                            placeholder="Jan 2023" style={inputStyle} />
                        </div>
                        <div>
                          <label style={labelStyle}>End Date</label>
                          <input value={exp.endDate} onChange={e => updateArr('experience', i, 'endDate', e.target.value)}
                            placeholder="Present" disabled={exp.current} style={inputStyle} />
                          <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                            <input type="checkbox" checked={exp.current} onChange={e => updateArr('experience', i, 'current', e.target.checked)} />
                            Currently Working
                          </label>
                        </div>
                      </div>
                      <div style={{ marginTop: 10 }}>
                        <label style={labelStyle}>Key Achievements / Responsibilities</label>
                        <textarea value={exp.description}
                          onChange={e => updateArr('experience', i, 'description', e.target.value)}
                          placeholder="• Built REST APIs with Node.js, reducing response time by 40%&#10;• Led a team of 4 developers..."
                          rows={4}
                          style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }}
                        />
                      </div>
                    </div>
                  ))}
                  <button onClick={() => addItem('experience', { company: '', role: '', startDate: '', endDate: '', current: false, description: '' })}
                    style={addBtn}>+ Add Experience</button>
                </div>
              )}

              {/* EDUCATION */}
              {step === 3 && (
                <div>
                  <h3 style={sectionTitle}>🎓 Education</h3>
                  {data.education.map((edu, i) => (
                    <div key={i} style={{ marginBottom: 16, padding: '1rem', background: '#f8faff', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                        <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.85rem' }}>Education #{i + 1}</div>
                        {data.education.length > 1 && (
                          <button onClick={() => removeItem('education', i)} style={removeBtn}>✕ Remove</button>
                        )}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        {[
                          ['institution', 'Institution *', 'IIT Delhi'],
                          ['degree', 'Degree *', 'B.Tech / MBA / BSc'],
                          ['field', 'Field of Study', 'Computer Science'],
                          ['year', 'Graduation Year', '2024'],
                        ].map(([key, label, ph]) => (
                          <div key={key}>
                            <label style={labelStyle}>{label}</label>
                            <input value={edu[key]} onChange={e => updateArr('education', i, key, e.target.value)}
                              placeholder={ph} style={inputStyle} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button onClick={() => addItem('education', { institution: '', degree: '', field: '', year: '' })}
                    style={addBtn}>+ Add Education</button>
                </div>
              )}

              {/* PROJECTS */}
              {step === 4 && (
                <div>
                  <h3 style={sectionTitle}>🚀 Projects</h3>
                  {data.projects.map((proj, i) => (
                    <div key={i} style={{ marginBottom: 16, padding: '1rem', background: '#f8faff', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                        <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.85rem' }}>Project #{i + 1}</div>
                        {data.projects.length > 1 && (
                          <button onClick={() => removeItem('projects', i)} style={removeBtn}>✕ Remove</button>
                        )}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        <div>
                          <label style={labelStyle}>Project Name *</label>
                          <input value={proj.name} onChange={e => updateArr('projects', i, 'name', e.target.value)}
                            placeholder="Job Portal App" style={inputStyle} />
                        </div>
                        <div>
                          <label style={labelStyle}>Tech Stack</label>
                          <input value={proj.tech} onChange={e => updateArr('projects', i, 'tech', e.target.value)}
                            placeholder="React, Node.js, MongoDB" style={inputStyle} />
                        </div>
                        <div style={{ gridColumn: '1/-1' }}>
                          <label style={labelStyle}>Description</label>
                          <textarea value={proj.description}
                            onChange={e => updateArr('projects', i, 'description', e.target.value)}
                            placeholder="Built a full-stack job portal with 1000+ daily users..."
                            rows={3} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                          />
                        </div>
                        <div style={{ gridColumn: '1/-1' }}>
                          <label style={labelStyle}>Project Link (optional)</label>
                          <input value={proj.link} onChange={e => updateArr('projects', i, 'link', e.target.value)}
                            placeholder="github.com/johndoe/project" style={inputStyle} />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => addItem('projects', { name: '', description: '', tech: '', link: '' })}
                    style={addBtn}>+ Add Project</button>
                </div>
              )}

              {/* SKILLS */}
              {step === 5 && (
                <div>
                  <h3 style={sectionTitle}>⚡ Skills & Certifications</h3>
                  <div style={{ marginBottom: 16 }}>
                    <label style={labelStyle}>Skills (comma-separated) *</label>
                    <textarea value={data.skills}
                      onChange={e => update('skills', e.target.value)}
                      placeholder="React.js, Node.js, MongoDB, SQL, Python, Git, REST APIs, Docker, AWS"
                      rows={3} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                    />
                    {data.skills && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                        {data.skills.split(',').map((s, i) => s.trim() && (
                          <span key={i} style={{
                            background: `${color}15`, color,
                            borderRadius: 20, padding: '3px 10px',
                            fontSize: '0.75rem', fontWeight: 700,
                          }}>{s.trim()}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label style={labelStyle}>Certifications / Achievements</label>
                    <textarea value={data.certifications}
                      onChange={e => update('certifications', e.target.value)}
                      placeholder="AWS Certified Developer (2023), Google Data Analytics Certificate, HackerRank SQL Gold"
                      rows={3} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                    />
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
                <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
                  style={{ ...navBtn, opacity: step === 0 ? 0.4 : 1 }}>← Back</button>
                {step < STEPS.length - 1 ? (
                  <button onClick={() => setStep(s => s + 1)} style={{ ...navBtn, background: color, color: '#fff', border: 'none' }}>
                    Next →
                  </button>
                ) : (
                  <button onClick={() => setShowPreview(true)} style={{ ...navBtn, background: '#10b981', color: '#fff', border: 'none' }}>
                    Preview Resume 👁️
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── PREVIEW PANEL ── */}
        <div id="resume-print-area" ref={previewRef} style={{
          background: '#fff',
          borderRadius: showPreview ? 16 : 14,
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          height: 'fit-content',
        }}>
          <ResumePreview data={data} color={color} template={template} />
        </div>
      </div>
    </div>
  );
}

function ResumePreview({ data, color, template }) {
  const skills = data.skills ? data.skills.split(',').map(s => s.trim()).filter(Boolean) : [];

  return (
    <div style={{ padding: '2rem', fontFamily: 'Inter, Arial, sans-serif', fontSize: '0.85rem', color: '#1e293b', lineHeight: 1.6 }}>
      {/* Name & Contact */}
      <div style={{ borderBottom: `3px solid ${color}`, paddingBottom: '1rem', marginBottom: '1rem' }}>
        <div style={{ fontSize: '1.8rem', fontWeight: 900, color, letterSpacing: '-0.5px' }}>
          {data.name || 'Your Name'}
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 6, fontSize: '0.78rem', color: '#475569' }}>
          {data.email && <span>✉️ {data.email}</span>}
          {data.phone && <span>📞 {data.phone}</span>}
          {data.location && <span>📍 {data.location}</span>}
          {data.linkedin && <span>🔗 {data.linkedin}</span>}
          {data.github && <span>💻 {data.github}</span>}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <section style={{ marginBottom: '1rem' }}>
          <div style={secTitle(color)}>PROFESSIONAL SUMMARY</div>
          <p style={{ margin: 0, color: '#374151', lineHeight: 1.7 }}>{data.summary}</p>
        </section>
      )}

      {/* Experience */}
      {data.experience.some(e => e.role) && (
        <section style={{ marginBottom: '1rem' }}>
          <div style={secTitle(color)}>WORK EXPERIENCE</div>
          {data.experience.filter(e => e.role).map((exp, i) => (
            <div key={i} style={{ marginBottom: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 800, color: '#1e293b' }}>{exp.role}</div>
                  <div style={{ color, fontWeight: 600, fontSize: '0.82rem' }}>{exp.company}</div>
                </div>
                <div style={{ color: '#64748b', fontSize: '0.75rem', textAlign: 'right' }}>
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </div>
              </div>
              {exp.description && (
                <div style={{ marginTop: 4, color: '#374151', fontSize: '0.82rem', whiteSpace: 'pre-wrap' }}>
                  {exp.description}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {data.projects.some(p => p.name) && (
        <section style={{ marginBottom: '1rem' }}>
          <div style={secTitle(color)}>PROJECTS</div>
          {data.projects.filter(p => p.name).map((proj, i) => (
            <div key={i} style={{ marginBottom: '0.7rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontWeight: 800 }}>{proj.name}</span>
                {proj.tech && <span style={{ color, fontSize: '0.72rem', fontWeight: 700 }}>| {proj.tech}</span>}
                {proj.link && <span style={{ color: '#6366f1', fontSize: '0.72rem' }}>{proj.link}</span>}
              </div>
              {proj.description && <div style={{ color: '#374151', fontSize: '0.82rem', marginTop: 2 }}>{proj.description}</div>}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {data.education.some(e => e.institution) && (
        <section style={{ marginBottom: '1rem' }}>
          <div style={secTitle(color)}>EDUCATION</div>
          {data.education.filter(e => e.institution).map((edu, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div>
                <div style={{ fontWeight: 800 }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</div>
                <div style={{ color, fontSize: '0.82rem', fontWeight: 600 }}>{edu.institution}</div>
              </div>
              <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{edu.year}</div>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section style={{ marginBottom: '1rem' }}>
          <div style={secTitle(color)}>SKILLS</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {skills.map((s, i) => (
              <span key={i} style={{
                background: `${color}12`, color,
                borderRadius: 4, padding: '2px 8px',
                fontSize: '0.75rem', fontWeight: 600,
              }}>{s}</span>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {data.certifications && (
        <section>
          <div style={secTitle(color)}>CERTIFICATIONS</div>
          <div style={{ color: '#374151', fontSize: '0.82rem' }}>{data.certifications}</div>
        </section>
      )}
    </div>
  );
}

const secTitle = (color) => ({
  fontWeight: 900, fontSize: '0.72rem', letterSpacing: '0.08em',
  color, borderBottom: `1.5px solid ${color}40`,
  paddingBottom: 4, marginBottom: 8, textTransform: 'uppercase',
});

const inputStyle = {
  width: '100%', padding: '8px 12px',
  border: '1.5px solid #e2e8f0', borderRadius: 8,
  fontSize: '0.85rem', fontFamily: 'Inter,sans-serif',
  outline: 'none', color: '#1e293b',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};

const labelStyle = {
  display: 'block', fontSize: '0.75rem',
  fontWeight: 700, color: '#64748b',
  marginBottom: 4, marginTop: 4,
};

const sectionTitle = {
  margin: '0 0 16px', fontWeight: 800,
  color: '#1e293b', fontSize: '1rem',
};

const addBtn = {
  background: '#f8faff', color: '#6366f1',
  border: '1.5px dashed #c7d2fe',
  borderRadius: 10, padding: '8px 16px',
  fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
  width: '100%',
};

const removeBtn = {
  background: '#fef2f2', color: '#ef4444',
  border: 'none', borderRadius: 6,
  padding: '3px 10px', fontSize: '0.72rem',
  fontWeight: 700, cursor: 'pointer',
};

const navBtn = {
  padding: '9px 20px', borderRadius: 10,
  border: '1.5px solid #e2e8f0',
  background: '#fff', color: '#475569',
  fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
};
