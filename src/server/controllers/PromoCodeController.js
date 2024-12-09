const PromoCode = require("../models/PromoCode.js");
const axios = require("axios");


const createPromoCode = async (req, res) => {
  try {
    const { discountPercentage, activated, createdBy, code, expiryDate } = req.body;

    const newPromoCode = new PromoCode({
      discountPercentage,
      activated,
      createdBy,
      code,
      expiryDate,
    });

    const savedPromoCode = await newPromoCode.save();
    
    res.status(201).json({
      message: "Promo code created successfully",
      promoCode: savedPromoCode,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getPromoCodeById = async (req, res) => {
  try {
    const promoCodeId = req.params.id;
    const promoCode = await PromoCode.findById(promoCodeId);

    if (!promoCode) {
      return res.status(404).json({ message: "Promo code not found" });
    }

    res.status(200).json(promoCode);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updatePromoCode = async (req, res) => {
  try {
    const promoCodeId = req.params.id.trim();
    const { discountPercentage, activated, code, expiryDate } = req.body;

    const updatedPromoCode = await PromoCode.findByIdAndUpdate(
      promoCodeId,
      { discountPercentage, activated, code, expiryDate },
      { new: true, runValidators: true }
    );

    if (!updatedPromoCode) {
      return res.status(404).json({ message: "Promo code not found" });
    }

    res.status(200).json({
      message: "Promo code updated successfully",
      promoCode: updatedPromoCode,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllPromoCodes = async (req, res) => {
  try {
    const promoCodes = await PromoCode.find();
    res.status(200).json(promoCodes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const deletePromoCodeById = async (req, res) => {
  try {
    const promoCodeId = req.params.id;

    const deletedPromoCode = await PromoCode.findByIdAndDelete(promoCodeId);

    if (!deletedPromoCode) {
      return res.status(404).json({ message: "Promo code not found" });
    }

    res.status(200).json({
      message: "Promo code deleted successfully",
      promoCode: deletedPromoCode,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createPromoCode,
  getPromoCodeById,
  updatePromoCode,
  getAllPromoCodes,
  deletePromoCodeById,
};
