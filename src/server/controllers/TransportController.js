const Transport = require('../models/Transport');
const User = require('../models/userModel');

// Create a new transport
const  createTransport = async (req, res) => {
  try {
    console.log(req.body);
    const { departureDate, departureTime, arrivalDate, arrivalTime, typeOfTransportation, location, advertiserId, tourists } = req.body;

    // Find the advertiser's name using the advertiserId
    const advertiser = await User.findById(advertiserId._id);
    if (!advertiser) {
      return res.status(404).json({ message: 'Advertiser not found' });
    }

    // Calculate number of tourists
    const numberOfTourists = tourists.length;

    // Create a new transport
    const newTransport = new Transport({
      departureDate,
      departureTime,
      arrivalDate,
      arrivalTime,
      typeOfTransportation,
      location,
      advertiserId,
      advertiserName: advertiser.username,
      tourists,
      numberOfTourists
    });

    await newTransport.save();
    res.status(201).json({ message: 'Transport created successfully', transport: newTransport });
  } catch (error) {
    res.status(500).json({ message: 'Error creating transport', error });
  }
};

// Delete a transport by transportId
const deleteTransport = async (req, res) => {
  try {
    const { transportId } = req.params;

    const deletedTransport = await Transport.findByIdAndDelete(transportId);
    if (!deletedTransport) {
      return res.status(404).json({ message: 'Transport not found' });
    }

    res.status(200).json({ message: 'Transport deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting transport', error });
  }
};

// Update a transport by transportId
const updateTransport = async (req, res) => {
  try {
    const { transportId } = req.params;
    const updatedData = req.body;

    // If tourists array is updated, recalculate the number of tourists
    if (updatedData.tourists) {
      updatedData.numberOfTourists = updatedData.tourists.length;
    }

    // If the advertiserId is updated, get the new advertiser's name
    if (updatedData.advertiserId) {
      const advertiser = await User.findById(updatedData.advertiserId);
      if (!advertiser) {
        return res.status(404).json({ message: 'Advertiser not found' });
      }
      updatedData.advertiserName = advertiser.username;
    }

    const updatedTransport = await Transport.findByIdAndUpdate(transportId, updatedData, { new: true });
    if (!updatedTransport) {
      return res.status(404).json({ message: 'Transport not found' });
    }

    res.status(200).json({ message: 'Transport updated successfully', transport: updatedTransport });
  } catch (error) {
    res.status(500).json({ message: 'Error updating transport', error });
  }
};

// Update transports by advertiserId
const updateTransportsByAdvertiserId = async (req, res) => {
  try {
    const { advertiserId } = req.params;
    const updatedData = req.body;

    // Check if advertiser exists
    const advertiser = await User.findById(advertiserId);
    if (!advertiser) {
      return res.status(404).json({ message: 'Advertiser not found' });
    }

    // If tourists array is updated, recalculate the number of tourists
    if (updatedData.tourists) {
      updatedData.numberOfTourists = updatedData.tourists.length;
    }

    // Update all transports for the specific advertiser
    const updatedTransports = await Transport.updateMany(
      { advertiserId },
      updatedData,
      { new: true }
    );

    if (updatedTransports.modifiedCount === 0) {
      return res.status(404).json({ message: 'No transports found for this advertiser' });
    }

    res.status(200).json({ message: 'Transports updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating transports by advertiser', error });
  }
 
};
 // Get all transports
 const getAllTransports = async (req, res) => {
    try {
      const transports = await Transport.find();
      res.status(200).json(transports);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching transports', error });
    }
  };
  
  // Get a single transport by transportId
const getTransportById = async (req, res) => {
    try {
      const { transportId } = req.params;
      const transport = await Transport.findById(transportId);
  
      if (!transport) {
        return res.status(404).json({ message: 'Transport not found' });
      }
  
      res.status(200).json(transport);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching transport', error });
    }
  };
  
  // Get transports by advertiserId
const getTransportsByAdvertiserId = async (req, res) => {
    try {
      const { advertiserId } = req.params;
      const transports = await Transport.find({ advertiserId });
  
      if (transports.length === 0) {
        return res.status(404).json({ message: 'No transports found for this advertiser' });
      }
  
      res.status(200).json(transports);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching transports by advertiser', error });
    }
  };
  
module.exports = {
    createTransport,
    deleteTransport,
    updateTransport,
    updateTransportsByAdvertiserId,
    getAllTransports,
    getTransportById,
    getTransportsByAdvertiserId
  };
