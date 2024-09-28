import express from 'express';
import {
  createHistoricalPlace,
  getAllHistoricalPlaces,
  getHistoricalPlaceById,
  updateHistoricalPlaceById,
  deleteHistoricalPlaceById
} from '../controllers/postsController.js';  // Updated import to postsController.js

const router = express.Router();

// Route to create a new historical place (POST request)
router.post('/places', createHistoricalPlace);

// Route to get all historical places (GET request)
router.get('/places', getAllHistoricalPlaces);

// Route to get a specific historical place by its ID (GET request)
router.get('/places/:id', getHistoricalPlaceById);

// Route to update a historical place by its ID (PUT request)
router.put('/places/:id', updateHistoricalPlaceById);

// Route to delete a historical place by its ID (DELETE request)
router.delete('/places/:id', deleteHistoricalPlaceById);

export default router;
