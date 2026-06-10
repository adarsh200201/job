const express = require('express');
const router = express.Router();
const auth = require('../middleware/adminAuth');
const ctrl = require('../controllers/jobsController');

// Public routes
router.get('/', ctrl.getJobs);
router.get('/stats', ctrl.getJobStats);
router.get('/:idOrSlug', ctrl.getJobById);
router.get('/:id/related', ctrl.getRelatedJobs);

// Protected routes (require authentication)
router.use(auth);
router.post('/', ctrl.createJob);
router.put('/:id', ctrl.updateJob);
router.delete('/:id', ctrl.deleteJob);

module.exports = router;
