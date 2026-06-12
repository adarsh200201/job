const AdminLog = require('../models/AdminLog');

async function logAdminAction(adminId, username, action, req) {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';
    const requestUrl = req.originalUrl || req.url || '';

    await AdminLog.create({
      adminId: adminId || null,
      username: username || null,
      action,
      ip,
      userAgent,
      requestUrl
    });
    console.log(`📝 [AUDIT] logged action: "${action}" for admin/user: "${username || adminId}"`);
  } catch (err) {
    console.error('Audit logging failed:', err);
  }
}

module.exports = { logAdminAction };
