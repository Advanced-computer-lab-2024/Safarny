const { Router } = require("express");
const router = Router();
const {
  createItinerary,
  getAllItineraries,
  getItineraryById,
  updateItineraryById,
  deleteItineraryById,
  updateItineraryTagById,
} = require("../controllers/itineraryController.js");

router.post("/", createItinerary);
router.get("/", getAllItineraries);
router.get("/:id", getItineraryById);
router.delete("/:id", deleteItineraryById);
router.patch("/:id", updateItineraryById);
router.patch("/:id/tags", updateItineraryTagById);

module.exports = router;
