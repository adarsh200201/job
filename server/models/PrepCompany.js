const mongoose = require('mongoose');

const prepCompanySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, index: true },
  order: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, {
  timestamps: true
});

module.exports = mongoose.model('PrepCompany', prepCompanySchema);
