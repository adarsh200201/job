const express = require('express');
const router = express.Router();
const optionalAuth = require('../middleware/optionalAuth');
const ctrl = require('../controllers/recommendationController');

// Recommendations feeding carousels
router.get('/', optionalAuth, ctrl.getRecommendations);

// Recommendations feeding widgets
router.get('/widgets', optionalAuth, ctrl.getWidgets);

// Recommendations matching notifications
router.get('/notifications', optionalAuth, ctrl.getNotifications);

module.exports = router;
