const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
    // the user who gave the review
  },

  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
    // the provider who received the review
  },

  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
    // which booking this review is for
  },

  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
    // star rating: 1 to 5
  },

  comment: {
    type: String,
    default: ''
    // optional written review
    // e.g. "Great work, very professional!"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model('Review', reviewSchema);

app.use('/booking', require('./routes/booking'));
app.use('/review',  require('./routes/review'));
app.use('/auth', require('./routes/auth'));
