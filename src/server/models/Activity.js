import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
    date: { type: String, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },  // Human-readable location name
    coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    tags: [String],
    specialDiscount: { type: String },
    bookingOpen: { type: Boolean, default: true }
});

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;