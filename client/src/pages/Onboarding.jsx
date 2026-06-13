import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/index.js';
import { trackEvent } from '../utils/analytics.js';

const ROLES = [
  'Software Developer', 'React Developer', 'Frontend Developer', 'Backend Developer',
  'Full Stack Developer', 'Data Analyst', 'Data Scientist', 'Business Analyst',
  'Marketing Executive', 'HR Executive', 'UI/UX Designer', 'DevOps Engineer',
  'Product Manager', 'Content Writer', 'Sales Executive', 'Java Developer',
  'Python Developer', 'Machine Learning Engineer', 'QA Engineer', 'Other',
];

const SKILLS_LIST = [
  'React', 'Node.js', 'JavaScript', 'Python', 'Java', 'MongoDB', 'MySQL',
  'HTML', 'CSS', 'TypeScript', 'Angular', 'Vue.js', 'Git', 'Docker',
  'AWS', 'Excel', 'SQL', 'Machine Learning', 'Figma', 'Communication',
  'Leadership', 'Sales', 'Marketing', 'Content Writing', 'Data Analysis',
  'Power BI', 'Tableau', 'Spring Boot', 'Django', 'PHP', 'C++', 'C#',
];

const EXPERIENCE = ['Fresher', '0–1 Years', '1–3 Years', '3–5 Years', '5+ Years'];

const DEGREES = ['B.Tech / B.E.', 'BCA', 'B.Sc', 'BBA', 'B.Com', 'MBA', 'MCA', 'M.Tech', 'M.Sc', 'PhD', 'Diploma', 'Other'];

const LOCATIONS = [
  'Remote', 'Bengaluru', 'Hyderabad', 'Mumbai', 'Delhi / NCR', 'Pune',
  'Chennai', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Any Location',
];

const GOV_PREFS = [
  { id: 'SSC', label: 'Staff Selection Commission (SSC)' },
  { id: 'Railway', label: 'Indian Railways (RRB)' },
  { id: 'Banking', label: 'Banking Exams (IBPS, SBI, RBI)' },
  { id: 'CivilServices', label: 'Civil Services (UPSC, State PSC)' }
];

const STEPS = ['Basic Info', 'Career Goals', 'Skills', 'Education', 'Done'];

export default function Onboarding() {
  const { token, username } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: username || '',
    phone: '',
    locations: [],
    preferredRoles: [],
    govPreferences: [],
    skills: [],
    experienceLevel: '',
    education: {
      collegeName: '',
      degree: '',
      branch: '',
      graduationYear: '',
    },
  });

  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const setEdu = (key, val) => setForm(f => ({ ...f, education: { ...f.education, [key]: val } }));

  const toggleLocation = (loc) => {
    setForm(f => {
      let nextLocs;
      if (loc === 'Any Location') {
        nextLocs = f.locations.includes(loc) ? [] : [loc];
      } else {
        const filtered = f.locations.filter(l => l !== 'Any Location');
        nextLocs = filtered.includes(loc)
          ? filtered.filter(l => l !== loc)
          : [...filtered, loc];
      }
      return { ...f, locations: nextLocs };
    });
  };

  const togglePreferredRole = (role) => {
    setForm(f => ({
      ...f,
      preferredRoles: f.preferredRoles.includes(role)
        ? f.preferredRoles.filter(r => r !== role)
        : [...f.preferredRoles, role],
    }));
  };

  const toggleGovPref = (prefId) => {
    setForm(f => ({
      ...f,
      govPreferences: f.govPreferences.includes(prefId)
        ? f.govPreferences.filter(p => p !== prefId)
        : [...f.govPreferences, prefId],
    }));
  };

  const toggleSkill = (skill) => {
    setForm(f => ({
      ...f,
      skills: f.skills.includes(skill)
        ? f.skills.filter(s => s !== skill)
        : [...f.skills, skill],
    }));
  };

  const next = () => {
    trackEvent('Onboarding Step Completed', {
      stepName: STEPS[step],
      stepIndex: step
    });
    setStep(s => Math.min(s + 1, STEPS.length - 1));
  };
  
  const back = () => setStep(s => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        location: form.locations.join(', '),
        preferredRole: form.preferredRoles.join(', ')
      };
      await api.put('/auth/profile', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      trackEvent('Onboarding Completed', {
        preferredRoles: form.preferredRoles,
        govPreferences: form.govPreferences,
        experienceLevel: form.experienceLevel,
        skillsCount: form.skills.length,
        degree: form.education.degree,
        graduationYear: form.education.graduationYear
      });
      navigate('/dashboard');
    } catch (e) {
      setError('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const progressPct = Math.round((step / (STEPS.length - 1)) * 100);

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🚀</div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
          Let's set up your profile
        </h1>
        <p style={{ color: '#64748b', marginTop: '0.5rem', fontSize: '0.98rem' }}>
          Takes just 2 minutes. We'll match you with the best opportunities.
        </p>
      </div>

      {/* Step indicators */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.5rem', alignItems: 'center' }}>
        {STEPS.map((s, i) => (
          <div key={i} style={{ flex: 1 }}>
            <div style={{
              height: 4,
              borderRadius: 99,
              background: i <= step ? '#6d28d9' : '#e2e8f0',
              transition: 'background 0.3s ease',
            }} />
          </div>
        ))}
      </div>
      <p style={{ fontSize: '0.82rem', color: '#94a3b8', textAlign: 'right', marginBottom: '1.75rem' }}>
        Step {step + 1} of {STEPS.length} — <strong style={{ color: '#6d28d9' }}>{STEPS[step]}</strong>
      </p>

      {/* Card */}
      <div style={{
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(109,40,217,0.07)',
        border: '1px solid #f1f5f9',
        padding: '2rem',
        animation: 'fadeInUp 0.35s ease both',
      }}>

        {/* ─── STEP 0: Basic Info ─── */}
        {step === 0 && (
          <div>
            <h2 style={sectionTitle}>👤 Basic Details</h2>
            <p style={sectionDesc}>Help recruiters and our AI know who you are.</p>
            <div style={fieldGroup}>
              <label style={label}>Full Name</label>
              <input style={input} value={form.name} onChange={e => setField('name', e.target.value)} placeholder="e.g. Rahul Sharma" />
            </div>
            <div style={fieldGroup}>
              <label style={label}>Phone Number</label>
              <input style={input} value={form.phone} onChange={e => setField('phone', e.target.value)} placeholder="+91 98765 43210" type="tel" />
            </div>
            <div style={fieldGroup}>
              <label style={label}>Preferred Job Location (Select multiple)</label>
              <div style={pillGrid}>
                {LOCATIONS.map(loc => (
                  <button key={loc} type="button"
                    onClick={() => toggleLocation(loc)}
                    style={form.locations.includes(loc) ? pillActive : pill}
                  >{loc}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── STEP 1: Career Goals ─── */}
        {step === 1 && (
          <div>
            <h2 style={sectionTitle}>💼 Career Goals</h2>
            <p style={sectionDesc}>What role are you looking for? This powers your job recommendations.</p>
            <div style={fieldGroup}>
              <label style={label}>Preferred Role (Select multiple)</label>
              <div style={pillGrid}>
                {ROLES.map(role => (
                  <button key={role} type="button"
                    onClick={() => togglePreferredRole(role)}
                    style={form.preferredRoles.includes(role) ? pillActive : pill}
                  >{role}</button>
                ))}
              </div>
            </div>
            <div style={{ ...fieldGroup, marginTop: '1.5rem' }}>
              <label style={label}>Experience Level</label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {EXPERIENCE.map(exp => (
                  <button key={exp} type="button"
                    onClick={() => setField('experienceLevel', exp)}
                    style={form.experienceLevel === exp ? pillActive : pill}
                  >{exp}</button>
                ))}
              </div>
            </div>
            <div style={{ ...fieldGroup, marginTop: '1.5rem' }}>
              <label style={label}>🏛️ Government Job Preferences (Optional)</label>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '-0.25rem 0 0.75rem 0' }}>
                Select government exam sectors you are preparing for or interested in.
              </p>
              <div style={pillGrid}>
                {GOV_PREFS.map(pref => (
                  <button key={pref.id} type="button"
                    onClick={() => toggleGovPref(pref.id)}
                    style={form.govPreferences.includes(pref.id) ? pillActive : pill}
                  >{pref.label}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── STEP 2: Skills ─── */}
        {step === 2 && (
          <div>
            <h2 style={sectionTitle}>⚡ Your Skills</h2>
            <p style={sectionDesc}>Select all that apply. This helps us match you with the right jobs.</p>
            <div style={pillGrid}>
              {SKILLS_LIST.map(skill => (
                <button key={skill} type="button"
                  onClick={() => toggleSkill(skill)}
                  style={form.skills.includes(skill) ? pillActive : pill}
                >{skill}</button>
              ))}
            </div>
            {form.skills.length > 0 && (
              <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#6d28d9', fontWeight: 600 }}>
                ✅ {form.skills.length} skill{form.skills.length > 1 ? 's' : ''} selected
              </p>
            )}
          </div>
        )}

        {/* ─── STEP 3: Education ─── */}
        {step === 3 && (
          <div>
            <h2 style={sectionTitle}>🎓 Education</h2>
            <p style={sectionDesc}>Tell us about your academic background.</p>
            <div style={fieldGroup}>
              <label style={label}>College / University Name</label>
              <input style={input} value={form.education.collegeName} onChange={e => setEdu('collegeName', e.target.value)} placeholder="e.g. IIT Delhi, VIT Vellore" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={fieldGroup}>
                <label style={label}>Degree</label>
                <select style={input} value={form.education.degree} onChange={e => setEdu('degree', e.target.value)}>
                  <option value="">Select degree</option>
                  {DEGREES.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div style={fieldGroup}>
                <label style={label}>Branch / Specialisation</label>
                <input style={input} value={form.education.branch} onChange={e => setEdu('branch', e.target.value)} placeholder="e.g. CSE, ECE, MBA-HR" />
              </div>
            </div>
            <div style={fieldGroup}>
              <label style={label}>Graduation Year</label>
              <input style={input} value={form.education.graduationYear} onChange={e => setEdu('graduationYear', e.target.value)} placeholder="e.g. 2024, 2025" maxLength={4} />
            </div>
          </div>
        )}

        {/* ─── STEP 4: Done ─── */}
        {step === 4 && (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
              You're all set, {form.name || username}!
            </h2>
            <p style={{ color: '#64748b', marginTop: '0.75rem', lineHeight: 1.6 }}>
              Your profile is ready. We'll now show you jobs that match your skills and preferred role.
            </p>
            <div style={{
              background: 'linear-gradient(135deg, #f3e8ff, #ede9fe)',
              borderRadius: 12,
              padding: '1.25rem',
              marginTop: '1.5rem',
              textAlign: 'left',
            }}>
              <p style={{ margin: 0, fontSize: '0.92rem', color: '#4c1d95', fontWeight: 600 }}>
                📋 Profile Summary
              </p>
              <ul style={{ margin: '0.75rem 0 0', padding: '0 0 0 1.25rem', color: '#5b21b6', fontSize: '0.88rem', lineHeight: 2 }}>
                {form.preferredRoles.length > 0 && <li>Roles: <strong>{form.preferredRoles.join(', ')}</strong></li>}
                {form.experienceLevel && <li>Experience: <strong>{form.experienceLevel}</strong></li>}
                {form.locations.length > 0 && <li>Locations: <strong>{form.locations.join(', ')}</strong></li>}
                {form.govPreferences.length > 0 && <li>Government Interests: <strong>{form.govPreferences.map(p => GOV_PREFS.find(gp => gp.id === p)?.label || p).join(', ')}</strong></li>}
                {form.skills.length > 0 && <li>Skills: <strong>{form.skills.slice(0, 5).join(', ')}{form.skills.length > 5 ? ` +${form.skills.length - 5} more` : ''}</strong></li>}
                {form.education.degree && <li>Education: <strong>{form.education.degree}{form.education.branch ? ` – ${form.education.branch}` : ''}</strong></li>}
              </ul>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#dc2626', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        {/* Navigation buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem', justifyContent: 'space-between' }}>
          {step > 0 ? (
            <button type="button" onClick={back} style={btnSecondary}>← Back</button>
          ) : <div />}

          {step < STEPS.length - 1 ? (
            <button type="button" onClick={next} style={btnPrimary}>
              Continue →
            </button>
          ) : (
            <button type="button" onClick={handleSubmit} disabled={saving} style={btnPrimary}>
              {saving ? 'Saving…' : '🚀 Go to My Dashboard'}
            </button>
          )}
        </div>
      </div>

      {/* Skip link */}
      {step < 4 && (
        <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem', color: '#94a3b8' }}>
          <button type="button" onClick={() => {
            trackEvent('Onboarding Skipped', {
              lastStepCompleted: STEPS[step],
              stepIndex: step
            });
            navigate('/dashboard');
          }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', textDecoration: 'underline' }}>
            Skip for now
          </button>
        </p>
      )}
    </div>
  );
}

// ── Shared styles ──────────────────────────────────────────────────────────────
const sectionTitle = { fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', margin: '0 0 0.3rem' };
const sectionDesc  = { fontSize: '0.9rem', color: '#64748b', margin: '0 0 1.5rem' };
const fieldGroup   = { marginBottom: '1.25rem' };
const label        = { display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem' };
const input        = {
  width: '100%', padding: '0.7rem 0.9rem', borderRadius: 8,
  border: '1.5px solid #e2e8f0', fontSize: '0.95rem', outline: 'none',
  fontFamily: 'inherit', background: '#fafafa', boxSizing: 'border-box',
  transition: 'border-color 0.15s ease',
};
const pillGrid = { display: 'flex', flexWrap: 'wrap', gap: '0.5rem' };
const pill = {
  padding: '0.4rem 0.9rem', borderRadius: 9999, border: '1.5px solid #e2e8f0',
  background: '#f8fafc', color: '#475569', fontSize: '0.85rem', fontWeight: 600,
  cursor: 'pointer', transition: 'all 0.15s ease',
};
const pillActive = {
  ...pill, background: '#6d28d9', color: '#fff', border: '1.5px solid #6d28d9',
};
const btnPrimary = {
  padding: '0.75rem 2rem', background: '#6d28d9', color: '#fff',
  border: 'none', borderRadius: 9999, fontWeight: 700, fontSize: '0.95rem',
  cursor: 'pointer', transition: 'background 0.15s ease',
};
const btnSecondary = {
  padding: '0.75rem 1.5rem', background: '#f1f5f9', color: '#475569',
  border: 'none', borderRadius: 9999, fontWeight: 700, fontSize: '0.95rem',
  cursor: 'pointer',
};
