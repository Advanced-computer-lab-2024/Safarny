const TouristPreferences = require('../models/Preferences');

// Get or create tourist preferences by touristId
exports.getPreferences = async (req, res) => {
  try {
    const { touristId } = req.params;

    // Try to find existing preferences
    let preferences = await TouristPreferences.findOne({ touristId });

    // If no preferences found, create a new document with default values
    if (!preferences) {
      preferences = new TouristPreferences({
        touristId,
        preferences: {
          historicAreas: [],
          beaches: [],
          familyFriendly: [],
          shopping: [],
          budget: []
        }
      });

      // Save the new preferences to the database
      await preferences.save();
    }

    res.json(preferences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update tourist preferences by touristId
exports.updatePreferences = async (req, res) => {
  try {
    const { touristId } = req.params;
    const updatedPreferences = req.body.preferences;

    const preferences = await TouristPreferences.findOneAndUpdate(
      { touristId },
      { preferences: updatedPreferences },
      { new: true, upsert: true, runValidators: true } // "upsert: true" creates a new document if none is found
    );

    res.json(preferences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
