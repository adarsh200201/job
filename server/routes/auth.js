const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('../config/passport');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(',')[0].trim()
  : 'http://localhost:3000';

const oauthConfigured =
  !!(process.env.GOOGLE_CLIENT_ID &&
     process.env.GOOGLE_CLIENT_SECRET &&
     process.env.GOOGLE_CALLBACK_URL);

// Middleware: return 503 if OAuth env vars are not configured
function requireOAuth(req, res, next) {
  if (!oauthConfigured) {
    return res.status(503).json({
      error:
        'Google OAuth is not configured on this server. ' +
        'Please set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_CALLBACK_URL in the Render environment variables.',
    });
  }
  next();
}

// ── Step 1: Redirect user to Google ─────────────────────────────────────────
router.get(
  '/google',
  requireOAuth,
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

// ── Step 2: Google calls us back ─────────────────────────────────────────────
router.get(
  '/google/callback',
  requireOAuth,
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${CLIENT_ORIGIN}/login?error=oauth_failed`,
  }),
  (req, res) => {
    const user = req.user;
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, avatar: user.avatar },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.redirect(
      `${CLIENT_ORIGIN}/auth/callback?token=${token}&name=${encodeURIComponent(user.name || user.email)}`
    );
  }
);

// ── Verify token ─────────────────────────────────────────────────────────────
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '').trim();
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ ok: true, user: decoded });
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// ── Get User Profile ────────────────────────────────────────────────────────
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ ok: true, user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

// ── Update User Profile / Onboarding ──────────────────────────────────────
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, phone, location, preferredRole, skills, experienceLevel, education } = req.body;
    
    let processedSkills = [];
    if (Array.isArray(skills)) {
      processedSkills = skills.map(s => s.trim()).filter(Boolean);
    } else if (typeof skills === 'string') {
      processedSkills = skills.split(',').map(s => s.trim()).filter(Boolean);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        phone,
        location,
        preferredRole,
        skills: processedSkills,
        experienceLevel,
        education,
        onboardingCompleted: true
      },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json({ ok: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

module.exports = router;
