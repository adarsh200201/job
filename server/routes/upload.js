const express = require('express');
const multer = require('multer');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/image', auth, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ success: true, imageUrl, filename: req.file.filename });
});

router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size exceeds 5MB limit' });
    }
  }
  if (err.message) {
    return res.status(400).json({ message: err.message });
  }
  next(err);
});

module.exports = router;
