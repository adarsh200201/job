const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('../config/passport');

const router = express.Router();

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(',')[0].trim()
  : 'http://localhost:3000';

// ── Step 1: Redirect user to Google ─────────────────────────────────────────
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

// ── Step 2: Google calls us back ─────────────────────────────────────────────
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${CLIENT_ORIGIN}/login?error=oauth_failed` }),
  (req, res) => {
    const user = req.user;
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, avatar: user.avatar },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    // Redirect to frontend with token in query string
    res.redirect(`${CLIENT_ORIGIN}/auth/callback?token=${token}&name=${encodeURIComponent(user.name || user.email)}`);
  }
);

// ── Verify token (used by frontend to validate a stored JWT) ─────────────────
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

module.exports = router;
