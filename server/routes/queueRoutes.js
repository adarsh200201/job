const express = require('express');
const router = express.Router();
const auth = require('../middleware/adminAuth');
const ctrl = require('../controllers/queueController');

// All queue routes require admin authentication
router.use(auth);

router.post('/add', ctrl.addJob);
router.post('/batch', ctrl.getJobsBatch);
router.post('/return', ctrl.returnJobToQueue);
router.post('/failed', ctrl.addToFailedQueue);
router.get('/size', ctrl.getQueueSize);
router.get('/breakdown', ctrl.getQueueBreakdown);
router.get('/seen/all', ctrl.getAllSeenHashes);
router.get('/seen/:hash', ctrl.isJobSeen);
router.post('/seen/mark', ctrl.markJobSeen);
router.get('/linkedin-limit', ctrl.countLinkedinGovtPosts);
router.post('/linkedin-limit/log', ctrl.logLinkedinGovtPost);

module.exports = router;
