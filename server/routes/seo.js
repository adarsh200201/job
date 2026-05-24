const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

// Helper to get base URL
const getBaseUrl = (req) => {
  if (process.env.CLIENT_ORIGIN && process.env.CLIENT_ORIGIN !== '*') {
    return process.env.CLIENT_ORIGIN.split(',')[0].trim();
  }
  return `${req.protocol}://${req.get('host')}`;
};

router.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = getBaseUrl(req);
    const jobs = await Job.find({ isActive: true }).select('slug updatedAt').sort({ updatedAt: -1 });

    const staticPages = [
      '',
      '/about',
      '/contact',
      '/faq',
      '/blog',
      '/terms',
      '/disclaimer'
    ];

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Add static pages
    for (const page of staticPages) {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}${page}</loc>\n`;
      xml += '    <changefreq>daily</changefreq>\n';
      xml += '    <priority>0.8</priority>\n';
      xml += '  </url>\n';
    }

    // Add dynamic job pages
    for (const job of jobs) {
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
