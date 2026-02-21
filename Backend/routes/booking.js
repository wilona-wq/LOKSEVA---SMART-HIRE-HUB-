const express  = require('express');
const router   = express.Router();
const Booking  = require('../models/Booking');

// ════════════════════════════════════════
// CREATE BOOKING — POST /booking/create
// Called when user clicks "Confirm Booking"
// in nearby_providers.html
// ════════════════════════════════════════
router.post('/create', async (req, res) => {
  try {
    const { userId, providerId, service, date, timeSlot, address, note } = req.body;

    // Check all required fields
    if (!userId || !providerId || !service || !date || !timeSlot || !address) {
      return res.json({ success: false, message: 'All fields are required.' });
    }

    // Save booking to MongoDB
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
// Called by user-dashboard.html to show
// "My Recent Bookings" table
// ════════════════════════════════════════
router.get('/user/:userId', async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId })
      .populate('providerId', 'name email phone')  // get provider details
      .sort({ createdAt: -1 });                     // newest first

    res.json({ success: true, bookings });

  } catch (err) {
    res.json({ success: false, message: 'Server error: ' + err.message });
  }
});

// ════════════════════════════════════════
// GET PROVIDER BOOKINGS — GET /booking/provider/:providerId
// Called by provider-dashboard.html to show
// "New Booking Requests" table
// ════════════════════════════════════════
router.get('/provider/:providerId', async (req, res) => {
  try {
    const bookings = await Booking.find({ providerId: req.params.providerId })
      .populate('userId', 'name email phone')  // get user details
      .sort({ createdAt: -1 });                // newest first

    res.json({ success: true, bookings });

  } catch (err) {
    res.json({ success: false, message: 'Server error: ' + err.message });
  }
});

// ════════════════════════════════════════
// UPDATE BOOKING STATUS — PUT /booking/status/:bookingId
// Called when provider clicks Accept or Reject
// in provider-dashboard.html
// ════════════════════════════════════════
router.put('/status/:bookingId', async (req, res) => {
  try {
    const { status } = req.body;
    // status can be: 'accepted', 'rejected', 'completed'
    const allowed = ['accepted','rejected','completed'];
    if (!allowed.includes(status)) {
      return res.json({ success: false, message: 'Invalid status provided.' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.bookingId,
      { status },
      { new: true }   // return updated booking
    );

    if (!booking) {
      return res.json({ success: false, message: 'Booking not found.' });
    }

    res.json({ success: true, message: 'Booking status updated!', booking });

  } catch (err) {
    res.json({ success: false, message: 'Server error: ' + err.message });
  }
});

// ════════════════════════════════════════
// GET ALL BOOKINGS — GET /booking/all
// Called by admin-dashboard.html to show
// all bookings on the platform
// ════════════════════════════════════════
router.get('/all', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId',    'name email')
      .populate('providerId','name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });

  } catch (err) {
    res.json({ success: false, message: 'Server error: ' + err.message });
  }
});

module.exports = router;
