const Itinerary = require("../models/Itinerary.js");
const Tag = require("../models/Tags.js");
const User = require("../models/userModel.js");
const Booking = require("../models/Booking.js");
const axios = require("axios"); // Ensure axios is installed: npm install axios

const createItinerary = async (req, res) => {
  try {
    const {
      name,
      activities,
      locations,
      timeline,
      duration,
      language,
      price,
      currency,
      availableDates,
      availableTimes,
      accessibility,
      pickupLocation,
      dropoffLocation,
      tagNames,
      createdby,
      bookingOpen
    } = req.body;
    console.log(req.body);

    let tagsId = [];

    for (let tagName of tagNames) {
      let tag = await Tag.findOne({ name: tagName });

      if (!tag) {
        return res.status(400).send({ error: `Tag ${tagName} does not exist` });
      }
      tagsId.push(tag._id);
    }

    if (User.findOne({ _id: createdby }) === null) {
      return res
        .status(400)
        .send({ error: `User with id: ${createdby} does not exist` });
    }

    const itinerary = new Itinerary({
      name,
      activities,
      locations,
      timeline,
      duration,
      language,
      price,
      currency,
      availableDates,
      availableTimes,
      accessibility,
      pickupLocation,
      dropoffLocation,
      createdby,
      bookingOpen,
      tags: tagsId,
    });

    await itinerary.save();
    res.status(201).send(itinerary);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const getAllItineraries = async (_, res) => {
  try {
    const itineraries = await Itinerary.find().populate("tags");
    res.status(200).send({ message: "Success", data: itineraries });
  } catch (error) {
    res.status(500).send(error);
  }
};

const getItineraryById = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id).populate("tags","name").populate("activities","location");
    if (!itinerary) {
      return res.status(404).send();
    }
    res.status(200).send(itinerary);
  } catch (error) {
    res.status(500).send(error);
  }
};
const updateItineraryById = async (req, res) => {
  const itinerary = await Itinerary.findById(req.params.id);

  if (itinerary) {
    itinerary.name = req.body.name || itinerary.name;
    itinerary.activities = req.body.activities || itinerary.activities;
    itinerary.locations = req.body.locations || itinerary.locations;
    itinerary.timeline = req.body.timeline || itinerary.timeline;
    itinerary.duration = req.body.duration || itinerary.duration;
    itinerary.language = req.body.language || itinerary.language;
    itinerary.price = req.body.price || itinerary.price;
    itinerary.currency = req.body.currency || itinerary.currency;
    itinerary.availableDates = req.body.availableDates || itinerary.availableDates;
    itinerary.availableTimes = req.body.availableTimes || itinerary.availableTimes;
    itinerary.accessibility = req.body.accessibility || itinerary.accessibility;
    itinerary.pickupLocation = req.body.pickupLocation || itinerary.pickupLocation;
    itinerary.dropoffLocation = req.body.dropoffLocation || itinerary.dropoffLocation;
    itinerary.createdby = req.body.createdby || itinerary.createdby;
    itinerary.bookingOpen = req.body.bookingOpen || itinerary.bookingOpen;
    // Add the new rating to the ratings array
    console.log(req.body);
    if (req.body.rating) {
      itinerary.rating.push(req.body.rating);

      // Calculate the new average rating
      const totalRatings = itinerary.rating.length;
      const sumRatings = itinerary.rating.reduce((sum, rate) => sum + rate, 0);
      const averageRating = sumRatings / totalRatings;

      // Update the itinerary with the new average rating
      itinerary.averageRating = averageRating;
    }

    // Optionally update archived value
    if (typeof req.body.archived !== 'undefined') {
      itinerary.archived = req.body.archived;
    }

    if (req.body.tagNames) {
      let tagsId = [];
      for (let tagName of req.body.tagNames) {
        let tag = await Tag.findOne({ name: tagName });
        if (!tag) {
          return res.status(400).send({ error: `Tag ${tagName} does not exist` });
        }
        tagsId.push(tag._id);
      }
      itinerary.tags = tagsId;
    }

    const updatedItinerary = await itinerary.save();
    res.json(updatedItinerary);
  } else {
    res.status(404).json({ message: "Itinerary not found" });
  }
};
const deleteItineraryById = async (req, res) => {
  try {
    const itinerary = await Itinerary.findByIdAndDelete(req.params.id);
    console.log(itinerary);
    console.log(req.params.id);
    console.log(req.params.itineraryId);

    if (!itinerary) {
      return res.status(404).send();
    }

    res.status(200).send(itinerary);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateItineraryTagById = async (req, res) => {
  const { tags } = req.body;

  if (!Array.isArray(tags)) {
    return res.status(400).send({ error: "Tags must be an array of strings" });
  }

  try {
    const itinerary = await Itinerary.findById(req.params.id);
    if (!itinerary) {
      return res.status(404).send();
    }
    itinerary.tags = tags;
    await itinerary.save();
    res.status(200).send(itinerary);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getItinerariesSorted = async (req, res) => {
  const { sortBy } = req.query;
  const sortCriteria = {};

  if (sortBy) {
    const [field, order] = sortBy.split(":");
    if (field === "date") {
      sortCriteria["availableDates"] = order === "desc" ? -1 : 1;
    } else {
      sortCriteria[field] = order === "desc" ? -1 : 1;
    }
  }

  try {
    const itineraries = await Itinerary.find({ accessibility: "yes" }) // Filter by accessibility
      .populate("tags", "name")
      .populate("activities")
      .sort(sortCriteria);
    res.status(200).send(itineraries);
  } catch (error) {
    res.status(500).send(error);
  }
};


const getItineraryRevenue = async (req, res) => {
  try {
    // Fetch exchange rates from an external API
    const apiUrl = "https://api.exchangerate-api.com/v4/latest/USD"; // Replace with your preferred API
    const { data } = await axios.get(apiUrl);

    if (!data || !data.rates) {
      return res.status(500).json({ error: "Failed to fetch exchange rates" });
    }

    const exchangeRates = data.rates; // Get rates for all currencies

    // Fetch all itineraries
    const itineraries = await Itinerary.find();

    // Calculate revenue for each itinerary in USD
    const totalRevenueUSD = itineraries.reduce((total, itinerary) => {
      const { price, currency, boughtby } = itinerary;
      const rate = exchangeRates[currency] || 1; // Use 1 if currency is missing or not found
      const priceInUSD = price / rate; // Convert price to USD
      const revenue = priceInUSD * (boughtby?.length || 0); // Revenue = priceInUSD * number of buyers
      return total + revenue; // Accumulate the revenue
    }, 0);

    // Apply commission (e.g., 10%)
    const totalRevenueWithCommission = totalRevenueUSD * 0.1;

    // Return the total revenue
    res.status(200).json({ totalRevenue: totalRevenueWithCommission });
  } catch (error) {
    console.error("Error calculating itinerary revenue:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};




const getItinerariesFiltered = async (req, res) => {
  const { price, currency, date, tags, language } = req.query;

  const maxPrice = price ? Number(price) : Infinity;
  try {
    const itineraries = await Itinerary.find()
      .populate("tags", "name")
      .populate("activities");

    const filteredItineraries = itineraries.filter((itinerary) => {
      let match = false;

      if (maxPrice > 0 && itinerary.price <= maxPrice) {
        match = true;
      }
      if (currency && itinerary.currency === currency) {
        match = true;
      }
      // Check if date matches
      if (date && itinerary.availableDates.includes(date)) {
        match = true;
      }

      if (tags) {
        const tagsArray = tags.split(",");
        if (itinerary.tags && itinerary.tags.length > 0) {
          const tagMatch = itinerary.tags.some((tag) =>
            tagsArray.includes(tag.name)
          );
          if (tagMatch) {
            match = true;
          }
        }
      }

      if (
        language &&
        itinerary.language.toLowerCase().includes(language.toLowerCase())
      ) {
        match = true;
      }

      return match;
    });

    res.status(200).send(filteredItineraries);
  } catch (error) {
    console.error("Error fetching filtered itineraries:", error);
    res.status(500).send(error);
  }
};


const geItinerariesFor = async (req, res) => {
  const itineraries = await Itinerary.find({
    createdby: req.params.tourguideId,
  })
    .populate("tags", "name")
    .populate("activities", "location");

  res.status(200).json(itineraries);
};

//updaterating
const updateRating = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);
    if (!itinerary) {
      return res.status(404).send();
    }

    // Add the new rating to the ratings array
    itinerary.rating.push(req.body.rating);

    // Calculate the new average rating
    const totalRatings = itinerary.rating.length;
    const sumRatings = itinerary.rating.reduce((sum, rate) => sum + rate, 0);
    const averageRating = sumRatings / totalRatings;

    // Update the itinerary with the new average rating
    itinerary.averageRating = averageRating;
    await itinerary.save();

    res.status(200).send(itinerary);
  } catch (error) {
    res.status(400).send(error);
  }
};

const getBoughtCountByItinerary = async (req, res) => {
  const { id } = req.params; // Get activity ID from request parameters

  try {
      // Find the activity by its ID and only project the `boughtby` field
      const itinerary = await Itinerary.findById(id).select('boughtby');

      if (!itinerary) {
          return res.status(404).json({ message: 'itinerary not found' });
      }

      // Return the length of the `boughtby` array
      res.status(200).json({ boughtCount: itinerary.boughtby.length });
  } catch (error) {
      console.error('Error fetching bought count:', error);
      res.status(500).json({ message: 'An error occurred', error });
  }
};


const getTouristsByItineraryAndDate = async (req, res) => {
  try {
    const { id } = req.params; // Tour Guide ID
    const { month, year } = req.query; // Optional month and year filters

    // Step 1: Match itineraries created by the tour guide
    const itineraries = await Itinerary.find({ createdby: id }).select("_id");
    const itineraryIds = itineraries.map((itinerary) => itinerary._id);

    // Step 2: Build dynamic match conditions
    const matchConditions = {
      itinerary: { $in: itineraryIds },
      status: { $in: ["confirmed", "active"] }, // Only include confirmed or active bookings
    };

    if (month || year) {
      matchConditions.$expr = {
        $and: [],
      };

      if (month) {
        matchConditions.$expr.$and.push({
          $eq: [{ $month: { $dateFromString: { dateString: "$bookingDate" } } }, parseInt(month)],
        });
      }
      if (year) {
        matchConditions.$expr.$and.push({
          $eq: [{ $year: { $dateFromString: { dateString: "$bookingDate" } } }, parseInt(year)],
        });
      }
    }

    // Step 3: Aggregate bookings
    const result = await Booking.aggregate([
      { $match: matchConditions }, // Match based on dynamic conditions
      {
        $group: {
          _id: "$itinerary", // Group by itinerary
          totalTourists: { $sum: 1 }, // Count the number of tourists
        },
      },
    ]);

    res.status(200).json(result); // Return the result
  } catch (error) {
    console.error("Error filtering by itinerary and date:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};



module.exports = {
  createItinerary,
  getAllItineraries,
  getItineraryById,
  updateItineraryById,
  deleteItineraryById,
  updateItineraryTagById,
  getItinerariesSorted,
  getItinerariesFiltered,
  geItinerariesFor,
    updateRating,
    getItineraryRevenue,
    getBoughtCountByItinerary,
    getTouristsByItineraryAndDate
};
