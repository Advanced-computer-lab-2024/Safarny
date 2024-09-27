import AsyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import IteneraryModel from "../models/iteneraryModel.js";

const getIteneraries = AsyncHandler(async (req, res) => {
    const { type } = req.query; // Get the user type from query parameters

    if (!type) {
        return res.status(400).json({ message: 'User type is required' });
    }

    try {
        // Find users with the specified type
        const iteneraries = await IteneraryModel.find({ type });

        // Return the users found
        return res.status(200).json(iteneraries);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
});

const deleteItenerary = AsyncHandler(async (req, res) => {
    const iteneraryId = req.params.id;

    try {
        const deletedItenerary = await IteneraryModel.findByIdAndDelete(iteneraryId);
        if (!deletedItenerary) {
            return res.status(404).json({ message: 'Itenerary not found' });
        }
        res.status(200).json({ message: 'Itenerary deleted successfully' });
    } catch (error) {
        console.error('Error deleting itenerary:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

const updateItenerary = AsyncHandler(async (req, res) => {
    const iteneraryId = req.params.id;
    const { name, description, date, type, activities, language, price, availableDates, accessibility, pickUpLocation, dropOffLocation } = req.body;

    if (!mongoose.Types.ObjectId.isValid(iteneraryId)) {
        return res.status(400).json({ message: 'Invalid itenerary ID' });
    }

    try {
        const updatedItenerary = await IteneraryModel.findByIdAndUpdate(
            iteneraryId,
            { name, description, date, type, activities, language, price, availableDates, accessibility, pickUpLocation, dropOffLocation },
            { new: true }
        );

        if (!updatedItenerary) {
            return res.status(404).json({ message: 'Itenerary not found' });
        }

        res.status(200).json(updatedItenerary);
    } catch (error) {
        console.error('Error updating itenerary:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

const createItenerary = AsyncHandler(async (req, res) => {
    const { name, description, date, type, activities, language, price, availableDates, accessibility, pickUpLocation, dropOffLocation } = req.body;

    try {
        const newItenerary = await IteneraryModel.create({ name, description, date, type, activities, language, price, availableDates, accessibility, pickUpLocation, dropOffLocation });
        res.status(201).json(newItenerary);
    } catch (error) {
        console.error('Error creating itenerary:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export { getIteneraries, deleteItenerary, updateItenerary, createItenerary };