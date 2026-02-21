const express = require('express');
const router  = express.Router();
const Review  = require('../models/Review');
const User    = require('../models/User');

// ════════════════════════════════════════
// SUBMIT REVIEW — POST /review/submit
// Called after booking is completed
// User gives star rating + comment
// ════════════════════════════════════════
router.post('/submit', async (req, res) => {
  try {
    const { userId, providerId, bookingId, rating, comment } = req.body;

    // Check required fields
    if (!userId || !providerId || !bookingId || !rating) {
      return res.json({ success: false, message: 'All fields are required.' });
    }

    // Check rating is between 1 and 5
    if (rating < 1 || rating > 5) {
      return res.json({ success: false, message: 'Rating must be between 1 and 5.' });
    }

    // Check if user already reviewed this booking
    const existing = await Review.findOne({ bookingId });
    if (existing) {
      return res.json({ success: false, message: 'You already reviewed this booking.' });
    }

    // Save the review
    await Review.create({ userId, providerId, bookingId, rating, comment: comment || '' });

    // Recalculate provider's average rating
    const allReviews = await Review.find({ providerId });
    const avgRating  = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    // Update provider's rating in User collection
    await User.findByIdAndUpdate(providerId, {
      rating: parseFloat(avgRating.toFixed(1))
    });

    res.json({ success: true, message: 'Review submitted! Thank you.' });

  } catch (err) {
    res.json({ success: false, message: 'Server error: ' + err.message });
  }
});

// ════════════════════════════════════════
// GET ALL REVIEWS — GET /review/all/list
// Called by admin-dashboard.html for
// review monitoring
// (this route must be defined before the
// providerId param route to avoid conflicts)
// ════════════════════════════════════════
router.get('/all/list', async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('userId',     'name email')
      .populate('providerId', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, reviews });

  } catch (err) {
    res.json({ success: false, message: 'Server error: ' + err.message });
  }
});

// ════════════════════════════════════════
// GET PROVIDER REVIEWS — GET /review/:providerId
// Called by nearby_providers.html to show
// reviews and ratings on provider cards
// ════════════════════════════════════════
router.get('/:providerId', async (req, res) => {
  try {
    const reviews = await Review.find({ providerId: req.params.providerId })
      .populate('userId', 'name')   // get reviewer name
      .sort({ createdAt: -1 });     // newest first

    res.json({ success: true, reviews });

  } catch (err) {
    res.json({ success: false, message: 'Server error: ' + err.message });
  }
});


module.exports = router;
