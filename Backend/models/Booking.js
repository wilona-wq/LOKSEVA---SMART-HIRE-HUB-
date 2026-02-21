const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  service: {
    type: String,
    required: true
    // e.g. "Electrician", "Plumber", "Cleaner"
  },

  date: {
    type: String,
    required: true
    // e.g. "2026-02-21"
  },

  timeSlot: {
    type: String,
    required: true
    // e.g. "10:00 AM - 12:00 PM"
  },

  address: {
    type: String,
    required: true
    // user's address for the job
  },

  note: {
    type: String,
    default: ''
    // optional problem description
  },

  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed'],
    default: 'pending'
    // pending  → provider not yet responded
    // accepted → provider accepted
    // rejected → provider rejected
    // completed → job done
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model('Booking', bookingSchema);
