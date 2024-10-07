const express = require("express");
const router = express.Router();
const {
  createHistoricalPlace,
  getAllHistoricalPlaces,
  getHistoricalPlaceById,
  updateHistoricalPlaceById,
  deleteHistoricalPlaceById,
} = require("../controllers/historicalplacesController.js");

const {
  createHistoricalTag, // Import the createHistoricalTag function
} = require("../controllers/HistoricalTagsController"); // Adjust the path as necessary

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

// Route to create a new historical tag (POST request)
router.post("/historical-tags", createHistoricalTag); // New route for creating historical tags

module.exports = router;
