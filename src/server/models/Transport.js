const mongoose = require('mongoose');

// Define the transport schema
const transportSchema = new mongoose.Schema({
  departureDate: {
    type: Date,
    required: true
  },
  departureTime: {
    type: String,
    required: true
  },
  arrivalDate: {
    type: Date,
    required: true
  },
  arrivalTime: {
    type: String,
    required: true
  },
  typeOfTransportation: {
    type: String,
    enum: ['Bus', 'Car', 'Train', 'Boat'],
    required: true
  },
  departureLocation: {
    type: String,
    required: true
  },
  arrivalLocation: {
    type: String,
    required: true
  },
  advertiserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  advertiserName: {
    type: String,
    required: true
  },
  tourists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  numberOfTourists: {
    type: Number,
    default: 0 // This will be updated based on tourists array length
  }
});

// Create and export the Transport model
const Transport = mongoose.model('Transport', transportSchema);

module.exports = Transport;

