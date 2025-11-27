const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/jobsController');

router.get('/', ctrl.getJobs);
router.get('/:id', ctrl.getJobById);
router.post('/', auth, ctrl.createJob);
router.put('/:id', auth, ctrl.updateJob);
router.delete('/:id', auth, ctrl.deleteJob);

module.exports = router;
