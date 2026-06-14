const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const fs = require('fs');
const path = require('path');

// Helper to get base URL
const getBaseUrl = (req) => {
  if (process.env.CLIENT_ORIGIN && process.env.CLIENT_ORIGIN !== '*') {
    return process.env.CLIENT_ORIGIN.split(',')[0].trim();
  }
  return `${req.protocol}://${req.get('host')}`;
};

// Helper to parse mega categories dynamically from client config to avoid CommonJS/ESM require conflicts
const getMegaCategoryKeys = () => {
  try {
    const filePath = path.resolve(__dirname, '../../client/src/utils/categoryConfig.js');
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const keys = [];
      const regex = /(?:['"])([^'"]+)(?:['"])\s*:\s*\{/g;
      let match;
      while ((match = regex.exec(content)) !== null) {
        const key = match[1];
        if (key.endsWith('-jobs') || ['results', 'admit-cards', 'answer-keys', 'previous-papers', 'syllabus-jobs', 'exam-calendar', 'prep-strategy'].includes(key)) {
          keys.push(key);
        }
      }
      return keys;
    }
  } catch (err) {
    console.error('Failed to parse mega categories:', err);
  }
  return [];
};

router.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = getBaseUrl(req);
    const jobs = await Job.find({ isActive: true }).select('slug updatedAt').sort({ updatedAt: -1 });

    // Core static landing pages
    const baseStaticPages = [
      '',
      '/about',
      '/contact',
      '/faq',
      '/blog',
      '/terms',
      '/disclaimer',
      '/privacy',
      '/resume-builder',
      '/student-career-center',
      '/salaries',
      '/govt-jobs',
      '/exam-updates',
      '/upsc-jobs',
      '/ssc-jobs',
      '/railway-jobs',
      '/banking-jobs',
      '/defence-jobs',
      '/other-govt-jobs',
      '/teaching-jobs',
      '/psu-jobs',
      '/results',
      '/admit-cards',
      '/answer-keys',
      '/preparation',
      '/preparation/aptitude',
      '/preparation/technical',
      '/preparation/dsa',
      '/preparation/company',
      '/preparation/gov',
      '/preparation/mock-tests',
      '/private-jobs',
      '/freshers-jobs',
      '/work-from-home-jobs',
      '/internships',
      '/software-jobs',
      '/engineering-freshers'
    ];

    // Read dynamic state & qualification category landing pages from config
    const megaKeys = getMegaCategoryKeys();
    const megaCategoryPages = megaKeys.map(k => `/${k}`);

    // Combine and deduplicate
    const allStaticPages = [...new Set([...baseStaticPages, ...megaCategoryPages])];

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Add static & category landing pages
    for (const page of allStaticPages) {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}${page}</loc>\n`;
      xml += '    <changefreq>daily</changefreq>\n';
      xml += '    <priority>0.8</priority>\n';
      xml += '  </url>\n';
    }

    // Filter dynamic job pages to exclude duplicates and garbage
    const seenSlugs = new Set();
    const isGarbageSlug = (slug) => {
      if (!slug) return true;
      
      const parts = slug.toLowerCase().split('-').filter(Boolean);
      if (parts.length === 0) return true;
      
      // If the last part is a hex hash (e.g. 5-6 characters, alphanumeric/hex), remove it
      if (parts.length > 1) {
        const last = parts[parts.length - 1];
        if (/^[0-9a-f]{5,6}$/i.test(last)) {
          parts.pop();
        }
      }
      
      // Junk words list
      const junkWords = new Set([
        'and', 'or', 'the', 'in', 'to', 'for', 'a', 'an', 'at', 'by', 'of', 'on', 'with', 'if', 'now', 'apply', 'test', 'scrape', 'mock'
      ]);
      
      // Check if all remaining parts are junk words or pure numbers
      const allJunk = parts.every(p => junkWords.has(p) || /^\d+$/.test(p));
      if (allJunk) return true;
      
      // Check if any word contains suspicious scraper traces like website names
      const garbagePatterns = /foundthejob|govtjobsalert|http|https|www/i;
      if (parts.some(p => garbagePatterns.test(p))) return true;

      // Reject test/scrape keywords
      if (parts.some(p => p.includes('test') || p.includes('scrape') || p.includes('mock'))) {
        return true;
      }
      
      return false;
    };

    // Add dynamic job pages
    for (const job of jobs) {
      if (!job.slug || seenSlugs.has(job.slug) || isGarbageSlug(job.slug)) {
        continue;
      }
      seenSlugs.add(job.slug);

      const lastMod = job.updatedAt ? new Date(job.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/${job.slug}</loc>\n`;
      xml += `    <lastmod>${lastMod}</lastmod>\n`;
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '    <priority>0.7</priority>\n';
      xml += '  </url>\n';
    }

    xml += '</urlset>';

    res.header('Content-Type', 'application/xml');
    res.status(200).send(xml);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
});

router.get('/robots.txt', (req, res) => {
  const baseUrl = getBaseUrl(req);
  let txt = 'User-agent: *\n';
  txt += 'Allow: /\n';
  txt += `Sitemap: ${baseUrl}/sitemap.xml\n`;
  
  res.header('Content-Type', 'text/plain');
  res.status(200).send(txt);
});

module.exports = router;
