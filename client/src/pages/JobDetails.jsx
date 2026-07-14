import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../api/index.js';
import { useCache } from '../hooks/useCache.js';
import { cleanJobBranding } from '../utils/textUtils.js';

import SidebarFilter from '../components/SidebarFilter.jsx';
import RichTextDisplay from '../components/RichTextDisplay.jsx';
import { JobDetailsSkeleton } from '../components/SkeletonLoader.jsx';
import { getImageUrl } from '../utils/imageUtils.js';
import { 
  trackEvent,
  trackPageView, 
  trackJobDetailViewed, 
  trackApplyJobClicked, 
  trackJobShared, 
  trackAdClicked 
} from '../utils/analytics.js';
import SidebarAd from '../components/SidebarAd.jsx';
import SidebarCareerHub from '../components/SidebarCareerHub.jsx';
import DynamicJobGuide from '../components/DynamicJobGuide.jsx';
import { getJobUrl } from '../utils/urlHelper.js';


function extractVacancy(title) {
  if (!title) return 'As per notification';
  const match = title.match(/(\d[\d,]*)\s*(?:Vacancy|Vacancies|Post|Posts|Slot|Slots|LGC|Clerk|Trainee|Openings)/i);
  return match ? match[1] : 'As per notification';
}

// Inline Component for "Also read ---" block
const AlsoReadCard = ({ relatedJob, themeColor = '#dc3545' }) => {
  if (!relatedJob) return null;
  return (
    <div className="also-read-box my-4 p-3 rounded" style={{ 
      border: `1.5px dashed ${themeColor}`, 
      backgroundColor: `${themeColor}05`,
      position: 'relative',
      transition: 'all 200ms ease'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = `${themeColor}0a`;
      e.currentTarget.style.transform = 'translateX(4px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = `${themeColor}05`;
      e.currentTarget.style.transform = 'none';
    }}
    >
      <span style={{ 
        position: 'absolute', 
        top: '-11px', 
        left: '15px', 
        backgroundColor: '#fff', 
        padding: '0 8px', 
        color: themeColor, 
        fontSize: '0.82rem',
        fontWeight: '700'
      }}>Also read ---</span>
      <Link to={getJobUrl(relatedJob)} className="d-flex align-items-center gap-3 text-decoration-none text-dark">
        {relatedJob.image && (
          <img 
            src={getImageUrl(relatedJob.image)} 
            alt={relatedJob.title} 
            style={{ width: '80px', height: '56px', objectFit: 'cover', borderRadius: '4px' }} 
            width="80"
            height="56"
            loading="lazy"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}
        <div>
          <span className="fw-bold" style={{ fontSize: '0.95rem', lineHeight: '1.2', color: '#1e293b' }}>{relatedJob.title}</span>
        </div>
      </Link>
    </div>
  );
};

// Strip Unicode Math Bold / Italic chars that Telegram uses for bold text
const stripUnicodeBold = (str) => {
  if (!str) return str;
  const ranges = [
    [0x1D400, 0x1D419, 0x41], [0x1D41A, 0x1D433, 0x61],
    [0x1D434, 0x1D44D, 0x41], [0x1D44E, 0x1D467, 0x61],
    [0x1D468, 0x1D481, 0x41], [0x1D482, 0x1D49B, 0x61],
    [0x1D49C, 0x1D4B5, 0x41], [0x1D4B6, 0x1D4CF, 0x61],
    [0x1D4D0, 0x1D4E9, 0x41], [0x1D4EA, 0x1D503, 0x61],
    [0x1D504, 0x1D51D, 0x41], [0x1D51E, 0x1D537, 0x61],
    [0x1D538, 0x1D551, 0x41], [0x1D552, 0x1D56B, 0x61],
    [0x1D56C, 0x1D585, 0x41], [0x1D586, 0x1D59F, 0x61],
    [0x1D5A0, 0x1D5B9, 0x41], [0x1D5BA, 0x1D5D3, 0x61],
    [0x1D5D4, 0x1D5ED, 0x41], [0x1D5EE, 0x1D607, 0x61],
    [0x1D608, 0x1D621, 0x41], [0x1D622, 0x1D63B, 0x61],
    [0x1D63C, 0x1D655, 0x41], [0x1D656, 0x1D66F, 0x61],
    [0x1D670, 0x1D689, 0x41], [0x1D68A, 0x1D6A3, 0x61],
    [0x1D7CE, 0x1D7D7, 0x30], [0x1D7D8, 0x1D7E1, 0x30],
    [0x1D7E2, 0x1D7EB, 0x30], [0x1D7EC, 0x1D7F5, 0x30],
    [0x1D7F6, 0x1D7FF, 0x30],
  ];
  return [...str].map(ch => {
    const cp = ch.codePointAt(0);
    for (const [start, end, base] of ranges) {
      if (cp >= start && cp <= end) return String.fromCharCode(base + (cp - start));
    }
    return ch;
  }).join('');
};

// Strip leading emoji characters from a string
const stripLeadingEmoji = (str) => str.replace(/^[\p{Emoji_Presentation}\p{Extended_Pictographic}\s•\-*]+/u, '').trim();

// Relative time formatting helper
const timeAgo = (dateStr) => {
  if (!dateStr) return 'Recently Posted';
  const date = new Date(dateStr);
  const diff = Date.now() - date.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Posted today';
  if (days === 1) return 'Posted 1 day ago';
  if (days < 7) return `Posted ${days} days ago`;
  return `Posted on ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
};

// Field icon map for TelegramJobInfoGrid
const FIELD_ICONS = {
  'job role': '💼', 'role': '💼', 'position': '💼', 'designation': '💼', 'job type': '💼',
  'qualification': '🎓', 'education': '🎓', 'degree': '🎓',
  'batch': '📅', 'year': '📅', 'pass out': '📅',
  'location': '📍', 'job location': '📍', 'city': '📍', 'place': '📍',
  'salary': '💰', 'ctc': '💰', 'package': '💰', 'stipend': '💰', 'salary package': '💰',
  'experience': '⏳', 'exp': '⏳',
  'last date': '🗓️', 'deadline': '🗓️', 'apply by': '🗓️',
  'skills': '⚙️', 'tech stack': '⚙️', 'technologies': '⚙️',
  'vacancies': '📊', 'openings': '📊', 'posts': '📊',
  'department': '🏢', 'company': '🏢',
  'gender': '🚻', 'age': '🔢',
};

// Premium row-based Job Info Table for Telegram-sourced jobs
const TelegramJobInfoGrid = ({ fields, themeColor = '#7c3aed' }) => {
  if (!fields || fields.length === 0) return null;
  return (
    <div style={{
      borderRadius: '10px',
      overflow: 'hidden',
      border: `1.5px solid ${themeColor}25`,
      boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
      background: '#fff',
    }}>
      {fields.map((f, i) => {
        const keyLower = f.key.toLowerCase();
        const iconKey = Object.keys(FIELD_ICONS).find(k => keyLower.includes(k));
        const icon = iconKey ? FIELD_ICONS[iconKey] : '▸';
        return (
          <div
            key={i}
            className="telegram-info-table-row"
            onMouseEnter={e => e.currentTarget.style.backgroundColor = `${themeColor}06`}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {/* Label cell */}
            <div 
              className="telegram-label-cell"
              style={{
                background: `${themeColor}08`,
              }}
            >
              <span style={{
                width: '30px',
                height: '30px',
                borderRadius: '8px',
                background: `${themeColor}18`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.95rem',
                flexShrink: 0,
              }}>{icon}</span>
              <span style={{
                fontSize: '0.76rem',
                fontWeight: '700',
                color: themeColor,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                lineHeight: '1.2',
              }}>{f.key}</span>
            </div>
            {/* Value cell */}
            <div className="telegram-value-cell">
              <span style={{
                fontSize: '0.93rem',
                color: '#1e293b',
                fontWeight: '500',
                lineHeight: '1.5',
                wordBreak: 'break-word',
              }}>{f.value}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Helper to strip HTML tags and decode basic entities from text
const stripHtml = (html) => {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '') // remove HTML tags
    .replace(/&nbsp;/g, ' ') // replace non-breaking spaces
    .replace(/&amp;/g, '&')  // replace amp
    .replace(/\s+/g, ' ')    // normalize whitespace
    .trim();
};

// Parse inline Telegram key:value pattern: "emoji Key: Value emoji Key: Value"
// Used for lines where multiple fields are packed on a single line
const parseInlineFields = (line, knownKeys) => {
  const results = [];
  // Build alternation pattern from known keys
  const keyAlt = knownKeys.join('|');
  // Split on boundaries: emoji + optional spaces + knownKey + ":"
  const splitRe = new RegExp(
    `(?=[\\p{Emoji_Presentation}\\p{Extended_Pictographic}]?\\s*(?:${keyAlt})\\s*:)`,
    'iu'
  );
  const segments = line.split(splitRe).map(s => s.trim()).filter(Boolean);
  const pairRe = new RegExp(`^[\\p{Emoji_Presentation}\\p{Extended_Pictographic}\\s]*(${keyAlt})\\s*:\\s*(.+)`, 'iu');
  segments.forEach(seg => {
    const m = seg.match(pairRe);
    if (m) {
      results.push({ 
        key: stripHtml(m[1].trim()), 
        value: stripHtml(stripUnicodeBold(m[2].trim())) 
      });
    }
  });
  return results;
};

// Validates a job URL — rejects broken hostnames, tracker/shortlink domains, and HTML-contaminated hrefs
const isValidJobUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  // Reject if the URL contains HTML entities or tags — means it's corrupted from regex over HTML
  if (url.includes('%3C') || url.includes('%3E') || url.includes('%22') || url.includes('<') || url.includes('>')) return false;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname;
    if (!host) return false;
    // Reject if hostname starts with dot (e.g. ".in" from broken shortened URLs)
    if (host.startsWith('.')) return false;
    const parts = host.split('.');
    // Must have at least domain + TLD, and the first part must be non-empty
    if (parts.length < 2 || parts[0] === '') return false;
    // Reject known tracker/shortlink/aggregator domains that should never appear as apply links
    const blockedDomains = [
      'pdlink.in', 'bit.ly', 'tinyurl.com', 'ow.ly', 'goo.gl', 'short.ly',
      'rebrand.ly', 'cutt.ly', 't.co', 'buff.ly', 'dlvr.it',
      // Job aggregators & competitor portals
      'internshala.com', 'internshals.com', 'naukri.com', 'shine.com',
      'monster.com', 'timesjobs.com', 'freshersworld.com', 'placementindia.com',
      'govtjobsalert.in', 'sarkariresult.com', 'rojgarresult.com', 'freejobalert.com',
      'freshershunt.in', 'fresherslive.com', 'freshersvoice.com', 'offcampusjobs4u.in',
      'youth4work.com', 'ambitionbox.com', 'glassdoor.com', 'glassdoor.co.in',
      'indeed.com', 'indeed.co.in', 'foundthejob.com', 'internships.com', 'internshipss.com', 'offcampusjobs4u.com', 'placementkit.in', 'placementkit.com', 'walkindrive.com', 'fresherearth.com', 'fresherearth.in',
      'offcampusjobs4u.com', 'placementkit.in', 'placementkit.com', 'walkindrive.com', 'fresherearth.com', 'fresherearth.in',
    ];
    if (blockedDomains.some(d => host === d || host.endsWith('.' + d))) return false;
    return true;
  } catch {
    return false;
  }
};

// Dynamic section enrichment for sparse off-campus/program postings
const getEnrichedJob = (originalJob) => {
  if (!originalJob) return null;
  const cleaned = cleanJobBranding(originalJob);
  const enriched = { ...cleaned };

  // Sanitize any mobile LinkedIn URLs in the main apply link
  if (enriched.applyLink && enriched.applyLink.includes('linkedin.com/m/')) {
    enriched.applyLink = enriched.applyLink.replace('linkedin.com/m/', 'linkedin.com/');
  }

  if (!enriched.isGovernment) {
    const rawDesc = enriched.jobDescription || enriched.description || '';

    // Detect if description is HTML-formatted (from scraper/enriched template)
    // HTML descriptions must NOT go through the text URL regex — it breaks HTML
    // by stripping closing tags like </a></p> (since > and < are non-whitespace)
    const isHtmlDesc = /<[a-z][\s\S]*>/i.test(rawDesc);

    // Extract all HTTP links from the raw description (plain text only)
    const urlRegex = /https?:\/\/[^\s<>"]+/g;
    const extractedUrls = isHtmlDesc ? [] : [...rawDesc.matchAll(urlRegex)].map(m => m[0].replace(/[).,]+$/, ''));

    // Build labeled link entries from extracted URLs
    if (extractedUrls.length > 0 && !enriched.extractedLinks) {
      const labelMap = [
        { key: 'whatsapp.com', label: 'Join Our WhatsApp Channel' },
        { key: 'wa.me', label: 'Join Our WhatsApp Channel' },
        { key: 't.me', label: 'Join Our Telegram Channel' },
        { key: 'telegram.me', label: 'Join Our Telegram Channel' },
        { key: 'youtube.com', label: 'Watch: How to Apply' },
        { key: 'youtu.be', label: 'Watch: How to Apply' },
        { key: 'linkedin.com', label: 'Apply on LinkedIn' },
      ];
      enriched.extractedLinks = extractedUrls.map(url => {
        const match = labelMap.find(l => url.includes(l.key));
        // Redirect WhatsApp/Telegram to official channels, clean mobile LinkedIn links
        let finalUrl = url;
        if (url.includes('whatsapp.com') || url.includes('wa.me')) {
          finalUrl = 'https://chat.whatsapp.com/LVpuUJluTpUEdIc4daAemQ';
        } else if (url.includes('t.me') || url.includes('telegram.me')) {
          finalUrl = 'https://t.me/nextjobpost';
        } else if (url.includes('linkedin.com/m/')) {
          finalUrl = url.replace('linkedin.com/m/', 'linkedin.com/');
        }
        return { url: finalUrl, label: match ? match.label : 'Apply / Visit Link' };
      });
      // Deduplicate by URL
      enriched.extractedLinks = enriched.extractedLinks.filter(
        (link, idx, self) => self.findIndex(l => l.url === link.url) === idx
      );
    }

    // Strip all URLs from the displayed job description — ONLY for plain text
    // HTML descriptions are handled entirely by RichTextDisplay DOM sanitization
    let cleanDesc = isHtmlDesc ? rawDesc : rawDesc.replace(urlRegex, '');

    // For HTML descriptions: skip all text-line parsing — RichTextDisplay handles it via DOM
    // Declare these here so the highlights block below can always reference them safely
    let telegramFields = [];
    let descLines = [];
    if (isHtmlDesc) {
      enriched.jobDescription = rawDesc;
    } else {
    // Remove lines that are now empty after URL stripping, or are well-known label-only lines
    const linesToStrip = [
      /^[•\-\*]?\s*[\p{Emoji_Presentation}\p{Extended_Pictographic}\s]*Apply\s*Link\s*:?\s*$/u,
      /^[•\-\*]?\s*[\p{Emoji_Presentation}\p{Extended_Pictographic}\s]*How\s*to\s*[Aa]pply\s*:?\s*$/u,
      /^[•\-\*]?\s*[\p{Emoji_Presentation}\p{Extended_Pictographic}\s]*Join\s*(Our\s*)?WhatsApp\s*:?\s*$/ui,
      /^[•\-\*]?\s*[\p{Emoji_Presentation}\p{Extended_Pictographic}\s]*Join\s*(Our\s*)?Telegram\s*:?\s*$/ui,
      /^[•\-\*]?\s*[\p{Emoji_Presentation}\p{Extended_Pictographic}\s]*Last\s*Date\s*:?\s*(Apply\s*ASAP)?\s*$/ui,
      /^[⸻\-—_=]{2,}\s*$/u,   // divider lines like ⸻, ---, ===
    ];

    cleanDesc = cleanDesc
      .split('\n')
      .filter(line => {
        const t = line.trim();
        if (!t) return false; // remove blank lines right here
        return !linesToStrip.some(re => re.test(t));
      })
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    enriched.jobDescription = cleanDesc || rawDesc;

    descLines = cleanDesc.split('\n').map(l => stripUnicodeBold(l).trim()).filter(Boolean);

    // Parse structured key:value bullet lines into telegramFields
    const KNOWN_KEYS = [
      'Job Role', 'Role', 'Position', 'Designation', 'Job Type',
      'Qualification', 'Education', 'Degree',
      'Batch', 'Year of Passing', 'Pass out', 'Passout',
      'Location', 'Job Location', 'City',
      'Salary', 'CTC', 'Package', 'Stipend', 'Salary Package',
      'Experience', 'Exp',
      'Last Date', 'Deadline', 'Apply By',
      'Skills', 'Tech Stack', 'Technologies',
      'Vacancies', 'Openings', 'Posts',
      'Department', 'Company',
      'Gender', 'Age',
    ];
    const keyPattern = new RegExp(`^[•\\-\\*]?\\s*[\\p{Emoji_Presentation}\\p{Extended_Pictographic}\\s]*(${KNOWN_KEYS.join('|')})\\s*:(.*)$`, 'iu');
    // Patterns for lines we should NEVER show in the intro text
    const NOISY_LINE_PATTERNS = [
      /share with your friends/i,
      /apply link\s*:?\s*$/i,
      /how to apply\s*:?\s*$/i,
      /join.*whatsapp\s*:?\s*$/i,
      /join.*telegram\s*:?\s*$/i,
      /freshly posted/i,
      /^[🚨🔔📢📣⚡🎯✅🔗]+\s*$/u,  // emoji-only lines
    ];
    telegramFields = [];
    let bodyLines = [];


    descLines.forEach(line => {
      const m = line.match(keyPattern);
      if (m) {
        const key = stripHtml(m[1].trim());
        const val = stripHtml(stripUnicodeBold(m[2].trim()));
        if (val) telegramFields.push({ key, value: val });
      } else if (!line.match(/^[•\-\*]/)) {
        // Non-bullet line — check if it's an inline "emoji Key: Value emoji Key: Value" pattern
        const inlineParsed = parseInlineFields(line, KNOWN_KEYS);
        if (inlineParsed.length >= 2) {
          // Multiple fields on one line — take them as structured fields, not body text
          inlineParsed.forEach(f => {
            if (!telegramFields.find(e => e.key.toLowerCase() === f.key.toLowerCase())) {
              telegramFields.push(f);
            }
          });
          // Also extract and add the leading intro text segment
          const keyAlt = KNOWN_KEYS.join('|');
          const splitRe = new RegExp(`(?=[\\p{Emoji_Presentation}\\p{Extended_Pictographic}]?\\s*(?:${keyAlt})\\s*:)`, 'iu');
          const firstSegment = line.split(splitRe)[0];
          if (firstSegment) {
            const cleanedIntro = stripHtml(stripUnicodeBold(firstSegment)).trim();
            if (cleanedIntro.length > 5) {
              bodyLines.push(cleanedIntro);
            }
          }
        } else {
          // Keep as intro/title body text if it's not noisy
          const cleaned = stripHtml(stripUnicodeBold(line)).trim();
          const isNoisy = NOISY_LINE_PATTERNS.some(re => re.test(cleaned));
          const isEmojiOnly = /^[\p{Emoji_Presentation}\p{Extended_Pictographic}\s]+$/u.test(cleaned);
          if (!isNoisy && !isEmojiOnly && cleaned.length > 3) {
            bodyLines.push(cleaned);
          }
        }
      }
    });
    if (telegramFields.length > 0) enriched.telegramFields = telegramFields;
    // Keep only the intro/title text as the displayed jobDescription
    if (telegramFields.length > 0 && bodyLines.length > 0) {
      enriched.jobDescription = bodyLines.join('\n');
    } else if (telegramFields.length > 0) {
      enriched.jobDescription = null; // nothing left to show as raw text
    }

    // Override generic DB field values with actual values parsed from Telegram text
    const GENERIC_SALARY = /best in industry|as per company|competitive|not disclosed|negotiable|market standard/i;
    if (telegramFields.length > 0) {
      const findField = (...keys) => {
        for (const k of keys) {
          const f = telegramFields.find(tf => tf.key.toLowerCase().includes(k.toLowerCase()));
          if (f) return f.value;
        }
        return null;
      };
      const parsedSalary = findField('salary', 'ctc', 'package', 'stipend');
      if (parsedSalary && (!enriched.salary || GENERIC_SALARY.test(enriched.salary))) {
        enriched.salary = parsedSalary;
      }
      const parsedLocation = findField('location', 'city');
      if (parsedLocation && !enriched.location) enriched.location = parsedLocation;
      const parsedBatch = findField('batch', 'pass out', 'year');
      if (parsedBatch && !enriched.batch) enriched.batch = parsedBatch;
      const parsedType = findField('job role', 'role', 'position', 'designation', 'job type');
      if (parsedType && !enriched.type) enriched.type = parsedType;
    }
    } // end !isHtmlDesc block


    // Parse key items (e.g. checkmarks, emojis, bullets) for highlights/requirements
    // Only do this if we didn't already parse structured telegramFields (to avoid duplication)
    if (telegramFields.length === 0) {
      const parsedHighlights = descLines.filter(line =>
        line.startsWith('✅') ||
        line.startsWith('•') ||
        line.startsWith('-') ||
        line.startsWith('*')
      ).map(line => stripLeadingEmoji(line));

      if (parsedHighlights.length > 0 && (!enriched.requirements || enriched.requirements.length === 0)) {
        enriched.requirements = parsedHighlights;
      }
    } // end highlights parsing (plain-text only)

    if (!enriched.whyJoin) {
      const placementHighlight = rawDesc.includes('Placement') || rawDesc.includes('Job Assistance') || rawDesc.includes('Hiring Partners') || rawDesc.includes('Hiring');
      const salaryHighlight = rawDesc.match(/\d+\s*(?:LPA|Lakh|L)/i);
      
      enriched.whyJoin = [
        "Industry-Relevant Learning: Master high-demand skills like SQL, Python, AI, and Data Visualization.",
        placementHighlight ? "Job Assistance & Direct Support: Get mock interviews, 1:1 mentorship prep, and direct referral opportunities through hiring partners." : null,
        salaryHighlight ? `Compensation Opportunities: Position yourself for premium salary packages (up to ${salaryHighlight[0]} packages).` : null,
        "Practical Experience: Build real-world projects and case studies to showcase in your portfolio."
      ].filter(Boolean);
    }
    
    // Auto-create "How to Apply" if missing
    if (!enriched.howToApply) {
      enriched.howToApply = `
        <ol style="line-height: 1.8; padding-left: 1.25rem; margin: 0;">
          <li style="margin-bottom: 8px;">Click on the <strong>Apply Now</strong> button below to open the official registration page.</li>
          <li style="margin-bottom: 8px;">Fill in your details (Name, Contact, Education, Batch) in the application form.</li>
          <li style="margin-bottom: 8px;">Complete the initial screening profile to highlight your interest in Data Science &amp; Analytics.</li>
          <li style="margin-bottom: 8px;">Submit the application and await further instructions regarding onboarding or interviews.</li>
        </ol>
      `;
    }

    // Auto-create "Final Thoughts" if missing
    if (!enriched.finalThoughts) {
      const companyName = enriched.company || 'this company';
      const roleText = enriched.type || enriched.title || 'this role';
      const locationText = enriched.location ? ` in ${enriched.location}` : '';
      const batchText = enriched.batch ? ` for the ${enriched.batch} batch` : '';
      enriched.finalThoughts = `
        <p>The <strong>${companyName}</strong> recruitment drive is a great opportunity${batchText} to kickstart or advance your career${locationText}. If you meet the eligibility criteria for <strong>${roleText}</strong>, don't wait — opportunities like this don't come around often.</p>
        <p>Make sure to:</p>
        <ul style="line-height: 1.9; padding-left: 1.25rem; margin: 0 0 12px 0;">
          <li>Read the official notification carefully before applying</li>
          <li>Keep all required documents ready before filling the form</li>
          <li>Apply before the last date to avoid last-minute issues</li>
          <li>Follow <a href="https://nextjobpost.in" style="color:#6366f1;font-weight:600;">NextJobPost</a> for the latest job alerts and updates</li>
        </ul>
        <p>We wish you the best of luck in your application process!</p>
      `;
    }
  }
  return enriched;
};

export default function JobDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);

  const getCTRMetaTitle = () => {
    if (!job) return '';
    if (job.metaTitle) return job.metaTitle;
    if (job.isGovernment) {
      const vacancyText = job.vacancies && job.vacancies !== 'As per notification' ? ` – ${job.vacancies} Vacancies` : '';
      return `${job.title}${vacancyText} | Apply Online`;
    } else {
      return `${job.title} at ${job.company} | Apply Now`;
    }
  };

  const getJobDetailsLabel = () => {
    const titleLower = String(job?.title || '').toLowerCase();
    if (titleLower.includes('syllabus') || titleLower.includes('pattern')) return 'Exam details';
    if (titleLower.includes('admit') || titleLower.includes('result') || titleLower.includes('answer key')) return 'Exam info';
    return 'Job details';
  };

  const getJobDescriptionLabel = () => {
    const titleLower = String(job?.title || '').toLowerCase();
    if (titleLower.includes('syllabus')) return 'Syllabus';
    if (titleLower.includes('pattern')) return 'Exam pattern';
    if (titleLower.includes('admit')) return 'Admit card';
    if (titleLower.includes('result')) return 'Result';
    if (titleLower.includes('answer key')) return 'Answer key';
    return 'Job description';
  };
  const [loading, setLoading] = useState(true);
  const [recent, setRecent] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const cache = useCache();
  const [hasApplied, setHasApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeTab, setActiveTab] = useState('job-details');
  const isScrollingRef = React.useRef(false);
  const scrollTimeoutRef = React.useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // Scroll active tab into view in the horizontal tab bar
  useEffect(() => {
    if (!isMobile || !activeTab) return;
    const activeEl = document.querySelector(`.mobile-tabs span[data-tab-id="${activeTab}"]`);
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }
  }, [activeTab, isMobile]);

  useEffect(() => {
    if (!isMobile || !job) return;
    const handleScroll = () => {
      if (isScrollingRef.current) {
        // If we are currently scrolling via a tab click, debounce the unlock of scroll-spy
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = setTimeout(() => {
          isScrollingRef.current = false;
        }, 150); // scroll has finished if no scroll events for 150ms
        return;
      }
      const sections = [
        { id: 'job-details', target: 'job-details-top' },
        (job.telegramFields || job.jobDescription) && { id: 'job-description', target: 'job-description-section' },
        job.aboutCompany && { id: 'about-company', target: 'about-company-section' },
        job.responsibilities && job.responsibilities.length > 0 && { id: 'responsibilities', target: 'responsibilities-section' },
        job.requirements && job.requirements.length > 0 && { id: 'requirements', target: 'requirements-section' },
        job.whyJoin && { id: 'why-join', target: 'why-join-section' },
        job.howToApply && { id: 'how-to-apply', target: 'how-to-apply-section' },
        job.finalThoughts && { id: 'final-thoughts', target: 'final-thoughts-section' },
        (!job.isGovernment || job.pdfLink || job.applyLink || (job.extractedLinks && job.extractedLinks.length > 0)) && { id: 'essential-links', target: 'essential-links-section' },
        recent.length > 0 && { id: 'similar-jobs', target: 'similar-jobs-section' }
      ].filter(Boolean);

      // Check if we are at the bottom of the page
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50;
      if (isAtBottom && sections.length > 0) {
        setActiveTab(sections[sections.length - 1].id);
        return;
      }

      let active = 'job-details';
      for (const section of sections) {
        const el = document.getElementById(section.target);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 130) {
            active = section.id;
          }
        }
      }
      setActiveTab(active);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, job, recent]);

  useEffect(() => {
    if (job?._id) {
      setHasApplied(localStorage.getItem(`applied_${job._id}`) === 'true');
      setIsSaved(localStorage.getItem(`saved_${job._id}`) === 'true');
    }
  }, [job]);

  const handleApplyAction = () => {
    if (job?._id) {
      try {
        localStorage.setItem(`applied_${job._id}`, 'true');
      } catch (e) {
        console.error("Local storage error during apply:", e);
      }
      setHasApplied(true);
      trackApplyJobClicked(job);
      api.post('/activity/log', {
        activityType: 'apply',
        jobId: job._id,
        sessionId: sessionStorage.getItem('_njp_session_id') || sessionStorage.getItem('session_id') || 'guest'
      }).catch(() => {});
    }
  };

  const handleSaveAction = () => {
    if (job?._id) {
      try {
        const nextSaved = !isSaved;
        localStorage.setItem(`saved_${job._id}`, String(nextSaved));
        setIsSaved(nextSaved);
        // Keep simple interaction logs
        trackEvent(nextSaved ? 'Job Saved' : 'Job Unsaved', {
          jobId: job._id,
          title: job.title,
          company: job.company
        });
        api.post('/activity/log', {
          activityType: nextSaved ? 'save' : 'unsave',
          jobId: job._id,
          sessionId: sessionStorage.getItem('_njp_session_id') || sessionStorage.getItem('session_id') || 'guest'
        }).catch(() => {});
      } catch (e) {
        console.error("Local storage error during save:", e);
      }
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    trackJobShared('Copy Link', job);
  };

  const handleApply = (e, applyUrl) => {
    // Trigger ad: synchronous window.open inside onClick = direct user gesture = NOT blocked by browser
    try { window.open('about:blank', '_blank'); } catch (_) {}
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!slug || ['ads.txt', 'robots.txt', 'sitemap.xml'].includes(slug.toLowerCase())) {
      setJob(null);
      setRecent([]);
      setLoading(false);
      window.prerenderReady = true;
      return;
    }

    let isMounted = true;
    window.prerenderReady = false; // Mark as not ready while we fetch this specific job

    const fetchData = async () => {
      setLoading(true);
      try {
        let jobRes;
        try {
          jobRes = await cache.get((url) => api.get(url), `/jobs/${slug}`);
        } catch (error) {
          const fallbackRes = await cache.get((url) => api.get(url), '/jobs?limit=100');
          const allJobs = fallbackRes.data?.data || fallbackRes.data || [];
          jobRes = { data: { data: allJobs.find((j) => j.slug === slug) || null } };
        }

        if (!isMounted) return;
        const potentialJob = jobRes?.data?.data || jobRes?.data || null;
        // Verify we actually got a valid job object containing a title field
        const currentJob = (potentialJob && typeof potentialJob === 'object' && potentialJob.title) ? potentialJob : null;

        if (currentJob) {
          const enriched = getEnrichedJob(currentJob);
          if (isMounted) { setJob(enriched); }

          // Track Job Detail Viewed and dynamic Page View events
          trackJobDetailViewed(currentJob);
          trackPageView(window.location.pathname, {
            category: currentJob.type,
            jobId: currentJob._id,
            jobTitle: currentJob.title
          });

          // Log view activity to backend
          api.post('/activity/log', {
            activityType: 'view',
            jobId: currentJob._id,
            sessionId: sessionStorage.getItem('_njp_session_id') || sessionStorage.getItem('session_id') || 'guest'
          }).catch(() => {});

          const recentRes = await cache.get((url) => api.get(url), `/jobs/${currentJob._id}/related?limit=6`);
          const otherJobs = recentRes.data?.data || recentRes.data || [];

          if (isMounted) {
            setRecent(otherJobs);
          }

          // Fetch personalized recommendations in the background
          const sessionVal = sessionStorage.getItem('_njp_session_id') || sessionStorage.getItem('session_id') || 'guest';
          api.get(`/recommendations?sessionId=${sessionVal}`).then(recRes => {
            if (isMounted && recRes.data?.success) {
              setRecommendations(recRes.data.data);
            }
          }).catch(() => {});
        } else {
          if (isMounted) { setJob(null); }
        }

      } catch (error) {
        if (isMounted) { setJob(null); setRecent([]); }
      } finally {
        if (isMounted) { setLoading(false); }
        window.prerenderReady = true; // Signal to prerenderer that rendering is complete
      }
    };

    fetchData();

    return () => { isMounted = false; };
  }, [slug]);

  const displayRecommendedJobs = React.useMemo(() => {
    let list = [];
    if (recommendations && recommendations.recommended && recommendations.recommended.length > 0) {
      list = recommendations.recommended.filter(j => j._id !== job?._id);
    }
    if (list.length === 0) {
      list = recent.filter(j => j._id !== job?._id);
    }
    return list.slice(0, 3);
  }, [recommendations, recent, job?._id]);

  if (loading) return <JobDetailsSkeleton isMobile={isMobile} />;
  if (!job) return <p className="text-center text-muted">Job not found.</p>;

  // Get up to 3 related jobs for interspersion
  const intersperseJobs = recent.slice(0, 3);

  const getThemeColor = () => {
    if (!job.isGovernment) return '#7c3aed'; // default premium purple for off-campus
    const pt = String(job.postType || '').toLowerCase();
    if (pt.includes('admit')) return '#1d4ed8'; // blue
    if (pt.includes('result')) return '#b45309'; // amber/gold
    if (pt.includes('answer')) return '#6d28d9'; // purple
    return '#1d4ed8'; // blue for standard government job
  };

  const themeColor = getThemeColor();

  const isExpired = job.lastDate && new Date(job.lastDate) < new Date();

  const ExpiredBanner = () => {
    if (!isExpired) return null;
    const formattedDate = new Date(job.lastDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    return (
      <div className="expired-banner p-3 p-md-4 rounded-4 mb-4" style={{
        background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
        border: '1px solid #fca5a5',
        color: '#991b1b',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        fontFamily: "'Outfit', 'Inter', sans-serif"
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
          <span style={{ fontSize: '1.75rem', lineHeight: 1 }}>⚠️</span>
          <div style={{ flexGrow: 1 }}>
            <h5 className="fw-bold mb-1" style={{ color: '#991b1b', fontSize: '1.1rem' }}>This Posting Has Expired</h5>
            <p className="mb-3" style={{ fontSize: '0.9rem', color: '#7f1d1d', opacity: 0.95 }}>
              The application deadline (<strong>{formattedDate}</strong>) has passed. This listing is no longer accepting active applications.
            </p>
            
            {recent && recent.length > 0 && (
              <div style={{ marginTop: '12px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#7f1d1d', marginBottom: '8px' }}>
                  🔥 Recommended Active Openings:
                </div>
                <div className="row g-2">
                  {recent.slice(0, 3).map((rJob) => (
                    <div key={rJob._id} className="col-12 col-md-4">
                      <a
                        href={`/${rJob.slug}`}
                        className="d-block p-2.5 rounded-3 bg-white border text-decoration-none hover-shadow"
                        style={{
                          fontSize: '0.82rem',
                          color: '#1e293b',
                          transition: 'all 0.2s ease',
                          borderColor: '#fca5a5'
                        }}
                      >
                        <div className="fw-bold text-truncate" style={{ color: '#0f172a' }}>{rJob.title}</div>
                        <div className="text-muted text-truncate" style={{ fontSize: '0.74rem' }}>{rJob.company}</div>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-3 d-flex flex-wrap gap-2">
              <a href="/results" className="btn btn-sm btn-outline-danger fw-bold rounded-pill px-3 py-1.5" style={{ fontSize: '0.78rem' }}>
                📋 Check Latest Results
              </a>
              <a href="/admit-cards" className="btn btn-sm btn-outline-danger fw-bold rounded-pill px-3 py-1.5" style={{ fontSize: '0.78rem' }}>
                🎟️ Check Admit Cards
              </a>
              <a href="/govt-jobs" className="btn btn-sm btn-danger text-white fw-bold rounded-pill px-3 py-1.5" style={{ fontSize: '0.78rem', backgroundColor: '#dc2626', border: 'none' }}>
                🔍 Search Active Jobs
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Remap generic postType values to a user-friendly label for display
  const rawPostType = String(job.postType || '').trim();
  const displayPostType = (rawPostType === 'Job Post' || rawPostType === 'Job')
    ? 'Government Job'
    : rawPostType || 'Government Job';

  const getHeaderStyle = () => ({
    background: `linear-gradient(90deg, ${themeColor}e0, ${themeColor})`,
    color: '#fff',
    fontSize: '1.15rem',
    fontWeight: '700',
    borderLeft: '5px solid rgba(255, 255, 255, 0.45)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  });

  // Helper function for rendering lists securely
  const renderList = (data) => {
    if (!data) return null;
    if (typeof data === 'string' && data.includes('<')) {
      return (
        <div className="rich-text-section ps-3">
          <RichTextDisplay content={data} />
        </div>
      );
    }
    const items = Array.isArray(data) ? data : data.split('\n');
    return (
      <ul className="capsule-list ps-4" style={{ lineHeight: '1.8' }}>
        {items.filter(item => item.trim()).map((item, idx) => (
          <li key={idx} style={{ marginBottom: '8px' }}>{item.replace(/^[✓→●\-*]\s*/, '').trim()}</li>
        ))}
      </ul>
    );
  };

  const capitalize = (s) => (s && s[0].toUpperCase() + s.slice(1)) || '';

  const handleSocialJoinClick = (platform) => {
    trackEvent('Social Group Join Clicked', {
      platform,
      jobId: job?._id,
      company: job?.company
    });
  };


  const getEmploymentType = (type) => {
    if (!type) return "FULL_TIME";
    const t = type.toLowerCase();
    if (t.includes("intern")) return "INTERN";
    if (t.includes("contract")) return "CONTRACT";
    if (t.includes("part")) return "PART_TIME";
    return "FULL_TIME";
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.jobDescription || job.description,
    "datePosted": job.createdAt || new Date().toISOString(),
    "validThrough": job.lastDate || undefined,
    "employmentType": getEmploymentType(job.type),
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.company,
      "logo": `${window.location.origin}/logo.png`
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.location || "Pan India",
        "addressCountry": "IN"
      }
    },
    "directApply": true,
    "jobLocationType": (job.location && job.location.toLowerCase().includes("remote")) ? "TELECOMMUTE" : undefined
  };

  if (isMobile) {
    const tabs = [
      { id: 'job-details', label: getJobDetailsLabel(), target: 'job-details-top' },
      (job.telegramFields || job.jobDescription) && { id: 'job-description', label: getJobDescriptionLabel(), target: 'job-description-section' },
      job.aboutCompany && { id: 'about-company', label: 'About company', target: 'about-company-section' },
      job.responsibilities && job.responsibilities.length > 0 && { id: 'responsibilities', label: 'Responsibilities', target: 'responsibilities-section' },
      job.requirements && job.requirements.length > 0 && { id: 'requirements', label: 'Requirements', target: 'requirements-section' },
      job.whyJoin && { id: 'why-join', label: 'Why join', target: 'why-join-section' },
      job.howToApply && { id: 'how-to-apply', label: 'How to apply', target: 'how-to-apply-section' },
      job.finalThoughts && { id: 'final-thoughts', label: 'Final thoughts', target: 'final-thoughts-section' },
      (!job.isGovernment || job.pdfLink || job.applyLink || (job.extractedLinks && job.extractedLinks.length > 0)) && { id: 'essential-links', label: 'Links', target: 'essential-links-section' },
      recent.length > 0 && { id: 'similar-jobs', label: 'Similar jobs', target: 'similar-jobs-section' }
    ].filter(Boolean);

    const handleTabClick = (tabId, targetId) => {
      setActiveTab(tabId);
      isScrollingRef.current = true;
      const element = document.getElementById(targetId);
      if (element) {
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: elementPosition - 110,
          behavior: 'smooth'
        });
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        // Fallback timer in case the scroll event doesn't fire (e.g. already at target)
        scrollTimeoutRef.current = setTimeout(() => {
          isScrollingRef.current = false;
        }, 1200);
      }
    };

    const scrollToRelatedJobs = () => {
      const element = document.getElementById('similar-jobs-section');
      if (element) {
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: elementPosition - 110,
          behavior: 'smooth'
        });
      }
    };

    return (
      <div className="job-details-mobile mt-0 mb-5" style={{ backgroundColor: '#ffffff', minHeight: '100vh', paddingBottom: '80px', fontFamily: "'Inter', sans-serif" }}>
        <Helmet>
          <title>{getCTRMetaTitle()}</title>
          <meta name="description" content={job.metaDescription || job.shortSummary || `Apply for the ${job.title} job opening at ${job.company} in ${job.location}. Find eligibility criteria, responsibilities, and apply now.`} />
          <link rel="canonical" href={window.location.href} />
          
          {/* Open Graph / Facebook */}
          <meta property="og:type" content="article" />
          <meta property="og:title" content={getCTRMetaTitle()} />
          <meta property="og:description" content={job.metaDescription || job.shortSummary || `Apply for the ${job.title} job opening at ${job.company} in ${job.location}.`} />
          <meta property="og:image" content={getImageUrl(job.image) || `${window.location.origin}/logo.png`} />
          <meta property="og:url" content={window.location.href} />
          
          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={getCTRMetaTitle()} />
          <meta name="twitter:description" content={job.metaDescription || job.shortSummary || `Apply for the ${job.title} job opening at ${job.company} in ${job.location}.`} />
          <meta name="twitter:image" content={getImageUrl(job.image) || `${window.location.origin}/logo.png`} />

          {/* Structured Data (Google Jobs Schema) */}
          <script type="application/ld+json">
            {JSON.stringify(jsonLd)}
          </script>
        </Helmet>

        {/* Sticky Mobile Header */}
        <div style={{
          position: 'sticky',
          top: 0,
          zIndex: 1020,
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          height: '54px'
        }}>
          {/* Back button */}
          <button 
            onClick={() => {
              if (window.history.state && window.history.state.idx > 0) {
                navigate(-1);
              } else {
                navigate('/');
              }
            }} 
            style={{ background: 'none', border: 'none', padding: '6px', color: '#1e293b', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          
          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Bookmark button */}
            <button onClick={handleSaveAction} style={{ background: 'none', border: 'none', padding: '6px', color: '#64748b', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              {isSaved ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#d97706" viewBox="0 0 24 24">
                  <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              )}
            </button>

            {/* Share button */}
            <button onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: job.title,
                  text: `Check out this job: ${job.title}`,
                  url: window.location.href,
                }).catch(() => {});
              } else {
                handleCopyLink();
              }
            }} style={{ background: 'none', border: 'none', padding: '6px', color: '#64748b', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742l4.606-2.303m0 0a3 3 0 10-3.612-4.14a3 3 0 003.612 4.14zm-4.606 2.303a3 3 0 110 5.258l4.606-2.303m-4.606-2.955a3 3 0 010-2.303" />
              </svg>
            </button>

            {/* Join Us button */}
            <a href="https://chat.whatsapp.com/LVpuUJluTpUEdIc4daAemQ" target="_blank" rel="noopener noreferrer" className="btn btn-sm" style={{
              backgroundColor: '#f97316',
              color: '#fff',
              fontWeight: '700',
              borderRadius: '20px',
              fontSize: '0.78rem',
              padding: '6px 14px',
              border: 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.3px',
              textDecoration: 'none'
            }}>
              Join Us
            </a>
          </div>
        </div>

        {/* Relative Posted Time Banner */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 16px',
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #f1f5f9',
          fontSize: '0.8rem',
          color: '#64748b',
          fontWeight: '500'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#16a34a', fontWeight: '600' }}>
            <span style={{ fontSize: '1rem' }}>👍</span> Be an early applicant
          </span>
          <span>{job.createdAt ? timeAgo(job.createdAt) : 'Recently Posted'}</span>
        </div>

        {/* Sticky Mobile Tabs Bar */}
        <div className="mobile-tabs" style={{
          position: 'sticky',
          top: '54px',
          zIndex: 1010,
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          padding: '0 8px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
          {tabs.map((tab) => (
            <span
              key={tab.id}
              data-tab-id={tab.id}
              onClick={() => handleTabClick(tab.id, tab.target)}
              style={{
                display: 'inline-block',
                padding: '12px 14px',
                fontSize: '0.86rem',
                fontWeight: '700',
                color: activeTab === tab.id ? '#0f172a' : '#64748b',
                borderBottom: activeTab === tab.id ? `3px solid ${themeColor}` : '3px solid transparent',
                cursor: 'pointer',
                transition: 'all 150ms ease'
              }}
            >
              {tab.label}
            </span>
          ))}
        </div>

        {/* Main Content Area (Animated - transform localized to content region) */}
        <div className="animate-fade-in-up" style={{ padding: '20px 16px' }}>
          <ExpiredBanner />
          
          {/* Job details top block */}
          <div id="job-details-top" style={{ marginBottom: '20px' }}>
            {/* Title */}
            <h1 style={{ fontSize: '1.45rem', fontWeight: '800', lineHeight: '1.35', color: '#0f172a', marginBottom: '8px' }}>
              {job.title}
            </h1>
            {/* Company / Brand Name */}
            <div style={{ fontSize: '1.05rem', fontWeight: '700', color: themeColor, marginBottom: '12px' }}>
              {job.company || 'Government Recruitment'}
            </div>
            
            {/* Posted Date & Publisher row (Naukri style meta section) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '0.82rem', color: '#64748b', marginBottom: '12px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span>{job.createdAt ? new Date(job.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recently Posted'}</span>
              <span>•</span>
              <span>Posted by <a href="https://www.linkedin.com/in/next-job-post-199b5b371/" target="_blank" rel="noopener noreferrer" style={{ color: '#0d6efd', fontWeight: '700', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'} onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}>NextJobPost</a></span>
            </div>

            {/* Share and Follow Bar */}
            <div className="share-follow-bar p-3 rounded-3 mt-3 d-flex align-items-center gap-2 flex-nowrap" style={{
              backgroundColor: '#f0f7ff',
              border: '1px solid #dbeafe',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              width: '100%',
              maxWidth: '100%',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              marginBottom: '16px'
            }}>
              <button 
                onClick={handleCopyLink}
                className="btn btn-sm text-white fw-bold d-inline-flex align-items-center gap-1.5 btn-share-copylink"
                style={{ fontSize: '0.78rem', padding: '5px 10px', borderRadius: '15px' }}
              >
                {copied ? 'Copied' : 'Copy Link'}
              </button>

              <div className="share-follow-bar-divider" style={{ width: '1px', height: '18px', backgroundColor: '#cbd5e1', margin: '0 6px', flexShrink: 0 }}></div>

              <span className="share-follow-label" style={{ fontSize: '0.8rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginRight: '4px', flexShrink: 0 }}>Follow</span>

              <a 
                href={job.whatsapp ? (job.whatsapp.startsWith('http') ? job.whatsapp : 'https://wa.me/' + job.whatsapp.replace(/[^0-9+]/g, '')) : 'https://chat.whatsapp.com/LVpuUJluTpUEdIc4daAemQ'}
                onClick={() => handleSocialJoinClick('WhatsApp')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm fw-bold d-inline-flex align-items-center gap-1.5 btn-follow-whatsapp"
                style={{ fontSize: '0.78rem', padding: '5px 10px', borderRadius: '15px' }}
              >
                Join WhatsApp
              </a>

              <a 
                href={job.telegram ? (job.telegram.startsWith('http') ? job.telegram : 'https://t.me/' + job.telegram.replace(/^@/, '')) : 'https://t.me/nextjobpost'}
                onClick={() => handleSocialJoinClick('Telegram')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm fw-bold d-inline-flex align-items-center gap-1.5 btn-follow-telegram"
                style={{ fontSize: '0.78rem', padding: '5px 10px', borderRadius: '15px' }}
              >
                Join Telegram
              </a>
            </div>

            {/* Category / Post Type Badge */}
            {job.isGovernment && (
              <span className="badge rounded-pill px-3 py-1.5 mb-2" style={{
                fontSize: '0.78rem',
                backgroundColor: `${themeColor}12`,
                color: themeColor,
                border: `1px solid ${themeColor}30`,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontWeight: '700'
              }}>
                {displayPostType}
              </span>
            )}
          </div>

          {/* Job Highlights card */}
          <div className="p-3 mb-4 rounded-3" style={{ backgroundColor: '#f8fafc', border: '1px solid #f1f5f9' }}>
            <h3 style={{ fontSize: '0.92rem', fontWeight: '800', color: '#091e42', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Job highlights</h3>
            <p style={{ fontSize: '0.88rem', color: '#475569', margin: 0, lineHeight: '1.5', fontWeight: '500' }}>
              {job.eligibility || job.education || 'Graduate / 12th Pass or equivalent qualification.'}
            </p>
          </div>

          {/* Parameters List */}
          <div className="d-flex flex-column gap-3 mb-4" style={{ padding: '4px 0' }}>
            {job.experience && (
              <div className="d-flex align-items-center gap-3">
                <div style={{ color: '#64748b', display: 'flex', alignItems: 'center', width: '20px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span style={{ fontSize: '0.92rem', color: '#334155', fontWeight: '600' }}>{job.experience}</span>
              </div>
            )}

            <div className="d-flex align-items-center gap-3">
              <div style={{ color: '#64748b', display: 'flex', alignItems: 'center', width: '20px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span style={{ fontSize: '0.92rem', color: '#334155', fontWeight: '600' }}>
                {job.vacancies || extractVacancy(job.title) || 'As per official notification'}
              </span>
            </div>

            {job.salary && (
              <div className="d-flex align-items-center gap-3">
                <div style={{ color: '#64748b', display: 'flex', alignItems: 'center', width: '20px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span style={{ fontSize: '0.92rem', color: themeColor, fontWeight: '700' }}>{job.salary}</span>
              </div>
            )}

            {job.location && (
              <div className="d-flex align-items-center gap-3">
                <div style={{ color: '#64748b', display: 'flex', alignItems: 'center', width: '20px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span style={{ fontSize: '0.92rem', color: '#334155', fontWeight: '600' }}>{job.location}</span>
              </div>
            )}

            {job.skills && job.skills.length > 0 && (
              <div className="mt-2" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', display: 'block', marginBottom: '8px', letterSpacing: '0.5px' }}>Key skills</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {job.skills.map((skill, idx) => (
                    <span key={idx} style={{
                      backgroundColor: '#f8fafc',
                      color: '#475569',
                      fontSize: '0.82rem',
                      padding: '5px 12px',
                      borderRadius: '20px',
                      fontWeight: '600',
                      border: '1px solid #e2e8f0'
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <hr style={{ borderTop: '1px solid #cbd5e1', margin: '24px 0' }} />

          {/* Dynamic Content Sections */}
          
          {/* Job Description section */}
          {(job.telegramFields || job.jobDescription) && (
            <div id="job-description-section" className="mb-5 text-dark" style={{ scrollMarginTop: '110px' }}>
              <h2 className="capsule-header p-3 rounded" style={getHeaderStyle()}>
                {getJobDescriptionLabel()}
              </h2>
              {job.telegramFields && job.jobDescription && (
                <div style={{ padding: '8px 4px 12px', fontSize: '0.97rem', color: '#334155', fontWeight: '500' }}>
                  {stripUnicodeBold(job.jobDescription)}
                </div>
              )}
              {job.telegramFields && (
                <TelegramJobInfoGrid
                  fields={job.telegramFields}
                  themeColor={themeColor}
                />
              )}
              {!job.telegramFields && job.jobDescription && (
                <div className="rich-text-section ps-1">
                  <RichTextDisplay content={job.jobDescription} />
                </div>
              )}
            </div>
          )}

          {/* About Company Section */}
          {job.aboutCompany && (
            <div id="about-company-section" className="mb-5 text-dark" style={{ scrollMarginTop: '110px' }}>
              <h2 className="capsule-header p-3 rounded" style={getHeaderStyle()}>
                🏢 {job.isGovernment ? `About ${job.company}` : `About Company`}
              </h2>
              <div className="rich-text-section ps-1">
                <RichTextDisplay content={job.aboutCompany} />
              </div>
            </div>
          )}

          {/* Responsibilities Section */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div id="responsibilities-section" className="mb-5 text-dark" style={{ scrollMarginTop: '110px' }}>
              <h2 className="capsule-header p-3 rounded" style={getHeaderStyle()}>
                🎯 Job Responsibilities
              </h2>
              {renderList(job.responsibilities)}
            </div>
          )}

          {/* Requirements/Eligibility Section */}
          {job.requirements && job.requirements.length > 0 && (
            <div id="requirements-section" className="mb-5 text-dark" style={{ scrollMarginTop: '110px' }}>
              <h2 className="capsule-header p-3 rounded" style={getHeaderStyle()}>
                🎓 Eligibility & Requirements
              </h2>
              {renderList(job.requirements)}
            </div>
          )}

          {/* Why Join Section */}
          {job.whyJoin && (
            <div id="why-join-section" className="mb-5 text-dark" style={{ scrollMarginTop: '110px' }}>
              <h2 className="capsule-header p-3 rounded" style={getHeaderStyle()}>
                ✨ Why Join?
              </h2>
              {renderList(job.whyJoin)}
            </div>
          )}

          {/* How to Apply Section */}
          {job.howToApply && (
            <div id="how-to-apply-section" className="mb-5 text-dark" style={{ scrollMarginTop: '110px' }}>
              <h2 className="capsule-header p-3 rounded" style={getHeaderStyle()}>
                🚀 How to Apply
              </h2>
              <div className="rich-text-section ps-1">
                <RichTextDisplay content={job.howToApply} />
              </div>
            </div>
          )}

          {/* Essential Links Section */}
          {(job.pdfLink || job.applyLink || (job.extractedLinks && job.extractedLinks.length > 0)) && (
            <div id="essential-links-section" className="mb-5" style={{ scrollMarginTop: '110px' }}>
              <h2 className="capsule-header p-3 rounded mb-3" style={getHeaderStyle()}>
                🔗 Official Links
              </h2>
              
              {/* PDF & Apply buttons box */}
              {(job.pdfLink || job.applyLink) && (
                <div className="p-3 rounded-3 mb-3 border border-light" style={{ backgroundColor: '#f8fafc' }}>
                  <div className="d-flex flex-wrap gap-2.5">
                    {job.pdfLink && (
                      (!job.pdfLink.includes('govtjobsalert.in') && !job.pdfLink.includes('sarkariresult.com')) ||
                      job.pdfLink.toLowerCase().endsWith('.pdf')
                    ) && (
                      <a href={job.pdfLink} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-danger fw-bold d-inline-flex align-items-center gap-1.5 px-3 py-2" style={{ borderRadius: '6px', flex: '1 1 auto' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download PDF
                      </a>
                    )}
                    {job.applyLink && (
                      <a 
                        href={job.applyLink} 
                        onClick={(e) => {
                          handleApply(e, job.applyLink);
                          handleApplyAction();
                        }}
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn btn-sm text-white fw-bold d-inline-flex align-items-center gap-1.5 px-4 py-2" 
                        style={{ backgroundColor: themeColor, borderRadius: '6px', border: 'none', flex: '1 1 auto' }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Apply Online
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Extracted private links — only show structurally valid, non-tracker URLs */}
              {!job.isGovernment && job.extractedLinks && job.extractedLinks.filter(l => isValidJobUrl(l.url)).length > 0 && (
                <div className="essential-links-section">
                  <ul>
                    {job.extractedLinks.filter(l => isValidJobUrl(l.url)).map((link, idx) => (
                      <li key={idx}>
                        <a href={link.url} target="_blank" rel="noopener noreferrer nofollow">
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Action Center - for mobile completeness */}
          <div className="p-4 rounded-4 mb-5" style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 className="fw-bold mb-2" style={{ fontSize: '1.1rem', color: '#1e293b' }}>
              ⚡ Action Center
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#475569', marginBottom: '12px' }}>
              Apply directly, save this notification, or share it with your network!
            </p>
            {hasApplied && (
              <div className="alert alert-success p-2.5 mb-3" style={{ borderRadius: '6px', fontSize: '0.88rem' }}>
                🎉 <strong>Applied!</strong> Best of luck!
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button 
                onClick={handleSaveAction}
                className="btn btn-sm d-inline-flex align-items-center justify-content-center fw-bold"
                style={{
                  padding: '10px 20px',
                  fontSize: '0.9rem',
                  borderRadius: '6px',
                  backgroundColor: isSaved ? '#fef3c7' : '#ffffff',
                  border: '1.5px solid #d97706',
                  color: '#d97706',
                  width: '100%'
                }}
              >
                {isSaved ? '⭐ Saved' : '⏳ Save for Later'}
              </button>
            </div>
            
            {/* Mobile Share & Follow bar inside action center card */}
            <div className="share-follow-bar p-3 rounded-3 mt-3 d-flex align-items-center gap-2 flex-nowrap" style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              width: '100%',
              maxWidth: '100%'
            }}>
              <span className="share-follow-label" style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginRight: '4px', flexShrink: 0 }}>Share</span>
              <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`🔥 *${job.title}*\n👉 Apply Here: ${window.location.href}`)}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm text-white fw-bold d-inline-flex align-items-center gap-1.5 btn-share-whatsapp">WhatsApp</a>
              <a href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm text-white fw-bold d-inline-flex align-items-center gap-1.5 btn-share-telegram">Telegram</a>
            </div>
          </div>

          {/* Recommended Jobs section */}
          {displayRecommendedJobs.length > 0 && (
            <div id="similar-jobs-section" className="mb-4" style={{ scrollMarginTop: '110px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '1.4rem' }}>🎯</span>
                <h3 className="fw-bold m-0" style={{ fontSize: '1.15rem', color: '#1e293b' }}>
                  Recommended Jobs For You
                </h3>
              </div>
              <p className="text-muted" style={{ fontSize: '0.82rem', marginBottom: '1rem' }}>
                Personalized matches based on your profile and recent activities.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {displayRecommendedJobs.map((relatedJob) => {
                  const score = relatedJob.matchScore || 75;
                  return (
                    <div key={relatedJob._id} className="p-3 bg-white rounded-3 shadow-sm border border-light" style={{ transition: 'transform 150ms ease' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <span className="text-muted small fw-bold" style={{ textTransform: 'uppercase' }}>
                          {relatedJob.company}
                        </span>
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: '800',
                          background: score >= 80 ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                          color: '#ffffff',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px'
                        }}>
                          🎯 {score}% Match
                        </span>
                      </div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '6px', lineHeight: '1.3' }}>
                        <Link to={getJobUrl(relatedJob)} className="text-decoration-none text-dark">
                          {relatedJob.title}
                        </Link>
                      </h4>
                      <p className="text-muted small mb-2">{relatedJob.location || 'India'}</p>
                      <Link 
                        to={getJobUrl(relatedJob)} 
                        className="btn btn-sm fw-bold" 
                        style={{ 
                          fontSize: '0.8rem', 
                          padding: '4px 12px', 
                          borderRadius: '4px', 
                          border: `1.5px solid ${themeColor}`, 
                          color: themeColor,
                          backgroundColor: 'transparent',
                          transition: 'all 150ms ease'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.backgroundColor = themeColor;
                          e.currentTarget.style.color = '#ffffff';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = themeColor;
                        }}
                      >
                        View details
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────
              DYNAMIC EDUCATIONAL SECTIONS
              Uniquely generated per job — adds 1000+
              words of original, high-value guidance
              ───────────────────────────────────────── */}
          <DynamicJobGuide job={job} themeColor={themeColor} />

        </div>

        {/* Sticky Bottom Actions Bar (outside transform animation so fixed position works properly) */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1020,
          backgroundColor: '#ffffff',
          boxShadow: '0 -4px 16px rgba(0,0,0,0.06)',
          borderTop: '1px solid #e2e8f0',
          padding: '12px 16px',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          height: '68px'
        }}>
          <button
            onClick={scrollToRelatedJobs}
            style={{
              padding: '10px 18px',
              fontSize: '0.9rem',
              fontWeight: '700',
              backgroundColor: '#ffffff',
              border: '1.5px solid #cbd5e1',
              color: '#475569',
              borderRadius: '24px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              height: '42px',
              whiteSpace: 'nowrap'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Similar Jobs
          </button>
          
          <a
            href={job.applyLink}
            onClick={(e) => {
              handleApply(e, job.applyLink);
              handleApplyAction();
            }}
            target="_blank"
            rel="noopener noreferrer"
            className="btn text-white fw-bold d-inline-flex align-items-center justify-content-center"
            style={{
              backgroundColor: themeColor,
              borderRadius: '24px',
              padding: '10px 24px',
              fontSize: '0.95rem',
              height: '42px',
              flexGrow: 1,
              border: 'none',
              textDecoration: 'none'
            }}
          >
            Apply Now
          </a>
        </div>
      </div>
    );
  }

  // Desktop View
  return (
    <div className="job-details mt-0 mb-4 animate-fade-in-up">
      <Helmet>
        <title>{getCTRMetaTitle()}</title>
        <meta name="description" content={job.metaDescription || job.shortSummary || `Apply for the ${job.title} job opening at ${job.company} in ${job.location}. Find eligibility criteria, responsibilities, and apply now.`} />
        <link rel="canonical" href={window.location.href} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={getCTRMetaTitle()} />
        <meta property="og:description" content={job.metaDescription || job.shortSummary || `Apply for the ${job.title} job opening at ${job.company} in ${job.location}.`} />
        <meta property="og:image" content={getImageUrl(job.image) || `${window.location.origin}/logo.png`} />
        <meta property="og:url" content={window.location.href} />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={getCTRMetaTitle()} />
        <meta name="twitter:description" content={job.metaDescription || job.shortSummary || `Apply for the ${job.title} job opening at ${job.company} in ${job.location}.`} />
        <meta name="twitter:image" content={getImageUrl(job.image) || `${window.location.origin}/logo.png`} />

        {/* Structured Data (Google Jobs Schema) */}
<script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>
      <div className="row g-4">
        <div className="col-12 col-lg-8 col-left">
          <ExpiredBanner />
          <div className="job-header-section mb-4 mt-2">
            <div className="d-flex flex-wrap align-items-center gap-2.5 mb-3">
              {/* Category Badge */}
              {job.isGovernment && (
                <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill shadow-sm" style={{
                  background: 
                    String(job.postType || '').toLowerCase().includes('admit') ? 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)' :
                    String(job.postType || '').toLowerCase().includes('result') ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' :
                    String(job.postType || '').toLowerCase().includes('answer') ? 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)' :
                    'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                  border: 
                    String(job.postType || '').toLowerCase().includes('admit') ? '1px solid #3b82f6' :
                    String(job.postType || '').toLowerCase().includes('result') ? '1px solid #f59e0b' :
                    String(job.postType || '').toLowerCase().includes('answer') ? '1px solid #a855f7' :
                    '1px solid #3b82f6',
                  color: 
                    String(job.postType || '').toLowerCase().includes('admit') ? '#1d4ed8' :
                    String(job.postType || '').toLowerCase().includes('result') ? '#b45309' :
                    String(job.postType || '').toLowerCase().includes('answer') ? '#6d28d9' :
                    '#1d4ed8',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  <span className="d-inline-flex align-items-center gap-1.5">
                    {String(job.postType || '').toLowerCase().includes('admit') ? (
                      <>
                        <span style={{ fontSize: '1rem', lineHeight: '1' }}>🪪</span>
                        <span>Exam Admit Card</span>
                      </>
                    ) : String(job.postType || '').toLowerCase().includes('result') ? (
                      <>
                        <span style={{ fontSize: '1rem', lineHeight: '1' }}>📢</span>
                        <span>Exam Result Out</span>
                      </>
                    ) : String(job.postType || '').toLowerCase().includes('answer') ? (
                      <>
                        <span style={{ fontSize: '1rem', lineHeight: '1' }}>🗝️</span>
                        <span>Answer Key Out</span>
                      </>
                    ) : (
                      <>
                        <span style={{ fontSize: '1rem', lineHeight: '1' }}>🏛️</span>
                        <span>Govt Recruitment</span>
                      </>
                    )}
                  </span>
                </div>
              )}
            </div>

            <h1 className="fw-bold mb-3" style={{ fontSize: '1.95rem', lineHeight: '1.4', color: '#0f172a', letterSpacing: '-0.02em' }}>{job.title}</h1>
            <div className="job-meta-info" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              {/* Calendar Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#64748b" strokeWidth="2" style={{ flexShrink: 0 }}>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span style={{ fontWeight: '600', color: '#475569', fontSize: '0.88rem' }}>
                {job.createdAt ? new Date(job.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recently Posted'}
              </span>
              <span style={{ color: '#cbd5e1', fontSize: '0.8rem' }}>•</span>
              <span style={{ fontSize: '0.88rem', color: '#64748b' }}>Posted by</span>
              <a 
                href="https://www.linkedin.com/in/next-job-post-199b5b371/" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ fontWeight: '700', color: themeColor, fontSize: '0.88rem', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
              >
                NextJobPost
              </a>
            </div>

            {/* Share and Follow Bar */}
            <div className="share-follow-bar p-2 rounded-3 mt-3 d-flex align-items-center gap-2 flex-nowrap" style={{
              backgroundColor: '#f0f7ff',
              border: '1px solid #dbeafe',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              width: '100%',
              maxWidth: '100%'
            }}>
              {/* SHARE GROUP */}
              <span className="share-follow-label" style={{ fontSize: '0.9rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginRight: '4px', flexShrink: 0 }}>Share</span>
              
              {/* WhatsApp Share */}
              <a 
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`🔥 *${job.title}* at *${job.company}*\n👉 Apply Here: ${window.location.href}`)}`}
                onClick={() => trackJobShared('WhatsApp', job)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm text-white fw-bold d-inline-flex align-items-center gap-1.5 btn-share-whatsapp"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" width="16" height="16">
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                </svg>
                <span className="share-btn-text">WhatsApp</span>
              </a>

              {/* Telegram Share */}
              <a 
                href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`🔥 ${job.title} at ${job.company}`)}`}
                onClick={() => trackJobShared('Telegram', job)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm text-white fw-bold d-inline-flex align-items-center gap-1.5 btn-share-telegram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.328-.373-.115l-6.869 4.326-2.96-.924c-.643-.204-.658-.643.136-.953l11.566-4.458c.538-.196 1.006.128.832 1.136z" />
                </svg>
                <span className="share-btn-text">Telegram</span>
              </a>

              {/* Copy Link Share */}
              <button 
                onClick={handleCopyLink}
                className="btn btn-sm text-white fw-bold d-inline-flex align-items-center gap-1.5 btn-share-copylink"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="share-btn-text">{copied ? 'Copied' : 'Copy Link'}</span>
              </button>

              {/* Divider */}
              <div className="share-follow-bar-divider" style={{ width: '1px', height: '24px', backgroundColor: '#cbd5e1', margin: '0 8px', flexShrink: 0 }}></div>

              {/* FOLLOW GROUP */}
              <span className="share-follow-label" style={{ fontSize: '0.9rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginRight: '4px', flexShrink: 0 }}>Follow</span>

              {/* WhatsApp Channel */}
              <a 
                href={job.whatsapp ? (job.whatsapp.startsWith('http') ? job.whatsapp : 'https://wa.me/' + job.whatsapp.replace(/[^0-9+]/g, '')) : 'https://chat.whatsapp.com/LVpuUJluTpUEdIc4daAemQ'}
                onClick={() => handleSocialJoinClick('WhatsApp')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm fw-bold d-inline-flex align-items-center gap-1.5 btn-follow-whatsapp"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" width="16" height="16">
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                </svg>
                <span className="follow-btn-text">Join WhatsApp</span>
              </a>

              {/* Telegram Channel */}
              <a 
                href={job.telegram ? (job.telegram.startsWith('http') ? job.telegram : 'https://t.me/' + job.telegram.replace(/^@/, '')) : 'https://t.me/nextjobpost'}
                onClick={() => handleSocialJoinClick('Telegram')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm fw-bold d-inline-flex align-items-center gap-1.5 btn-follow-telegram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.328-.373-.115l-6.869 4.326-2.96-.924c-.643-.204-.658-.643.136-.953l11.566-4.458c.538-.196 1.006.128.832 1.136z" />
                </svg>
                <span className="follow-btn-text">Join Telegram</span>
              </a>
            </div>
          </div>

          {job.image && (
            <div className="job-image-section mb-4">
              <img 
                src={getImageUrl(job.image)} 
                alt="job banner" 
                fetchPriority="high"
                className="img-fluid rounded-4 shadow-sm w-100" 
                style={{ maxHeight: '400px', objectFit: 'cover' }}
                width="1200"
                height="400"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          )}

          {/* Short Summary Intro */}
          {job.description && (
            <div className="mb-4 job-summary-box p-3 rounded" style={{ 
              fontSize: '1.05rem', 
              lineHeight: '1.7', 
              color: '#334155',
              backgroundColor: '#f8fafc',
              borderLeft: `4px solid ${themeColor}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}>
              {typeof job.description === 'string' && job.description.includes('<') ? (
                <RichTextDisplay content={job.description} />
              ) : (
                <p style={{ margin: 0 }}><strong>{job.company}</strong> {job.description.replace(new RegExp('^' + job.company + '?', 'i'), '')}</p>
              )}
            </div>
          )}
          {job.lastDate && (
            job.isGovernment ? (
              <p className="mb-4" style={{ fontSize: '1.05rem', lineHeight: '1.7', color: '#333' }}>
                If you are looking for a career in the government sector, this is a great opportunity to apply for <strong>{job.company} {job.postType || 'Recruitment'} 2026</strong>. Candidates meeting the eligibility criteria (<strong>{job.eligibility || job.education}</strong>) can apply before the closing date. Below is the detailed information regarding eligibility, salary, selection process, and official links.
              </p>
            ) : (
              <p className="mb-4" style={{ fontSize: '1.05rem', lineHeight: '1.7', color: '#333' }}>
                If you are a <strong>Graduation - {job.education || 'Any Degree'}</strong> this is your chance to <strong>build your future with {job.company}</strong>. The detailed eligibility criteria, responsibilities, and application process for the {job.company} Off Campus Drive {job.batch ? job.batch.replace(/Batch|batch/, '').trim() : ''} are provided below.
              </p>
            )
          )}

          {/* OVERVIEW SECTION */}
          <div className="mb-4">
            <div className="overview-card p-4 rounded-4 shadow-sm border" style={{
              background: '#ffffff',
              borderColor: '#e2e8f0',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Saffron/Yellow/Orange line for Gov Jobs, or Theme Color for Private Jobs */}
              {job.isGovernment ? (
                <div style={{ height: '5px', position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: '#ff9933' }}></div>
              ) : (
                <div style={{ height: '5px', position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: themeColor }}></div>
              )}

              <h2 className="fw-bold mb-3 mt-2 text-dark d-flex align-items-center gap-2.5" style={{ fontSize: '1.4rem', letterSpacing: '-0.02em' }}>
                <span style={{ fontSize: '1.5rem' }}>{job.isGovernment ? '🏛️' : '🏢'}</span>
                {job.isGovernment 
                  ? `${job.company} ${job.postType || 'Recruitment'} – Overview`
                  : `${capitalize(job.company)} Off Campus Recruitment – Overview`}
              </h2>

              <div className="overview-table-wrap mt-3">
                <table className="overview-table">
                  <tbody>
                    {job.isGovernment ? (
                      <>
                        {job.company && (
                          <tr>
                            <td className="overview-key">
                              <span style={{ marginRight: '8px' }}>🏛️</span> Organization
                            </td>
                            <td className="overview-value">
                              {job.company}
                            </td>
                          </tr>
                        )}
                        {(job.postType || job.isGovernment) && (
                          <tr>
                            <td className="overview-key">
                              <span style={{ marginRight: '8px' }}>📢</span> Notification Type
                            </td>
                            <td className="overview-value">
                              <span className="badge rounded-pill px-3 py-1.5" style={{
                                fontSize: '0.8rem',
                                backgroundColor: `${themeColor}12`,
                                color: themeColor,
                                border: `1px solid ${themeColor}30`,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                              }}>
                                {displayPostType}
                              </span>
                            </td>
                          </tr>
                        )}
                        {(job.eligibility || job.education) && (
                          <tr>
                            <td className="overview-key">
                              <span style={{ marginRight: '8px' }}>🎓</span> Eligibility Criteria
                            </td>
                            <td className="overview-value">
                              {job.eligibility || job.education}
                            </td>
                          </tr>
                        )}
                        {job.salary && (
                          <tr>
                            <td className="overview-key">
                              <span style={{ marginRight: '8px' }}>💰</span> Salary / Pay Scale
                            </td>
                            <td className="overview-value" style={{ color: themeColor }}>
                              {job.salary}
                            </td>
                          </tr>
                        )}
                        {(job.vacancies || extractVacancy(job.title)) && (
                          <tr>
                            <td className="overview-key">
                              <span style={{ marginRight: '8px' }}>👥</span> Vacancies
                            </td>
                            <td className="overview-value">
                              <span className="badge rounded-pill px-3 py-1.5" style={{
                                fontSize: '0.8rem',
                                backgroundColor: '#fff7ed',
                                color: '#ea580c',
                                border: '1px solid #f9731630',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                fontWeight: '700'
                              }}>
                                {job.vacancies || extractVacancy(job.title)}
                              </span>
                            </td>
                          </tr>
                        )}
                        {job.lastDate && (
                          <tr>
                            <td className="overview-key">
                              <span style={{ marginRight: '8px' }}>📅</span> Last Date to Apply
                            </td>
                            <td className="overview-value" style={{ color: '#ef4444' }}>
                              {new Date(job.lastDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                              {new Date(job.lastDate) > new Date() && (
                                <span className="ms-2 badge bg-danger-subtle text-danger px-2 py-1" style={{ fontSize: '0.75rem', fontWeight: '600' }}>
                                  Active
                                </span>
                              )}
                            </td>
                          </tr>
                        )}
                      </>
                    ) : (
                      <>
                        {job.company && (
                          <tr>
                            <td className="overview-key">
                              <span style={{ marginRight: '8px' }}>🏢</span> Company Name
                            </td>
                            <td className="overview-value">
                              {capitalize(job.company)}
                            </td>
                          </tr>
                        )}
                        {job.type && (
                          <tr>
                            <td className="overview-key">
                              <span style={{ marginRight: '8px' }}>💼</span> Role / Designation
                            </td>
                            <td className="overview-value">
                              {job.type}
                            </td>
                          </tr>
                        )}
                        {(job.education || job.eligibility) && (
                          <tr>
                            <td className="overview-key">
                              <span style={{ marginRight: '8px' }}>🎓</span> Qualification
                            </td>
                            <td className="overview-value">
                              {job.education || job.eligibility}
                            </td>
                          </tr>
                        )}
                        {job.experience && (
                          <tr>
                            <td className="overview-key">
                              <span style={{ marginRight: '8px' }}>⏳</span> Experience
                            </td>
                            <td className="overview-value">
                              {job.experience}
                            </td>
                          </tr>
                        )}
                        {job.batch && (
                          <tr>
                            <td className="overview-key">
                              <span style={{ marginRight: '8px' }}>📆</span> Batch
                            </td>
                            <td className="overview-value">
                              {job.batch}
                            </td>
                          </tr>
                        )}
                        {job.location && (
                          <tr>
                            <td className="overview-key">
                              <span style={{ marginRight: '8px' }}>📍</span> Location
                            </td>
                            <td className="overview-value">
                              {job.location}
                            </td>
                          </tr>
                        )}
                        {job.salary && (
                          <tr>
                            <td className="overview-key">
                              <span style={{ marginRight: '8px' }}>💰</span> Salary
                            </td>
                            <td className="overview-value" style={{ color: themeColor }}>
                              {job.salary}
                            </td>
                          </tr>
                        )}
                        {job.lastDate && (
                          <tr>
                            <td className="overview-key">
                              <span style={{ marginRight: '8px' }}>📅</span> Application Deadline
                            </td>
                            <td className="overview-value" style={{ color: '#ef4444' }}>
                              {new Date(job.lastDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                              {new Date(job.lastDate) > new Date() && (
                                <span className="ms-2 badge bg-danger-subtle text-danger px-2 py-1" style={{ fontSize: '0.75rem', fontWeight: '600' }}>
                                  Active
                                </span>
                              )}
                            </td>
                          </tr>
                        )}
                      </>
                    )}
                  </tbody>
                </table>
              </div>

              <AlsoReadCard relatedJob={intersperseJobs[0]} themeColor={themeColor} />

              {/* Essential Links Block */}
              {(job.pdfLink || job.applyLink) && (
                <div className="mt-4 p-3 rounded-3 shadow-sm" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <div className="fw-bold mb-3 text-dark d-flex align-items-center gap-1.5" style={{ fontSize: '0.95rem' }}>
                    <span>🔗</span> Essential Links:
                  </div>
                  <div className="d-flex flex-wrap gap-2.5">
                    {job.pdfLink && (
                      (!job.pdfLink.includes('govtjobsalert.in') && !job.pdfLink.includes('sarkariresult.com')) ||
                      job.pdfLink.toLowerCase().endsWith('.pdf')
                    ) && (
                      <a href={job.pdfLink} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-danger fw-bold d-inline-flex align-items-center gap-1.5 px-3 py-2" style={{ borderRadius: '6px' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download Official PDF
                      </a>
                    )}
                    {job.applyLink && (
                      <a 
                        href={job.applyLink} 
                        onClick={(e) => {
                          handleApply(e, job.applyLink);
                          handleApplyAction();
                        }}
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn btn-sm text-white fw-bold d-inline-flex align-items-center gap-1.5 px-4 py-2" 
                        style={{ backgroundColor: themeColor, borderRadius: '6px', border: 'none' }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Apply Now / Source URL
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ABOUT COMPANY */}
          {job.aboutCompany && (
            <div className="mb-4 text-dark" style={{ lineHeight: '1.7' }}>
              <h2 className="capsule-header p-3 rounded" style={getHeaderStyle()}>
                <span>🏢</span> {job.isGovernment ? `About ${job.company}` : `About ${job.company} Off Campus Drive ${job.batch ? job.batch.replace(/Batch|batch/, '').trim() : ''}`}
              </h2>
              <div className="rich-text-section ps-2">
                <RichTextDisplay content={job.aboutCompany} />
              </div>
              
              <AlsoReadCard relatedJob={intersperseJobs[1]} themeColor={themeColor} />
            </div>
          )}

          {/* JOB DESCRIPTION */}
          {(job.telegramFields || job.jobDescription) && (
            <div className="mb-4 text-dark" style={{ lineHeight: '1.7' }}>
              <h2 className="capsule-header p-3 rounded" style={getHeaderStyle()}>
                {getJobDescriptionLabel()}
              </h2>
              {/* Intro text (title line) above the grid */}
              {job.telegramFields && job.jobDescription && (
                <div style={{ padding: '8px 4px 12px', fontSize: '0.97rem', color: '#334155', fontWeight: '500' }}>
                  {stripUnicodeBold(job.jobDescription)}
                </div>
              )}
              {/* Structured info grid for Telegram-sourced jobs */}
              {job.telegramFields && (
                <TelegramJobInfoGrid
                  fields={job.telegramFields}
                  themeColor={themeColor}
                />
              )}
              {/* Fallback plain text for non-Telegram jobs */}
              {!job.telegramFields && job.jobDescription && (
                <div className="rich-text-section ps-2">
                  <RichTextDisplay content={job.jobDescription} />
                </div>
              )}
            </div>
          )}

          {/* RESPONSIBILITIES */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div className="mb-4 text-dark">
              <h2 className="capsule-header p-3 rounded" style={getHeaderStyle()}>
                <span>🎯</span> {job.isGovernment ? `Job Responsibilities` : `Roles & Responsibilities for ${job.company} Off Campus Drive ${job.batch ? job.batch.replace(/Batch|batch/, '').trim() : ''}`}
              </h2>
              {renderList(job.responsibilities)}
            </div>
          )}

          {/* ELIGIBILITY CRITERIA */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="mb-4 text-dark">
              <h2 className="capsule-header p-3 rounded" style={getHeaderStyle()}>
                <span>🎓</span> {job.isGovernment ? 'Eligibility Criteria' : 'Key Highlights & Requirements'}
              </h2>
              {renderList(job.requirements)}
            </div>
          )}

          {/* WHY JOIN SECTION */}
          {job.whyJoin && (
            <div className="mb-4 text-dark">
              <h2 className="capsule-header p-3 rounded" style={getHeaderStyle()}>
                <span>✨</span> Why Join {job.company}?
              </h2>
              {renderList(job.whyJoin)}

              <AlsoReadCard relatedJob={intersperseJobs[2]} themeColor={themeColor} />
            </div>
          )}

          {job.contact && (
            <div className="mb-4 text-dark">
              <h2 className="capsule-header p-3 rounded" style={getHeaderStyle()}>
                <span>📞</span> Contact Information
              </h2>
              <p className="ps-2">{job.contact}</p>
            </div>
          )}

          {job.howToApply && (
            <div className="mb-4 text-dark">
              <h2 className="capsule-header p-3 rounded" style={getHeaderStyle()}>
                <span>🚀</span> {job.isGovernment ? `How to Apply` : `How to Apply for ${job.company} Off Campus Drive ${job.batch ? job.batch.replace(/Batch|batch/, '').trim() : ''}`}
              </h2>
              <div className="rich-text-section ps-2">
                <RichTextDisplay content={job.howToApply} />
              </div>
            </div>
          )}

          {job.finalThoughts && (
            <div id="final-thoughts-section" className="mb-4 text-dark" style={{ scrollMarginTop: '110px' }}>
              <h2 className="capsule-header p-3 rounded" style={getHeaderStyle()}>
                <span>💭</span> Final Thoughts
              </h2>
              <div className="rich-text-section ps-2">
                <RichTextDisplay content={job.finalThoughts} />
              </div>
            </div>
          )}

          {/* ESSENTIAL LINKS — always show for non-government jobs (has WhatsApp/Telegram at minimum) */}
          {!job.isGovernment && (
            <div className="essential-links-section mb-4">
              <h2>Essential Links — {job.company}</h2>
              <ul>
                {job.applyLink && (
                  <li>
                    <a
                      href={job.applyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => { handleApply(e, job.applyLink); handleApplyAction(); }}
                    >
                      Apply Now for {job.company} — Official Application
                    </a>
                  </li>
                )}
                {job.extractedLinks && job.extractedLinks.filter(l => isValidJobUrl(l.url)).map((link, idx) => (
                  <li key={idx}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer nofollow">
                      {link.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href="https://chat.whatsapp.com/LVpuUJluTpUEdIc4daAemQ"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleSocialJoinClick('WhatsApp')}
                  >
                    Join WhatsApp Channel for Latest Job Updates
                  </a>
                </li>
                <li>
                  <a
                    href="https://t.me/nextjobpost"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleSocialJoinClick('Telegram')}
                  >
                    Join Telegram Channel for Latest Job Updates
                  </a>
                </li>
              </ul>
            </div>
          )}


          <div className="my-5 p-4 rounded-4 shadow-sm" style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 className="fw-bold mb-3" style={{ fontSize: '1.25rem', color: '#1e293b' }}>
              ⚡ Action Center
            </h3>
            <p style={{ fontSize: '0.95rem', color: '#475569', marginBottom: '1.5rem' }}>
              Take the next step. Apply directly, save this notification, or share it with your network!
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
              <a 
                href={job.applyLink} 
                onClick={(e) => {
                  handleApply(e, job.applyLink);
                  handleApplyAction();
                }} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn text-white fw-bold d-inline-flex align-items-center justify-content-center shadow-sm" 
                style={{ 
                  backgroundColor: themeColor, 
                  padding: '12px 32px', 
                  fontSize: '1.1rem', 
                  borderRadius: '8px',
                  transition: 'all 200ms ease',
                  border: 'none',
                  flex: '1 1 auto',
                  minWidth: '200px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(0.9)'}
                onMouseLeave={(e) => e.currentTarget.style.filter = 'none'}
              >
                Apply Now
              </a>

              <button 
                onClick={handleSaveAction}
                className="btn d-inline-flex align-items-center justify-content-center fw-bold"
                style={{
                  padding: '12px 24px',
                  fontSize: '1rem',
                  borderRadius: '8px',
                  backgroundColor: isSaved ? '#fef3c7' : '#ffffff',
                  border: '1.5px solid #d97706',
                  color: '#d97706',
                  transition: 'all 200ms ease',
                  cursor: 'pointer',
                  flex: '1 1 auto'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#fef3c7';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isSaved ? '#fef3c7' : '#ffffff';
                }}
              >
                {isSaved ? '⭐ Saved for Later' : '⏳ Save for Later'}
              </button>
            </div>

            {/* Status Alerts */}
            {hasApplied && (
              <div className="alert alert-success d-flex align-items-center gap-2 mb-4" style={{ borderRadius: '8px', fontSize: '0.95rem' }}>
                <span>🎉 <strong>Applied!</strong> Awesome job! Best of luck with your application. Share this with a friend!</span>
              </div>
            )}


            <hr style={{ borderTop: '1px solid #cbd5e1', margin: '1.5rem 0' }} />

            {/* Share and Follow Bar */}
            <div className="share-follow-bar p-2 rounded-3 mt-3 d-flex align-items-center gap-2 flex-nowrap" style={{
              backgroundColor: '#f0f7ff',
              border: '1px solid #dbeafe',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              width: '100%',
              maxWidth: '100%'
            }}>
              {/* SHARE GROUP */}
              <span className="share-follow-label" style={{ fontSize: '0.9rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginRight: '4px', flexShrink: 0 }}>Share</span>
              
              {/* WhatsApp Share */}
              <a 
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`🔥 *${job.title}* at *${job.company}*\n👉 Apply Here: ${window.location.href}`)}`}
                onClick={() => trackJobShared('WhatsApp', job)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm text-white fw-bold d-inline-flex align-items-center gap-1.5 btn-share-whatsapp"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" width="16" height="16">
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                </svg>
                <span className="share-btn-text">WhatsApp</span>
              </a>

              {/* Telegram Share */}
              <a 
                href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`🔥 ${job.title} at ${job.company}`)}`}
                onClick={() => trackJobShared('Telegram', job)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm text-white fw-bold d-inline-flex align-items-center gap-1.5 btn-share-telegram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.328-.373-.115l-6.869 4.326-2.96-.924c-.643-.204-.658-.643.136-.953l11.566-4.458c.538-.196 1.006.128.832 1.136z" />
                </svg>
                <span className="share-btn-text">Telegram</span>
              </a>

              {/* Copy Link Share */}
              <button 
                onClick={handleCopyLink}
                className="btn btn-sm text-white fw-bold d-inline-flex align-items-center gap-1.5 btn-share-copylink"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="share-btn-text">{copied ? 'Copied' : 'Copy Link'}</span>
              </button>

              {/* Divider */}
              <div className="share-follow-bar-divider" style={{ width: '1px', height: '24px', backgroundColor: '#cbd5e1', margin: '0 8px', flexShrink: 0 }}></div>

              {/* FOLLOW GROUP */}
              <span className="share-follow-label" style={{ fontSize: '0.9rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginRight: '4px', flexShrink: 0 }}>Follow</span>

              {/* WhatsApp Channel */}
              <a 
                href={job.whatsapp ? (job.whatsapp.startsWith('http') ? job.whatsapp : 'https://wa.me/' + job.whatsapp.replace(/[^0-9+]/g, '')) : 'https://chat.whatsapp.com/LVpuUJluTpUEdIc4daAemQ'}
                onClick={() => handleSocialJoinClick('WhatsApp')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm fw-bold d-inline-flex align-items-center gap-1.5 btn-follow-whatsapp"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" width="16" height="16">
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                </svg>
                <span className="follow-btn-text">Join WhatsApp</span>
              </a>

              {/* Telegram Channel */}
              <a 
                href={job.telegram ? (job.telegram.startsWith('http') ? job.telegram : 'https://t.me/' + job.telegram.replace(/^@/, '')) : 'https://t.me/nextjobpost'}
                onClick={() => handleSocialJoinClick('Telegram')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm fw-bold d-inline-flex align-items-center gap-1.5 btn-follow-telegram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.328-.373-.115l-6.869 4.326-2.96-.924c-.643-.204-.658-.643.136-.953l11.566-4.458c.538-.196 1.006.128.832 1.136z" />
                </svg>
                <span className="follow-btn-text">Join Telegram</span>
              </a>
            </div>
          </div>

          {/* Recommended Jobs section (Desktop) */}
          {displayRecommendedJobs.length > 0 && (
            <div className="mb-5">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '1.4rem' }}>🎯</span>
                <h3 className="fw-bold m-0" style={{ fontSize: '1.15rem', color: '#1e293b' }}>
                  Recommended Jobs For You
                </h3>
              </div>
              <p className="text-muted" style={{ fontSize: '0.82rem', marginBottom: '1.25rem' }}>
                Personalized matches based on your profile and recent activities.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                {displayRecommendedJobs.map((relatedJob) => {
                  const score = relatedJob.matchScore || 75;
                  return (
                    <div key={relatedJob._id} className="p-3 bg-white rounded-3 shadow-sm border border-light" style={{ transition: 'transform 150ms ease', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                          <span className="text-muted small fw-bold" style={{ textTransform: 'uppercase' }}>
                            {relatedJob.company}
                          </span>
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: '800',
                            background: score >= 80 ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                            color: '#ffffff',
                            padding: '0.15rem 0.45rem',
                            borderRadius: '4px'
                          }}>
                            🎯 {score}% Match
                          </span>
                        </div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '6px', lineHeight: '1.3' }}>
                          <Link to={getJobUrl(relatedJob)} className="text-decoration-none text-dark">
                            {relatedJob.title}
                          </Link>
                        </h4>
                        <p className="text-muted small mb-3">{relatedJob.location || 'India'}</p>
                      </div>
                      <Link 
                        to={getJobUrl(relatedJob)} 
                        className="btn btn-sm fw-bold" 
                        style={{ 
                          fontSize: '0.8rem', 
                          padding: '4px 12px', 
                          borderRadius: '4px', 
                          border: `1.5px solid ${themeColor}`, 
                          color: themeColor,
                          backgroundColor: 'transparent',
                          transition: 'all 150ms ease',
                          width: 'fit-content'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.backgroundColor = themeColor;
                          e.currentTarget.style.color = '#ffffff';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = themeColor;
                        }}
                      >
                        View details
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        <div className="col-12 col-lg-4 col-right">
          <div className="sidebar-sticky" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
            <SidebarCareerHub contextTitle={job.title} />
            <SidebarFilter />
            <SidebarAd />
          </div>
        </div>
      </div>
    </div>
  );
}
