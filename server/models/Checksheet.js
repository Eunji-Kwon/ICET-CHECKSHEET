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

// // Add a TTL index to delete documents after 1 day (86400 seconds)
// ChecksheetSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model('Checksheet', ChecksheetSchema);