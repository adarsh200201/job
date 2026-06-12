const express = require('express');
const router = express.Router();
const auth = require('../middleware/adminAuth');
const optionalAuth = require('../middleware/optionalAuth');
const ctrl = require('../controllers/jobsController');
const recCtrl = require('../controllers/recommendationController');

// Public routes
router.get('/', optionalAuth, ctrl.getJobs);
router.get('/stats', ctrl.getJobStats);
router.get('/:idOrSlug', ctrl.getJobById);
router.get('/:id/related', recCtrl.getSimilarJobs);

// Protected routes (require authentication)
router.use(auth);
router.post('/', ctrl.createJob);
router.put('/:id', ctrl.updateJob);
router.delete('/:id', ctrl.deleteJob);

module.exports = router;
