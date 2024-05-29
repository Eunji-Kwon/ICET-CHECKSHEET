const Schedule = require('../models/Schedule');

exports.createSchedule = async (req, res) => {
    try {
        // Delete all documents in the Schedule collection
        await Schedule.deleteMany({});

        const schedules = req.body;
        const savedSchedules = [];

        for (let schedule of schedules) {
            const newSchedule = new Schedule(schedule);
            const savedSchedule = await newSchedule.save();
            savedSchedules.push(savedSchedule);
        }

        res.json(savedSchedules);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTodaySchedule = async (req, res) => {
    let today = new Date().toLocaleString('en-us', {  weekday: 'long' });
    if (today === 'Sunday') {
        today = 'Monday';
    }
    const schedule = await Schedule.find({ 
        Day: today, 
        Course: 'Close the Lab',
        Lab: { $not: /^([DE])/ } // Lab does not start with D or E
    });
    res.json(schedule);
};

exports.getAllSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.find();
        res.json(schedules);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};