const { Router } = require("express");
const router = Router();
/*
    1-get all this ToursimGoverner (Activity, HistoricalPlace, Musseum, Itinerary)
    2-CRUD on (HistoricalPlace, Musseum)
    3-post tags for historicalPlace

*/

const {
    createHistoricalPlace,
    getAllHistoricalPlaces,
    getHistoricalPlaceById,
    updateHistoricalPlaceById,
    deleteHistoricalPlaceById,
  } = require("../controllers/historicalplacesController.js"); // Updated import to postsController.js
  
  // Route to create a new historical place (POST request)
  router.post("/places", createHistoricalPlace);
  
  // Route to get all historical places (GET request)
  router.get("/places", getAllHistoricalPlaces);
  
  // Route to get a specific historical place by its ID (GET request)
  router.get("/places/:id", getHistoricalPlaceById);
  
  // Route to update a historical place by its ID (PUT request)
  router.put("/places/:id", updateHistoricalPlaceById);
  
  // Route to delete a historical place by its ID (DELETE request)
  router.delete("/places/:id", deleteHistoricalPlaceById);

module.exports = router;
