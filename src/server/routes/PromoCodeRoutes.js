const express = require("express");
const {
  createPromoCode,
  getPromoCodeById,
  updatePromoCode,
  getAllPromoCodes,
  deletePromoCodeById,
} = require("../controllers/PromoCodeController.js");

const router = express.Router();

// Route for creating a promo code
router.post("/promocodes", createPromoCode);

// Route for getting all promo codes
router.get("/promocodes", getAllPromoCodes);

// Route for getting a promo code by ID
router.get("/promocodes/:id", getPromoCodeById);

// Route for updating a promo code by ID
router.put("/promocodes/:id", updatePromoCode);

router.delete("/promocodes/:id", deletePromoCodeById); // Added this route

module.exports = router;
