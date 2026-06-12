const dotenv = require('dotenv');
const path = require('path');
// Load .env from root (works whether run from /server or root)
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config(); // fallback: also check current dir .env

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const session = require('express-session');
const passport = require('./config/passport');
const { connectDB } = require('./utils/db');
const jobsRoutes = require('./routes/jobs');
const adminRoutes = require('./routes/admin');
const controlRoutes = require('./routes/control');
const uploadRoutes = require('./routes/upload');
const settingsRoutes = require('./routes/settings');
const seoRoutes = require('./routes/seo');
const authRoutes = require('./routes/auth');
const recommendationRoutes = require('./routes/recommendation');
const activityRoutes = require('./routes/activity');
const preparationRoutes = require('./routes/preparation');
const inputSanitizer = require('./middleware/inputSanitizer');
const { seedAdminIfNeeded, seedJobsIfNeeded, ensureMinimumJobs, seedDetailedJob } = require('./utils/seed');
const { seedPrepData } = require('./scripts/seedPrepData');

/* ─── Auto DB Cleanup (prevents Atlas 512 MB quota breach) ─── */
async function autoCleanupDB() {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) return;
    const db = mongoose.connection.db;

    // Delete jobs older than 7 days
    const Job = require('./models/Job');
    const cutoff7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const deleted = await Job.deleteMany({ createdAt: { $lt: cutoff7d } });
    if (deleted.deletedCount > 0) console.log(`🧹 [AutoCleanup] Deleted ${deleted.deletedCount} old jobs (>7 days)`);

    // Delete all scrapeditems (regenerable cache)
    try {
      const r = await db.collection('scrapeditems').deleteMany({});
      if (r.deletedCount > 0) console.log(`🧹 [AutoCleanup] Cleared ${r.deletedCount} scrapeditems`);
    } catch { /* skip */ }

    // Delete old scraperlogs
    try {
      const cutoff3d = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      const r2 = await db.collection('scraperlogs').deleteMany({ createdAt: { $lt: cutoff3d } });
      if (r2.deletedCount > 0) console.log(`🧹 [AutoCleanup] Cleared ${r2.deletedCount} old scraper logs`);
    } catch { /* skip */ }
  } catch (err) {
    console.error('⚠️  [AutoCleanup] Error:', err.message);
  }
}

function scheduleAutoCleanup() {
  // Run once on startup after a short delay, then every 12 hours
  setTimeout(autoCleanupDB, 5000);
  setInterval(autoCleanupDB, 12 * 60 * 60 * 1000);
  console.log('🕒 [AutoCleanup] Scheduled — runs every 12 hours');
}

const app = express();
const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';

const parseAllowedOrigins = (value) =>
  String(value)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

// Always include localhost for local dev; production origins come from CLIENT_ORIGIN
const allowedOrigins = [
  ...parseAllowedOrigins(CLIENT_ORIGIN),
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
];

app.use(
  cors({
    origin(origin, callback) {
      // Allow server-to-server / curl / Postman (no origin header)
      if (!origin) return callback(null, true);
      // Wildcard: allow everything
      if (allowedOrigins.includes('*')) return callback(null, true);
      // Check explicit list
      if (allowedOrigins.includes(origin)) return callback(null, true);
      // Allow any Vercel / Netlify / Render preview URLs for this project
      if (/nextjobpost/i.test(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

// ─── Security Middleware ───────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false, // Disable for now as it can break React app
  crossOriginEmbedderPolicy: false,
}));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(express.json());
app.use(inputSanitizer);

// Prerender middleware for SEO crawler bots (Option 1)
const prerenderNode = require('prerender-node');
if (process.env.PRERENDER_TOKEN) {
  app.use(prerenderNode.set('prerenderToken', process.env.PRERENDER_TOKEN));
} else {
  // eslint-disable-next-line no-console
  console.warn('⚠️  PRERENDER_TOKEN not set in server env — crawlers might not be optimized via Prerender.io.');
}

// Session (required by passport even for stateless JWT flow)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'njp_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production', maxAge: 60000 },
  })
);
app.use(passport.initialize());
app.use(passport.session());
  // Serve the uploads directory explicitly
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Serve other static files from public
app.use(express.static(path.join(__dirname, '../public')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.use('/api/jobs', jobsRoutes);

// ─── New hardened admin route (control-center) ────────────────────────────────
app.use('/api/control', controlRoutes);

// ─── Legacy admin route — block completely (prevent enumeration/brute-force) ──
app.use('/api/admin', (req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use('/api/upload', uploadRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/preparation', preparationRoutes);
app.use('/', seoRoutes);

app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

connectDB()
  .then(async () => {
    await seedAdminIfNeeded();
    await seedJobsIfNeeded();
    await seedDetailedJob();
    await ensureMinimumJobs(12);
    await seedPrepData();
    scheduleAutoCleanup();
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Database connection failed:', err.message);
  })
  .finally(() => {
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on port ${PORT}`);
    });
  });
