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
  },

  note: {
    type: String,
    default: ''
  },

  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed'],
    default: 'pending'
  },

  // ── RATING FIELDS (NEW) ──
  isRated: {
    type: Boolean,
    default: false
    // false = Rate button shown
    // true  = Stars shown instead
  },

  userRating: {
    type: Number,
    default: 0
    // 1 to 5 stars given by user
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model('Booking', bookingSchema);
