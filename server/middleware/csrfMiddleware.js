const crypto = require('crypto');

function csrfProtection(req, res, next) {
  // Safe methods do not require CSRF verification — but seed/refresh the token
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    let token = req.cookies?.csrfToken;
    if (!token) {
      token = crypto.randomBytes(32).toString('hex');
      res.cookie('csrfToken', token, {
        httpOnly: false,         // MUST be readable by JS to attach as header
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        path: '/',
        maxAge: 24 * 60 * 60 * 1000  // 24 hours
      });
    }
    // Always expose token in response header so frontend can grab it directly
    res.setHeader('X-CSRF-Token', token);
    return next();
  }

  // For mutation requests — skip CSRF check in development if no token is present
  // (Prevents dev-only cookie issues from blocking all admin actions)
  if (process.env.NODE_ENV !== 'production') {
    const cookieToken = req.cookies?.csrfToken;
    const headerToken = req.headers['x-csrf-token'];
    // In dev: if neither is set, skip (allows Postman/dev tools)
    // If one is set, still validate them
    if (!cookieToken && !headerToken) {
      return next();
    }
    if (cookieToken && headerToken && cookieToken === headerToken) {
      return next();
    }
    if (!cookieToken || !headerToken) {
      // Partial — one missing, skip in dev but log warning
      console.warn('[CSRF] Dev mode: partial CSRF token, skipping enforcement');
      return next();
    }
    if (cookieToken !== headerToken) {
      return res.status(403).json({ message: 'CSRF token validation failed' });
    }
    return next();
  }

  // Production: strict enforcement
  const cookieToken = req.cookies?.csrfToken;
  const headerToken = req.headers['x-csrf-token'];

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return res.status(403).json({ message: 'CSRF token validation failed' });
  }

  next();
}

module.exports = csrfProtection;
