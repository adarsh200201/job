const jwt = require('jsonwebtoken');

function adminAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [type, token] = header.split(' ');
  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Unauthorized: Admin authentication required' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_change_me');
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    req.user = { id: decoded.id, username: decoded.username, role: decoded.role };
    return next();
  } catch (e) {
    if (e.name === 'TokenExpiredError') {
      return res.status(401).json({ code: 'TOKEN_EXPIRED', message: 'Token has expired' });
    }
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = adminAuth;
