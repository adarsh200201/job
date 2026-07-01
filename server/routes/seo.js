const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const SeoIndexStatus = require('../models/SeoIndexStatus');
const SeoKeywordMetric = require('../models/SeoKeywordMetric');
const SeoAutomationLog = require('../models/SeoAutomationLog');
const adminAuth = require('../middleware/adminAuth');
const fs = require('fs');
const path = require('path');

// Helper to get base URL (proxy-aware for Vercel/Cloudflare requests)
const getBaseUrl = (req) => {
  const host = req.get('x-forwarded-host') || req.get('host') || 'nextjobpost.in';
  const protocol = req.get('x-forwarded-proto') || req.protocol || 'https';
  
  if (host.includes('localhost') || host.includes('127.0.0.1')) {
    return `${protocol}://${host}`;
  }
  return `https://${host}`;
};

// Sitemap Cache
const sitemapsCache = new Map();
const SITEMAP_CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

function getCachedSitemap(key) {
  const entry = sitemapsCache.get(key);
  if (entry && Date.now() - entry.timestamp < SITEMAP_CACHE_TTL_MS) {
    return entry.xml;
  }
  return null;
}

function cacheSitemap(key, xml) {
  sitemapsCache.set(key, { xml, timestamp: Date.now() });
}

function bustSitemapsCache() {
  sitemapsCache.clear();
  console.log('🧹 [SitemapsCache] Busted sitemap cache');
}

router.bustSitemapsCache = bustSitemapsCache;

// Sitemap Cache Middleware
const sitemapsCacheMiddleware = (req, res, next) => {
  const cacheKey = req.originalUrl;
  const cached = getCachedSitemap(cacheKey);
  if (cached) {
    res.header('Content-Type', 'application/xml');
    res.set('X-Cache', 'HIT');
    return res.status(200).send(cached);
  }
  
  const originalSend = res.send;
  res.send = function (body) {
    if (res.statusCode === 200) {
      cacheSitemap(cacheKey, body);
    }
    res.set('X-Cache', 'MISS');
    return originalSend.call(this, body);
  };
  
  next();
};

// Mount cache middleware on sitemap routes
router.use('/sitemap*.xml', sitemapsCacheMiddleware);

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

// 1. Sitemap Index
router.get('/sitemap.xml', (req, res) => {
  const baseUrl = getBaseUrl(req);
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  const files = [
    'sitemap-pages.xml',
    'sitemap-jobs.xml',
    'sitemap-results.xml',
    'sitemap-admitcards.xml',
    'sitemap-preparation.xml'
  ];
  
  for (const file of files) {
    xml += '  <sitemap>\n';
    xml += `    <loc>${baseUrl}/${file}</loc>\n`;
    xml += '  </sitemap>\n';
  }
  xml += '</sitemapindex>';
  
  res.header('Content-Type', 'application/xml');
  res.status(200).send(xml);
});

// 2. Pages Sitemap (Static Pages & Categories)
router.get('/sitemap-pages.xml', async (req, res) => {
  try {
    const baseUrl = getBaseUrl(req);
    const megaKeys = getMegaCategoryKeys();
    const megaCategoryPages = megaKeys.map(k => `/${k}`);
    
    const basePages = [
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
      '/psu-jobs',
      '/results',
      '/admit-cards',
      '/answer-keys',
      '/private-jobs',
      '/freshers-jobs',
      '/work-from-home-jobs',
      '/internships',
      '/software-jobs',
      '/engineering-freshers',
      
      // Linkable Backlink Assets
      '/ssc-calendar',
      '/govt-jobs-calendar',
      '/exam-dates',
      '/current-affairs',
      
      // Exam Clusters Hubs
      '/ssc-syllabus',
      '/ssc-results',
      '/ssc-admit-cards',
      '/ssc-preparation',
      '/railway-syllabus',
      '/railway-results',
      '/railway-admit-cards',
      '/railway-preparation'
    ];
    
    // Generate Programmatic SEO combinations dynamically
    const qualifications = [
      '10th-pass', '12th-pass', 'graduate', 'post-graduate', 'diploma', 'iti',
      'engineering', 'medical', 'teaching', 'computer-it', 'commerce', 'law'
    ];
    const categories = ['ssc', 'railway', 'bank', 'upsc', 'defence', 'psu', 'police'];
    const states = [
      'gujarat', 'bihar', 'rajasthan', 'maharashtra', 'delhi', 'punjab',
      'haryana', 'karnataka', 'tamil-nadu', 'west-bengal', 'andhra-pradesh',
      'telangana', 'kerala', 'odisha', 'andaman-nicobar', 'arunachal-pradesh',
      'assam', 'chandigarh', 'chhattisgarh', 'dnh-dd', 'goa', 'himachal-pradesh',
      'jammu-kashmir', 'jharkhand', 'ladakh', 'lakshadweep', 'madhya-pradesh',
      'manipur', 'meghalaya', 'mizoram', 'nagaland', 'puducherry', 'sikkim',
      'tripura', 'uttar-pradesh', 'uttarakhand'
    ];
    
    const programmaticPages = [];
    
    // 1. Individual State Pages (e.g. /gujarat-govt-jobs)
    for (const s of states) {
      programmaticPages.push(`/${s}-govt-jobs`);
    }
    
    // 2. Individual Qualification Pages (e.g. /10th-pass-jobs)
    for (const q of qualifications) {
      programmaticPages.push(`/${q}-jobs`);
    }
    
    // 3. Qualification-State Combinations (e.g. /10th-pass-jobs-in-gujarat)
    for (const q of qualifications) {
      for (const s of states) {
        programmaticPages.push(`/${q}-jobs-in-${s}`);
      }
    }
    
    // 4. Category-State Combinations (e.g. /ssc-jobs-in-gujarat)
    for (const c of categories) {
      for (const s of states) {
        programmaticPages.push(`/${c}-jobs-in-${s}`);
      }
    }
    
    const allPages = [...new Set([...basePages, ...megaCategoryPages, ...programmaticPages])];
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    for (const page of allPages) {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}${page}</loc>\n`;
      xml += '    <changefreq>daily</changefreq>\n';
      xml += '    <priority>0.8</priority>\n';
      xml += '  </url>\n';
    }
    xml += '</urlset>';
    
    res.header('Content-Type', 'application/xml');
    res.status(200).send(xml);
  } catch (err) {
    console.error('Error generating pages sitemap:', err);
    res.status(500).send('Error generating sitemap');
  }
});

// 3. Jobs Sitemap
router.get('/sitemap-jobs.xml', async (req, res) => {
  try {
    const baseUrl = getBaseUrl(req);
    const jobs = await Job.find({ 
      isActive: true, 
      postType: { $nin: ['Result', 'Admit Card', 'Answer Key'] }
    }).select('slug updatedAt').sort({ updatedAt: -1 });
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    const seenSlugs = new Set();
    for (const job of jobs) {
      if (!job.slug || seenSlugs.has(job.slug) || isGarbageSlug(job.slug)) continue;
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
  } catch (err) {
    console.error('Error generating jobs sitemap:', err);
    res.status(500).send('Error generating sitemap');
  }
});

// 4. Results Sitemap (Results & Answer Keys)
router.get('/sitemap-results.xml', async (req, res) => {
  try {
    const baseUrl = getBaseUrl(req);
    const jobs = await Job.find({ 
      isActive: true, 
      postType: { $in: ['Result', 'Answer Key'] }
    }).select('slug updatedAt').sort({ updatedAt: -1 });
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    const seenSlugs = new Set();
    for (const job of jobs) {
      if (!job.slug || seenSlugs.has(job.slug) || isGarbageSlug(job.slug)) continue;
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
  } catch (err) {
    console.error('Error generating results sitemap:', err);
    res.status(500).send('Error generating sitemap');
  }
});

// 5. Admit Cards Sitemap
router.get('/sitemap-admitcards.xml', async (req, res) => {
  try {
    const baseUrl = getBaseUrl(req);
    const jobs = await Job.find({ 
      isActive: true, 
      postType: 'Admit Card'
    }).select('slug updatedAt').sort({ updatedAt: -1 });
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    const seenSlugs = new Set();
    for (const job of jobs) {
      if (!job.slug || seenSlugs.has(job.slug) || isGarbageSlug(job.slug)) continue;
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
  } catch (err) {
    console.error('Error generating admitcards sitemap:', err);
    res.status(500).send('Error generating sitemap');
  }
});

// 6. Preparation Sitemap
router.get('/sitemap-preparation.xml', (req, res) => {
  const baseUrl = getBaseUrl(req);
  const prepPages = [
    '/preparation',
    '/preparation/aptitude',
    '/preparation/technical',
    '/preparation/dsa',
    '/preparation/company',
    '/preparation/gov',
    '/preparation/mock-tests'
  ];
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  for (const page of prepPages) {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}${page}</loc>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.7</priority>\n';
    xml += '  </url>\n';
  }
  xml += '</urlset>';
  
  res.header('Content-Type', 'application/xml');
  res.status(200).send(xml);
});

router.get('/robots.txt', (req, res) => {
  const baseUrl = getBaseUrl(req);
  let txt = 'User-agent: *\n';
  txt += 'Allow: /\n';
  txt += `Sitemap: ${baseUrl}/sitemap.xml\n`;
  
  res.header('Content-Type', 'text/plain');
  res.status(200).send(txt);
});

// 7. SEO Dashboard Stats (Protected Admin Route)
router.get('/api/seo/dashboard-stats', adminAuth, async (req, res) => {
  try {
    const totalCount = await SeoIndexStatus.countDocuments();
    const indexedCount = await SeoIndexStatus.countDocuments({ status: 'Indexed' });
    const pendingCount = await SeoIndexStatus.countDocuments({ status: 'Pending' });
    const failedCount = await SeoIndexStatus.countDocuments({ status: 'Failed' });
    const notIndexedCount = await SeoIndexStatus.countDocuments({ status: 'Not Indexed' });

    // Fetch some recent keyword metrics for trend analysis
    const topKeywords = await SeoKeywordMetric.find()
      .sort({ date: -1, impressions: -1 })
      .limit(20)
      .lean();

    res.json({
      success: true,
      data: {
        total: totalCount,
        indexed: indexedCount,
        pending: pendingCount,
        failed: failedCount,
        notIndexed: notIndexedCount,
        topKeywords
      }
    });
  } catch (err) {
    console.error('Error fetching SEO dashboard stats:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch SEO stats', error: err.message });
  }
});

// 8. SEO Index Status List (Protected Admin Route)
router.get('/api/seo/index-status', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const status = req.query.status;
    const search = req.query.search;
    const skip = (page - 1) * limit;

    const query = {};
    if (status) {
      query.status = status;
    }
    if (search) {
      query.url = { $regex: search, $options: 'i' };
    }

    const total = await SeoIndexStatus.countDocuments(query);
    const urls = await SeoIndexStatus.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: urls
    });
  } catch (err) {
    console.error('Error fetching index status:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch index status', error: err.message });
  }
});

// 9. SEO Index Status Bulk Update (Protected Admin Route)
router.post('/api/seo/index-status/bulk', adminAuth, async (req, res) => {
  try {
    const { urls } = req.body; // Array of { url, status, submittedAt, indexedAt }
    if (!Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid payload: urls array is required' });
    }

    const bulkOps = urls.map(item => {
      const updateDoc = {
        status: item.status || 'Pending'
      };
      if (item.submittedAt) updateDoc.submittedAt = new Date(item.submittedAt);
      if (item.indexedAt) updateDoc.indexedAt = new Date(item.indexedAt);

      return {
        updateOne: {
          filter: { url: item.url },
          update: { $set: updateDoc },
          upsert: true
        }
      };
    });

    const result = await SeoIndexStatus.bulkWrite(bulkOps);

    res.json({
      success: true,
      message: `Successfully processed ${urls.length} URL index statuses`,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      upsertedCount: result.upsertedCount
    });
  } catch (err) {
    console.error('Error bulk updating index status:', err);
    res.status(500).json({ success: false, message: 'Failed to bulk update index status', error: err.message });
  }
});

// 10. SEO Keyword Metrics Bulk Upload (Protected Admin Route)
router.post('/api/seo/keyword-metrics', adminAuth, async (req, res) => {
  try {
    const { metrics } = req.body; // Array of { keyword, impressions, clicks, ctr, position, page, date }
    if (!Array.isArray(metrics) || metrics.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid payload: metrics array is required' });
    }

    const bulkOps = metrics.map(item => {
      const dateVal = item.date ? new Date(item.date) : new Date();
      // Set to midnight to align all daily stats cleanly
      dateVal.setUTCHours(0, 0, 0, 0);

      return {
        updateOne: {
          filter: { 
            keyword: item.keyword, 
            page: item.page, 
            date: dateVal 
          },
          update: { 
            $set: { 
              impressions: Number(item.impressions) || 0, 
              clicks: Number(item.clicks) || 0, 
              ctr: Number(item.ctr) || 0, 
              position: Number(item.position) || 0 
            } 
          },
          upsert: true
        }
      };
    });

    const result = await SeoKeywordMetric.bulkWrite(bulkOps);

    res.json({
      success: true,
      message: `Successfully processed ${metrics.length} keyword metrics`,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      upsertedCount: result.upsertedCount
    });
  } catch (err) {
    console.error('Error bulk uploading keyword metrics:', err);
    res.status(500).json({ success: false, message: 'Failed to bulk upload keyword metrics', error: err.message });
  }
});

// 11. GET Automation Logs — Daily Report (Protected Admin Route)
router.get('/api/seo/automation-logs', adminAuth, async (req, res) => {
  try {
    const ALL_TASKS = [
      'health_checker',
      'gsc_keyword_sync',
      'index_tracker',
      'auto_optimizer',
      'content_refresh',
      'keyword_gap_finder'
    ];

    // Get the latest run entry for each task
    const latestPerTask = await Promise.all(
      ALL_TASKS.map(async (taskName) => {
        const log = await SeoAutomationLog.findOne({ taskName })
          .sort({ ranAt: -1 })
          .lean();
        return log || { taskName, status: 'never', ranAt: null, message: 'Has not run yet', durationMs: 0 };
      })
    );

    // Get the 60 most recent log entries for the activity feed
    const recentLogs = await SeoAutomationLog.find()
      .sort({ ranAt: -1 })
      .limit(60)
      .lean();

    res.json({
      success: true,
      data: {
        summary: latestPerTask,
        recent: recentLogs
      }
    });
  } catch (err) {
    console.error('Error fetching automation logs:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch automation logs', error: err.message });
  }
});

// 12. POST Automation Log Entry — Called by Python scripts (Protected Admin Route)
router.post('/api/seo/automation-logs', adminAuth, async (req, res) => {
  try {
    const { taskName, status, message, details, durationMs, ranAt } = req.body;

    if (!taskName || !status) {
      return res.status(400).json({ success: false, message: 'taskName and status are required' });
    }

    const log = await SeoAutomationLog.create({
      taskName,
      status,
      message: message || '',
      details: details || {},
      durationMs: durationMs || 0,
      ranAt: ranAt ? new Date(ranAt) : new Date()
    });

    res.json({ success: true, data: log });
  } catch (err) {
    console.error('Error saving automation log:', err);
    res.status(500).json({ success: false, message: 'Failed to save automation log', error: err.message });
  }
});

// 13. Run Index status audit manually (Protected Admin Route)
router.post('/api/seo/run-audit', adminAuth, async (req, res) => {
  const { exec } = require('child_process');
  const path = require('path');
  
  const scriptPath = 'd:\\Automation\\index_tracker.py';
  
  console.log(`[SEO-AUDIT] Triggering manually from dashboard: ${scriptPath}`);
  
  const child = exec(`python "${scriptPath}"`, {
    env: {
      ...process.env,
      API_TOKEN: req.headers.authorization ? req.headers.authorization.split(' ')[1] : ''
    }
  });

  child.stdout.on('data', (data) => {
    console.log(`[INDEX-TRACKER STDOUT]: ${data}`);
  });

  child.stderr.on('data', (data) => {
    console.error(`[INDEX-TRACKER STDERR]: ${data}`);
  });

  child.on('close', (code) => {
    console.log(`[INDEX-TRACKER] finished with code ${code}`);
  });

  res.json({
    success: true,
    message: 'SEO Index Status Audit triggered successfully. Running in background.'
  });
});

module.exports = router;
