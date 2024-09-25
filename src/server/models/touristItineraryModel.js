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
    }
});

const itinerarySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    activities: [activitySchema],
    locations: {
        type: [String], // List of location names or addresses
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    tags: {
        type: [String], // Used for filtering itineraries later
        required: false
    }
}, {
    timestamps: true
});

const TouristItinerary = mongoose.model('TouristItinerary', itinerarySchema);
export default TouristItinerary;
