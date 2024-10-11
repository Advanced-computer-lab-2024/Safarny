const UserComplaint = require('../models/userComplaints');

// Create a new complaint
const createComplaint = async (req, res) => {
  try {
    const complaint = new UserComplaint(req.body);
    await complaint.save();
    res.status(201).json(complaint);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all complaints
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await UserComplaint.find();
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single complaint by ID
const getComplaintById = async (req, res) => {
  try {
    const complaint = await UserComplaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a complaint by ID
const updateComplaintById = async (req, res) => {
  try {
    console.log('Request Body:', req.body); // Print statement for req.body
    const complaint = await UserComplaint.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    res.status(200).json(complaint);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a complaint by ID
const deleteComplaintById = async (req, res) => {
  try {
    const complaint = await UserComplaint.findByIdAndDelete(req.params.id);
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    res.status(200).json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getComplaintsBySubmitterId = async (req, res) => {
  try {
    const complaints = await UserComplaint.find({ submitterId: req.params.submitterId });
    if (complaints.length === 0) {
      return res.status(404).json({ error: 'No complaints found for this submitter' });
    }
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaintById,
  deleteComplaintById,
    getComplaintsBySubmitterId
};