const express = require('express');
const router = express.Router();
const optionalAuth = require('../middleware/optionalAuth');
const ctrl = require('../controllers/activityController');

// Log user activity
router.post('/log', optionalAuth, ctrl.logActivity);

module.exports = router;
