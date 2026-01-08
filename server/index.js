const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { connectDB } = require('./utils/db');
const jobsRoutes = require('./routes/jobs');
const adminRoutes = require('./routes/admin');
const uploadRoutes = require('./routes/upload');
const { seedAdminIfNeeded, seedJobsIfNeeded, ensureMinimumJobs, seedDetailedJob } = require('./utils/seed');

dotenv.config();

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
app.use(express.static(path.join(__dirname, '../public')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.use('/api/jobs', jobsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

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
