const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const passport = require('./config/passport');
const { connectDB } = require('./utils/db');
const jobsRoutes = require('./routes/jobs');
const adminRoutes = require('./routes/admin');
const uploadRoutes = require('./routes/upload');
const settingsRoutes = require('./routes/settings');
const seoRoutes = require('./routes/seo');
const authRoutes = require('./routes/auth');
const { seedAdminIfNeeded, seedJobsIfNeeded, ensureMinimumJobs, seedDetailedJob } = require('./utils/seed');

const app = express();
const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';

const parseAllowedOrigins = (value) =>
  String(value)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

const allowedOrigins = parseAllowedOrigins(CLIENT_ORIGIN);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes('*')) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: false,
  })
);
app.use(express.json());

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
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/auth', authRoutes);
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
