//const Museum = require('./models/Museum'); // Adjust path as necessary
const Activity = require('../models/Activity'); // Adjust path as necessary
const Itinerary = require('../models/Itinerary'); // Adjust path as necessary
const HistoricalPlaces = require('../models/historicalplaces'); 


// Search Controller
const searchController = {
    search: async (req, res) => {
        const { query } = req.query; // Get the search query from the request
        try {
            // Search in all relevant collections
            const historicalPlaces = await HistoricalPlaces.find({
                $or: [
                    { name: { $regex: query, $options: 'i' } }, // Search by name
                    { category: { $regex: query, $options: 'i' } }, // Search by category
                    { tags: { $regex: query, $options: 'i' } } // Search by tags
                ]
            });

            const activities = await Activity.find({
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { category: { $regex: query, $options: 'i' } },
                    { tags: { $regex: query, $options: 'i' } }
                ]
            });

            const itineraries = await Itinerary.find({
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { category: { $regex: query, $options: 'i' } },
                    { tags: { $regex: query, $options: 'i' } }
                ]
            });

            /*
            const itineraries = await Itinerary.find({
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { category: { $regex: query, $options: 'i' } },
                    { tags: { $regex: query, $options: 'i' } }
                ]
            });
            */







            // Return all results
            return res.status(200).json({
                success: true,
                museums,
                activities,
                itineraries
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error searching',
                error: error.message
            });
        }
    }
};

module.exports = searchController;
