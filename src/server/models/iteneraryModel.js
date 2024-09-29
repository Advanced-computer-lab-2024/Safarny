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

const itenerarySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    activities: [activitySchema],
    language: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    availableDates: [{
        type: Date,
        required: true
    }],
    accessibility: {
        type: Boolean,
        required: true
    },
    pickUpLocation: {
        type: String,
        required: true
    },
    dropOffLocation: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Itenerary = mongoose.model('Itenerary', itenerarySchema);

export default Itenerary;