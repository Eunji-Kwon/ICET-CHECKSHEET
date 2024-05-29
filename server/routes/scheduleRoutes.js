const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

router.post('/', scheduleController.createSchedule);
router.get('/today', scheduleController.getTodaySchedule);
router.get('/', scheduleController.getAllSchedules);

module.exports = router;