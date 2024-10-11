const mongoose = require('mongoose');

/**
 * title, body (problem) and date, status(pending/resolved/not started), comments, submitterid
 **/

const userComplaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'resolved', 'not started'],
    default: 'pending'
  },
  comments: {
    type: [String],
    default: []
  },
  submitterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const UserComplaint = mongoose.model('UserComplaint', userComplaintSchema);

module.exports = UserComplaint;