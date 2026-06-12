const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  order: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
});

const subCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  order: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  topics: [topicSchema]
});

const prepCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, index: true },
  order: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  subCategories: [subCategorySchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('PrepCategory', prepCategorySchema);
