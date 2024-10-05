const mongoose = require("mongoose");

const Activity = require("../models/Activity");
const Itinerary = require("../models/Itinerary");
const HistoricalPlaces = require("../models/historicalplaces");

const searchController = {
  search: async (req, res) => {
    const { query, type } = req.query; // Get the search query and type from the request
    try {
      let results = {
        historicalPlaces: [],
        activities: [],
        itineraries: [],
      };

      // Check which type of search to perform
      if (!query) {
        return res
          .status(400)
          .json({ success: false, message: "Query parameter is required" });
      }

      // Search for historical places
      if (type === "historical") {
        results.historicalPlaces = await HistoricalPlaces.find({
          description: { $regex: query, $options: "i" },
        });
      } else if (type === "activity") {
        let activities = await Activity.find()
          .populate("category", "type")
          .populate("tags", "name");

        activities = activities.filter(
          (activity) =>
            (activity.category &&
              activity.category.some((cat) =>
                cat.type.match(new RegExp(query, "i"))
              )) ||
            (activity.tags &&
              activity.tags.some((tag) =>
                tag.name.match(new RegExp(query, "i"))
              ))
        );
        results.activities = activities;
      } 
      
      else if (type === "itinerary") {
        let itineraries = await Itinerary.find().populate("tags", "name");
        itineraries = itineraries.filter(
          (itinerary) =>
            itinerary.name.match(new RegExp(query, "i")) ||
            (itinerary.category &&
              itinerary.category.some((cat) =>
                cat.match(new RegExp(query, "i"))
              )) ||
            (itinerary.tags &&
              itinerary.tags.some((tag) =>
                tag.name.match(new RegExp(query, "i"))
              )) ||
            (itinerary.category && itinerary.category.includes(query))
        );

        results.itineraries = itineraries;
      }

      // Return all results
      return res.status(200).json({
        success: true,
        results,
      });
    } catch (error) {
      console.error("Server error:", error); // Log error for debugging
      return res.status(500).json({
        success: false,
        message: "Not Found",
        error: error.message,
      });
    }
  },
};

module.exports = searchController;
