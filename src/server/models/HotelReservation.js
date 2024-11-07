const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hotelReservationSchema = new Schema({
    hotelid: String,
    touristid: String,
    hotelName: String,
    checkInDate: Date,
    checkOutDate: Date,
    adults: Number,
    roomType: String,
    Price: Number,
    // hotelAddress: String,
    // hotelContact: String,
    // hotelEmail: String,
    // hotelWebsite: String,
    // hotelRating: Number,
    // hotelAmenities: [String],
    // hotelServices: [String],
    // hotelRules: [String],
    // hotelImages: [String],
    hotelDistancefromCenter: Number,
    hotelDescription: String,
    // hotelLocation: {
    //     type: {
    //     type: String,
    //     enum: ["Point"],
    //     required: true,
    //     },
    //     coordinates: {
    //     type: [Number],
    //     required: true,
    //     },
    // },
    // createdAt: {
    //     type: Date,
    //     default: Date.now,
    // },
    // updatedAt: {
    //     type: Date,
    //     default: Date.now,
    // },


});
const HotelReservation = mongoose.model("HotelReservation", hotelReservationSchema);
module.exports=HotelReservation;