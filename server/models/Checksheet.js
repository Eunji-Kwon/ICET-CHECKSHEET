const mongoose = require('mongoose');

const ChecksheetSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    day: {
        type: String,
        required: true
    },
    lab: {
        type: String,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    checkedBy: {
        type: String,
    },
    actualTime: {
        type: String,
    },
    isChecked: {
        type: Boolean,
        default: false
    },
}, {timestamps: true});

module.exports = mongoose.model('Checksheet', ChecksheetSchema);