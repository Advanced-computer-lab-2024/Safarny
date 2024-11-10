const { Router } = require("express");
const router = Router();
const {
  createItinerary,
  getAllItineraries,
  getItineraryById,
  updateItineraryById,
  deleteItineraryById,
  updateItineraryTagById,
    updateRating
} = require("../controllers/itineraryController.js");

router.post("/", createItinerary);
router.get("/get", getAllItineraries);
router.get("/:id", getItineraryById);
router.delete("/:id", deleteItineraryById);
router.patch("/:id", updateItineraryById);
router.patch("/:id/tags", updateItineraryTagById);
router.put("/updaterating/:id", updateRating);

module.exports = router;
