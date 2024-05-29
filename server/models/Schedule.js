const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({}, { strict: false });

module.exports = mongoose.model('Schedule', ScheduleSchema);