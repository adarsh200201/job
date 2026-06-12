const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/controlController');
const adminAuth = require('../middleware/adminAuth');
const csrfProtection = require('../middleware/csrfMiddleware');
const { loginLimiter } = require('../middleware/rateLimiter');

// ─── PUBLIC endpoints (no auth required) ─────────────────────────────────────

// Seed CSRF token — returns token in body AND sets cookie
router.get('/csrf-token', csrfProtection, (req, res) => {
  // The csrfProtection middleware already sets the cookie.
  // Also return it in the response body so the frontend can store it in memory.
  const token = req.cookies?.csrfToken || res.getHeader('X-CSRF-Token') || '';
  res.json({ ok: true, csrfToken: token });
});

// Login — rate-limited per IP, CSRF protected
router.post('/login', loginLimiter, csrfProtection, ctrl.login);

// Verify 2FA OTP after successful password step
router.post('/login/verify-otp', loginLimiter, csrfProtection, ctrl.verifyLoginOTP);

// Refresh access token via HTTP-only cookie (no CSRF needed — refresh token IS the secret)
router.post('/refresh-token', ctrl.refreshToken);

// Logout (clears refresh token cookie)
router.post('/logout', ctrl.logout);

// ─── PROTECTED endpoints (JWT + CSRF required) ────────────────────────────────
router.use(adminAuth);
router.use(csrfProtection);

// 2FA management
router.post('/2fa/setup', ctrl.setup2FA);
router.post('/2fa/verify', ctrl.verify2FA);
router.post('/2fa/disable', ctrl.disable2FA);

// Audit logs
router.get('/logs', ctrl.getLogs);

// Seed / clear sample jobs
router.post('/seed', ctrl.seedJobs);
router.post('/clear-seed', ctrl.clearSeed);

module.exports = router;
