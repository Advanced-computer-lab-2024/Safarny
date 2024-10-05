const mongoose = require('mongoose');

const Activity = require('../models/Activity'); 
const Itinerary = require('../models/Itinerary'); 
const HistoricalPlaces = require('../models/historicalplaces'); 



const searchController = {
    search: async (req, res) => {
        const { query, type } = req.query; // Get the search query and type from the request
        try {
            let results = {
                historicalPlaces: [],
                activities: [],
                itineraries: []
            };

            // Check which type of search to perform
            if (!query) {
                return res.status(400).json({ success: false, message: 'Query parameter is required' });
            }


            if (type === 'historical') {
                results.historicalPlaces = await HistoricalPlaces.find({
                    $or: [
                        { description: { $regex: query, $options: 'i' } }
                      
                       
                    ]
                });  
            } else if (type === 'activity') {
                results.activities = await Activity.find({
                    $or: [
                     
                        { category: { $regex: query, $options: 'i' } },
                        { tags: { $regex: query, $options: 'i' } }
                    ]
                });
            } else if (type === 'itinerary') {
                results.itineraries = await Itinerary.find({
                    $or: [
                        { name: { $regex: query, $options: 'i' } },
                        { category: { $regex: query, $options: 'i' } },
                        { tags: { $regex: query, $options: 'i' } }
                    ]
                });
                
            }  

            // Return all results
            return res.status(200).json({
                success: true,
                results
            });
        } catch (error) {
            console.error('Server error:', error);  // Log error for debugging
            return res.status(500).json({
                success: false,
                message: 'Not Found',
                error: error.message
            });
        }
    }
};

module.exports = searchController;
