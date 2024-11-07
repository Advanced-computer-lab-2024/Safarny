// transportRoutes.js

const { Router } = require("express");
const router = Router();

const {
  createTransport,
  deleteTransport,
  updateTransport,
  updateTransportsByAdvertiserId,
  getAllTransports,
  getTransportById,
  getTransportsByAdvertiserId,
} = require("../controllers/TransportController");

// Transport routes
router.post("/transports", createTransport); // Create a new transport
router.get("/transports/advertiser/:advertiserId", getTransportsByAdvertiserId); // Get all transports by advertiserId
router.put("/transports/advertiser/:advertiserId", updateTransportsByAdvertiserId); // Update transports by advertiserId
router.get("/transports/:transportId", getTransportById); // Get a specific transport by transportId
router.delete("/transports/:transportId", deleteTransport); // Delete a transport by transportId
router.put("/transports/:transportId", updateTransport); // Update a transport by transportId
router.get("/transports", getAllTransports); // Get all transports

module.exports = router;
