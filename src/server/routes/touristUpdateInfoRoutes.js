import express from "express";
//const express = require('express');
const router = express.Router();
//const { updateTouristProfile, getTouristProfile } = require('../controllers/touristController');
//import  updateTouristProfile from '../controllers/touristUpdateInfoController.js';
import updateTouristProfileById from '../controllers/touristUpdateInfoController.js';
//import { updateTouristProfile } from "../controllers/touristUpdateInfoController";
// Route to update tourist profile
router.put('/update/:id', updateTouristProfileById);

//module.exports = router;
export default router;

