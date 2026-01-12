const express = require('express');
const Settings = require('../models/Settings');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all settings (public - for frontend to read ad link)
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.find({});
    const settingsObj = {};
    settings.forEach((s) => {
      settingsObj[s.key] = s.value;
    });
    res.json({ success: true, data: settingsObj });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get a specific setting by key (public)
router.get('/:key', async (req, res) => {
  try {
    const setting = await Settings.findOne({ key: req.params.key });
    res.json({ success: true, data: setting ? setting.value : '' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update or create a setting (protected - admin only)
router.put('/:key', authMiddleware, async (req, res) => {
  try {
    const { value } = req.body;
    const setting = await Settings.findOneAndUpdate(
      { key: req.params.key },
      { value },
      { new: true, upsert: true }
    );
    res.json({ success: true, data: setting });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Bulk update settings (protected - admin only)
router.post('/bulk', authMiddleware, async (req, res) => {
  try {
    const { settings } = req.body;
    const updates = Object.entries(settings).map(([key, value]) =>
      Settings.findOneAndUpdate({ key }, { value }, { new: true, upsert: true })
    );
    await Promise.all(updates);
    res.json({ success: true, message: 'Settings updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
