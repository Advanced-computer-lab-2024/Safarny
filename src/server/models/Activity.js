import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    duration: {
        type: Number, // Duration in minutes
        required: true
    },
    timeline: {
        type: String,
        required: true
    },
    category: {
        type: Object,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

const Activity = mongoose.model("Activity", activitySchema);
module.exports = Activity;
