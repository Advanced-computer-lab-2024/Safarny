const express = require("express");
const router = express.Router();
const updateTouristProfileById = require("../controllers/touristUpdateInfoController.js");

// Route to update tourist profile
router.put("/update/:id", updateTouristProfileById);

module.exports = router;
