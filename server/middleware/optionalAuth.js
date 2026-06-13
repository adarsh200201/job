const jwt = require('jsonwebtoken');

function optionalAuth(req, res, next) {
  const header = req.headers.authorization || '';
  if (!header) {
    return next();
  }
  
  const [type, token] = header.split(' ');
  if (type !== 'Bearer' || !token) {
    return next();
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_change_me');
    req.user = { id: decoded.id, username: decoded.username, role: decoded.role || 'user' };
  } catch (e) {
    // Ignore invalid token and continue as guest
  }
  
  return next();
}

module.exports = optionalAuth;
