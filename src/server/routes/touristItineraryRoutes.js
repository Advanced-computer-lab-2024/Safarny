import { Router } from "express";
const router = Router();

import { getTouristItineraries, createTouristItinerary, updateTouristItinerary, deleteTouristItinerary } from "../controllers/touristItineraryController.js";

router.get('/', getTouristItineraries);
router.post('/', createTouristItinerary);
router.put('/:id', updateTouristItinerary);
router.delete('/:id', deleteTouristItinerary);

export default router;
