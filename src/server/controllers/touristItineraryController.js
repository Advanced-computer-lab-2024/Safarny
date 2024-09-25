import AsyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import TouristItineraryModel from "../models/touristItineraryModel.js";

// Get all itineraries (optionally filter by tags or date range)
const getTouristItineraries = AsyncHandler(async (req, res) => {
    const { tags, startDate, endDate } = req.query;

    let query = {};
    
    if (tags) {
        query.tags = { $in: tags.split(',') };
    }

    if (startDate && endDate) {
        query.startDate = { $gte: new Date(startDate) };
        query.endDate = { $lte: new Date(endDate) };
    }

    try {
        const itineraries = await TouristItineraryModel.find(query);
        return res.status(200).json(itineraries);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Create a new itinerary
const createTouristItinerary = AsyncHandler(async (req, res) => {
    const { name, activities, locations, startDate, endDate, tags } = req.body;

    try {
        const newItinerary = await TouristItineraryModel.create({ 
            name, 
            activities, 
            locations, 
            startDate, 
            endDate, 
            tags 
        });
        res.status(201).json(newItinerary);
    } catch (error) {
        console.error('Error creating itinerary:', error.message); // Log the error message
        res.status(500).json({ message: 'Server error', error: error.message }); // Send the actual error message
    }
});

// Update an existing itinerary
const updateTouristItinerary = AsyncHandler(async (req, res) => {
    const itineraryId = req.params.id;
    const { name, activities, locations, startDate, endDate, tags } = req.body;

    if (!mongoose.Types.ObjectId.isValid(itineraryId)) {
        return res.status(400).json({ message: 'Invalid itinerary ID' });
    }

    try {
        const updatedItinerary = await TouristItineraryModel.findByIdAndUpdate(
            itineraryId,
            { name, activities, locations, startDate, endDate, tags },
            { new: true }
        );

        if (!updatedItinerary) {
            return res.status(404).json({ message: 'Itinerary not found' });
        }

        res.status(200).json(updatedItinerary);
    } catch (error) {
        console.error('Error updating itinerary:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete an itinerary
const deleteTouristItinerary = AsyncHandler(async (req, res) => {
    const itineraryId = req.params.id;

    try {
        const deletedItinerary = await TouristItineraryModel.findByIdAndDelete(itineraryId);
        if (!deletedItinerary) {
            return res.status(404).json({ message: 'Itinerary not found' });
        }
        res.status(200).json({ message: 'Itinerary deleted successfully' });
    } catch (error) {
        console.error('Error deleting itinerary:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export { getTouristItineraries, createTouristItinerary, updateTouristItinerary, deleteTouristItinerary };
