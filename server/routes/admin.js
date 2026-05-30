const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/adminController');
const auth = require('../middleware/adminAuth');

router.post('/login', ctrl.login);
// Protected seed endpoint — admin must be authenticated
router.post('/seed', auth, ctrl.seedJobs);
// Protected clear-seed endpoint — removes seeded/sample jobs
router.post('/clear-seed', auth, ctrl.clearSeed);

module.exports = router;
