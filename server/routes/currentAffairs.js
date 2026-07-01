const express = require('express');
const router = express.Router();
const CurrentAffair = require('../models/CurrentAffair');

// GET /api/current-affairs - Retrieve daily current affairs (optionally filter by category)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const query = {};
    if (category && category !== 'All') {
      query.category = category;
    }
    const items = await CurrentAffair.find(query).sort({ date: -1, createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving current affairs: ' + err.message });
  }
});

// POST /api/current-affairs - Create a new daily current affair record (admin or automated scraper ingestion)
router.post('/', async (req, res) => {
  try {
    const { title, category, date, summary, source } = req.body;
    if (!title || !category || !summary) {
      return res.status(400).json({ message: 'Title, category, and summary are required.' });
    }
    
    const newRecord = new CurrentAffair({
      title,
      category,
      date: date ? new Date(date) : undefined,
      summary,
      source
    });
    
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(500).json({ message: 'Error adding current affair: ' + err.message });
  }
});

module.exports = router;
