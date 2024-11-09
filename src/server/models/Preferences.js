const mongoose = require('mongoose');

// Define the tourist preferences schema
const touristPreferencesSchema = new mongoose.Schema({
  touristId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  preferences: {
    historicAreas: {
      type: [String],
      default: []
    },
    beaches: {
      type: [String],
      default: []
    },
    familyFriendly: {
      type: [String],
      enum: ['yes', 'no'],
      default: []
    },
    shopping: {
      type: [String],
      default: []
    },
    budget: {
      type: [String],
      enum: ['low', 'medium', 'high'],
      default: []
    }
  }
});

// Create and export the TouristPreferences model
const TouristPreferences = mongoose.model('TouristPreferences', touristPreferencesSchema);

module.exports = TouristPreferences;
