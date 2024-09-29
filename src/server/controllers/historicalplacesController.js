const HistoricalPlace = require("../models/historicalplaces.js");

// Controller for creating a new historical place
const createHistoricalPlace = async (req, res) => {
    try {
        const { description, pictures, location, openingHours, ticketPrices } = req.body;

        // Create a new Historical Place
        const newPlace = new HistoricalPlace({
            description,
            pictures,
            location,
            openingHours,
            ticketPrices,
        });

        // Save the new place to the database
        const savedPlace = await newPlace.save();

        res.status(201).json({
            message: 'Historical place created successfully',
            place: savedPlace,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Controller to get all historical places
const getAllHistoricalPlaces = async (req, res) => {
    try {
        const places = await HistoricalPlace.find(); // Fetch all historical places
        res.status(200).json(places);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Controller to get a historical place by ID
const getHistoricalPlaceById = async (req, res) => {
    try {
        const placeId = req.params.id;

        // Find the place by its ID
        const place = await HistoricalPlace.findById(placeId);

        if (!place) {
            return res.status(404).json({ message: 'Historical place not found' });
        }

        res.status(200).json(place);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Controller to update a historical place by its _id
const updateHistoricalPlaceById = async (req, res) => {
    try {
        const placeId = req.params.id;
        const { description, pictures, location, openingHours, ticketPrices } = req.body;

        // Find the place by its ID and update it with new data
        const updatedPlace = await HistoricalPlace.findByIdAndUpdate(
            placeId,
            { description, pictures, location, openingHours, ticketPrices },
            { new: true, runValidators: true } // Return the updated document
        );

        if (!updatedPlace) {
            return res.status(404).json({ message: 'Historical place not found' });
        }

        res.status(200).json({
            message: 'Historical place updated successfully',
            place: updatedPlace,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Controller to delete a historical place by its _id
const deleteHistoricalPlaceById = async (req, res) => {
    try {
        const placeId = req.params.id;

        // Find the place by its ID and delete it
        const deletedPlace = await HistoricalPlace.findByIdAndDelete(placeId);

        if (!deletedPlace) {
            return res.status(404).json({ message: 'Historical place not found' });
        }

        res.status(200).json({ message: 'Historical place deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createHistoricalPlace,
    getAllHistoricalPlaces,
    getHistoricalPlaceById,
    updateHistoricalPlaceById,
    deleteHistoricalPlaceById
};
