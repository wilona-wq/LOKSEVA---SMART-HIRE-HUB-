const express  = require('express');
const router   = express.Router();
const mongoose = require('mongoose');
const Booking  = require('../models/Booking');

// ════════════════════════════════════════
// CREATE BOOKING — POST /booking/create
// Called when user clicks "Confirm Booking"
// ════════════════════════════════════════
router.post('/create', async (req, res) => {
  try {
    const { providerId, service, date, timeSlot, address, note } = req.body;
    const userId = req.session.userId;           // ignore whatever the client sent

    if (!userId || !providerId || !service || !date || !timeSlot || !address) {
      return res.json({ success: false, message: 'All fields are required.' });
    }

    // basic mongoose ObjectId validation
    if (!mongoose.Types.ObjectId.isValid(providerId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.json({ success: false, message: 'Invalid user or provider ID.' });
    }

    const booking = await Booking.create({
      userId,
      providerId,
      service,
      date,
      timeSlot,
      address,
      note: note || '',
      status: 'pending'
    });

    res.json({ success: true, message: 'Booking created successfully!', booking });

  } catch (err) {
    res.json({ success: false, message: 'Server error: ' + err.message });
  }
});

// ════════════════════════════════════════
// GET USER BOOKINGS — GET /booking/user/:userId
// Called by user-dashboard to show bookings table
// ════════════════════════════════════════
router.get('/user/:userId', async (req, res) => {
  try {
    // only the same user or admin may view
    if (req.session.userId !== req.params.userId && req.session.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden.' });
    }

    const bookings = await Booking.find({ userId: req.params.userId })
      .populate('providerId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });

  } catch (err) {
    res.json({ success: false, message: 'Server error: ' + err.message });
  }
});

// ════════════════════════════════════════
// GET PROVIDER BOOKINGS — GET /booking/provider/:providerId
// Called by provider-dashboard to show requests
// ════════════════════════════════════════
router.get('/provider/:providerId', async (req, res) => {
  try {
    // only the provider themselves or admin may view
    if (req.session.userId !== req.params.providerId && req.session.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden.' });
    }

    const bookings = await Booking.find({ providerId: req.params.providerId })
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });

  } catch (err) {
    res.json({ success: false, message: 'Server error: ' + err.message });
  }
});

// ════════════════════════════════════════
// UPDATE BOOKING STATUS — PUT /booking/status/:bookingId
// Called when provider clicks Accept or Reject
// ════════════════════════════════════════
router.put('/status/:bookingId', async (req, res) => {
  try {
    const { status } = req.body;

    // ensure booking exists and user is the assigned provider
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res.json({ success: false, message: 'Booking not found.' });
    }
    if (booking.providerId.toString() !== req.session.userId) {
      return res.json({ success: false, message: 'Not authorized to change this booking.' });
    }

    booking.status = status;
    await booking.save();

    res.json({ success: true, message: 'Status updated!', booking });

  } catch (err) {
    res.json({ success: false, message: 'Server error: ' + err.message });
  }
});

// ════════════════════════════════════════
// MARK AS RATED — PUT /booking/rated/:bookingId
// Called after user submits star rating
// Marks isRated: true so Rate button
// changes to filled stars in the table
// ════════════════════════════════════════
router.put('/rated/:bookingId', async (req, res) => {
  try {
    const { userRating } = req.body;

    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res.json({ success: false, message: 'Booking not found.' });
    }
    if (booking.userId.toString() !== req.session.userId) {
      return res.json({ success: false, message: 'Not authorized.' });
    }

    booking.isRated    = true;       // hides Rate button
    booking.userRating = userRating; // saves star count (1-5)
    await booking.save();

    res.json({ success: true, booking });

  } catch (err) {
    res.json({ success: false, message: 'Server error: ' + err.message });
  }
});

// ════════════════════════════════════════
// GET ALL BOOKINGS — GET /booking/all
// Called by admin-dashboard
// ════════════════════════════════════════
router.get('/all', async (req, res) => {
  try {
    if (req.session.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden.' });
    }
    const bookings = await Booking.find()
      .populate('userId',     'name email')
      .populate('providerId', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });

  } catch (err) {
    res.json({ success: false, message: 'Server error: ' + err.message });
  }
});

module.exports = router;
