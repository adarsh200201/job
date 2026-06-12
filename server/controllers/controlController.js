const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const slugify = require('slugify');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const axios = require('axios');
const Admin = require('../models/Admin');
const Job = require('../models/Job');
const AdminLog = require('../models/AdminLog');
const { logAdminAction } = require('../utils/auditLogger');

// Verify Cloudflare Turnstile token
async function verifyTurnstile(token, ip) {
  const secretKey = process.env.TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000UNKNOWN';
  try {
    const params = new URLSearchParams();
    params.append('secret', secretKey);
    params.append('response', token);
    if (ip) {
      params.append('remoteip', ip);
    }
    const res = await axios.post('https://challenges.cloudflare.com/turnstile/v0/siteverify', params);
    if (!res.data.success) {
      console.warn('[Turnstile] Verification failed. Response:', res.data);
    }
    return res.data.success;
  } catch (err) {
    console.error('Turnstile verification failed:', err);
    return false;
  }
}

// Helper to issue access + refresh tokens
async function issueTokens(admin, res, req) {
  const accessToken = jwt.sign(
    { id: admin._id.toString(), username: admin.username, role: 'admin' },
    process.env.JWT_SECRET || 'dev_secret_change_me',
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { id: admin._id.toString(), role: 'admin' },
    process.env.REFRESH_TOKEN_SECRET || 'refresh_secret_change_me',
    { expiresIn: '7d' }
  );
  
  admin.refreshToken = refreshToken;
  await admin.save();
  
  // Set Refresh Token as HTTP-only secure cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
  
  await logAdminAction(admin._id, admin.username, 'Login Success', req);
  
  res.json({ token: accessToken, username: admin.username, twoFactorEnabled: admin.twoFactorEnabled });
}

exports.login = async (req, res) => {
  const { username, password, captchaToken } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
  
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }
  
  // Verify Turnstile CAPTCHA in production or if token is present
  if (process.env.NODE_ENV === 'production' || captchaToken) {
    const captchaOk = await verifyTurnstile(captchaToken, ip);
    if (!captchaOk) {
      await logAdminAction(null, username, 'Failed Login - Invalid CAPTCHA', req);
      return res.status(400).json({ message: 'CAPTCHA verification failed' });
    }
  }
  
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      await logAdminAction(null, username, 'Failed Login - Invalid Username', req);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      await logAdminAction(admin._id, username, 'Failed Login - Incorrect Password', req);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    if (admin.twoFactorEnabled) {
      const tempToken = jwt.sign(
        { id: admin._id.toString(), username: admin.username, role: 'admin', step2fa: true },
        process.env.JWT_SECRET || 'dev_secret_change_me',
        { expiresIn: '5m' }
      );
      return res.json({ twoFactorRequired: true, tempToken });
    }
    
    await issueTokens(admin, res, req);
  } catch (e) {
    res.status(500).json({ message: 'Login failed' });
  }
};

exports.verifyLoginOTP = async (req, res) => {
  const { otp, tempToken } = req.body;
  try {
    const decoded = jwt.verify(tempToken, process.env.JWT_SECRET || 'dev_secret_change_me');
    if (!decoded.step2fa) {
      return res.status(400).json({ message: 'Invalid token step' });
    }
    
    const admin = await Admin.findById(decoded.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    
    const verified = speakeasy.totp.verify({
      secret: admin.twoFactorSecret,
      encoding: 'base32',
      token: otp
    });
    
    if (!verified) {
      await logAdminAction(admin._id, admin.username, 'Failed Login - Invalid 2FA OTP', req);
      return res.status(401).json({ message: 'Invalid OTP code' });
    }
    
    await issueTokens(admin, res, req);
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired temporary token' });
  }
};

exports.refreshToken = async (req, res) => {
  const tokenFromCookie = req.cookies ? req.cookies.refreshToken : null;
  if (!tokenFromCookie) return res.status(401).json({ message: 'No refresh token' });
  
  try {
    const decoded = jwt.verify(tokenFromCookie, process.env.REFRESH_TOKEN_SECRET || 'refresh_secret_change_me');
    const admin = await Admin.findById(decoded.id);
    if (!admin || admin.refreshToken !== tokenFromCookie) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }
    
    const accessToken = jwt.sign(
      { id: admin._id.toString(), username: admin.username, role: 'admin' },
      process.env.JWT_SECRET || 'dev_secret_change_me',
      { expiresIn: '15m' }
    );
    
    res.json({ token: accessToken });
  } catch (err) {
    res.status(403).json({ message: 'Expired or invalid refresh token' });
  }
};

exports.logout = async (req, res) => {
  try {
    const tokenFromCookie = req.cookies ? req.cookies.refreshToken : null;
    if (tokenFromCookie) {
      const decoded = jwt.verify(tokenFromCookie, process.env.REFRESH_TOKEN_SECRET || 'refresh_secret_change_me');
      const admin = await Admin.findById(decoded.id);
      if (admin) {
        admin.refreshToken = '';
        await admin.save();
        await logAdminAction(admin._id, admin.username, 'Logout', req);
      }
    }
  } catch (err) {
    // Ignore verify errors on logout
  }
  
  res.clearCookie('refreshToken');
  res.json({ success: true, message: 'Logged out successfully' });
};

exports.setup2FA = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    
    const secret = speakeasy.generateSecret({ name: `NextJobPost Control Center (${admin.username})` });
    admin.twoFactorSecret = secret.base32;
    admin.twoFactorEnabled = false;
    await admin.save();
    
    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);
    res.json({ success: true, qrCodeUrl, secret: secret.base32 });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.verify2FA = async (req, res) => {
  const { token } = req.body;
  try {
    const admin = await Admin.findById(req.user.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    
    const verified = speakeasy.totp.verify({
      secret: admin.twoFactorSecret,
      encoding: 'base32',
      token
    });
    
    if (!verified) {
      return res.status(400).json({ success: false, message: 'Invalid OTP code' });
    }
    
    admin.twoFactorEnabled = true;
    await admin.save();
    
    await logAdminAction(admin._id, admin.username, '2FA Enabled', req);
    res.json({ success: true, message: '2FA enabled successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.disable2FA = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    
    admin.twoFactorEnabled = false;
    admin.twoFactorSecret = '';
    await admin.save();
    
    await logAdminAction(admin._id, admin.username, '2FA Disabled', req);
    res.json({ success: true, message: '2FA disabled successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getLogs = async (req, res) => {
  try {
    const logs = await AdminLog.find({}).sort({ createdAt: -1 }).limit(100).lean();
    res.json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.seedJobs = async (req, res) => {
  try {
    const sample = [
      {
        title: 'Campus Hiring - Trainee Engineer',
        company: 'Tech Innovators',
        location: 'Bengaluru',
        type: 'Full-Time',
        experience: '0-1 years',
        education: 'B.Tech/B.E (CSE/IT)',
        batch: '2024-2025 Batch',
        jobDescription: 'A campus hiring opportunity for fresh graduates to join our engineering team as trainees. You will work on exciting projects and learn from experienced professionals.',
        description: 'Campus hiring opportunity for fresh graduates to join our engineering team as trainees.',
        applyLink: 'https://example.com/apply/tech-innovators',
        responsibilities: ['Work on assigned projects', 'Learn best practices', 'Collaborate with team'],
        requirements: ['B.Tech (CSE/IT)', 'Good communication', 'Problem-solving skills'],
        skills: ['JavaScript', 'Problem Solving'],
      },
      {
        title: 'Graduate Software Engineer',
        company: 'NextGen Soft',
        location: 'Hyderabad',
        type: 'Full-Time',
        experience: '0-1 years',
        education: 'B.Tech/B.E (CSE/IT)',
        batch: '2024 Batch',
        jobDescription: 'Join NextGen Soft as a graduate software engineer working on backend services and APIs. We offer mentorship and career growth opportunities.',
        description: 'Graduate software engineer position working on backend services.',
        applyLink: 'https://example.com/apply/nextgen',
        responsibilities: ['Develop backend services', 'Write unit tests', 'Participate in code reviews'],
        requirements: ['B.Tech (CSE/IT)', 'DSA knowledge', 'Communication skills'],
        skills: ['Node.js', 'MongoDB', 'REST APIs'],
      },
      {
        title: 'Intern - Frontend Developer',
        company: 'UI Labs',
        location: 'Remote',
        type: 'Internship',
        experience: '0 years',
        education: 'B.Tech/B.E (CSE/IT/Any)',
        batch: '2025 Batch',
        jobDescription: 'Frontend internship opportunity focusing on React and responsive web design. Learn modern web technologies and build portfolio projects.',
        description: 'Frontend internship focusing on React and Bootstrap.',
        applyLink: 'https://example.com/apply/uilabs',
        responsibilities: ['Build UI components', 'Implement responsive designs', 'Learn React basics'],
        requirements: ['HTML/CSS/JS basics', 'Enthusiasm to learn', 'Good communication'],
        skills: ['HTML5', 'CSS3', 'JavaScript', 'React'],
      },
    ];

    const sampleWithSlugs = sample.map(job => ({
      ...job,
      slug: slugify(job.title, { lower: true, strict: true }),
    }));

    const created = await Job.create(sampleWithSlugs);
    await logAdminAction(req.user.id, req.user.username, `Seed sample jobs: ${created.length} created`, req);
    res.json({ message: `Seeded ${created.length} jobs successfully` });
  } catch (e) {
    res.status(500).json({ message: `Seed failed: ${e.message}` });
  }
};

exports.clearSeed = async (req, res) => {
  try {
    const sampleTitles = [
      'Campus Hiring - Trainee Engineer',
      'Graduate Software Engineer',
      'Intern - Frontend Developer',
      'Software Engineer - Fresher',
      'Frontend Developer Internship',
      'Junior QA Engineer',
      'Part-time Content Writer',
      'Work From Home - Data Entry',
      'Backend Developer - Node.js',
      'DevOps Intern',
      'Graphic Designer (Part-Time)',
      'Data Analyst - Fresher',
      'Customer Support - Remote',
      'Marketing Executive (Fresher)',
      'EPAM Off Campus Drive 2026 – Hiring Junior Software Engineer (Trainee)',
      'EPAM Off Campus Drive 2026 – Junior Software Engineer (Trainee)',
      'Full Stack Developer - Fresher Program',
    ];

    const sampleCompanies = ['Tech Innovators', 'NextGen Soft', 'UI Labs', 'Acme Tech', 'Bright Labs', 'QualityFirst', 'MediaWorks', 'HomeOffice Pvt Ltd', 'ServerWorks', 'CloudOps', 'DesignHub', 'DataSense', 'Helply', 'MarketPro', 'EPAM Systems', 'TechVision Solutions'];

    const result = await Job.deleteMany({ $or: [ { title: { $in: sampleTitles } }, { company: { $in: sampleCompanies } } ] });
    await logAdminAction(req.user.id, req.user.username, `Clear sample jobs: ${result.deletedCount} deleted`, req);

    res.json({ message: `Deleted ${result.deletedCount} seeded/sample jobs` });
  } catch (e) {
    res.status(500).json({ message: `Clear seed failed: ${e.message}` });
  }
};
