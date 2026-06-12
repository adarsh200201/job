const mongoose = require('mongoose');

const AdminLogSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: false },
  username: { type: String, required: false },
  action: { type: String, required: true },
  ip: { type: String, required: true },
  userAgent: { type: String, required: true },
  requestUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AdminLog', AdminLogSchema);
