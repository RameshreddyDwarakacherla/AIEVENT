import express from 'express';
import Booking from '../models/Booking.js';
import Vendor from '../models/Vendor.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get booking stats for the logged-in user
router.get('/stats', auth, async (req, res) => {
  try {
    const total = await Booking.countDocuments({ userId: req.userId });
    const confirmed = await Booking.countDocuments({ userId: req.userId, status: 'confirmed' });
    const pending = await Booking.countDocuments({ userId: req.userId, status: 'pending' });
    const cancelled = await Booking.countDocuments({ userId: req.userId, status: { $in: ['cancelled', 'rejected'] } });
    res.json({ success: true, data: { total, confirmed, pending, cancelled } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get user's bookings
router.get('/', auth, async (req, res) => {
  try {
    const { status, eventId } = req.query;
    const query = { userId: req.userId };
    if (status) query.status = status;
    if (eventId) query.eventId = eventId;
    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .populate('eventId', 'title startDate')
      .populate({ path: 'vendorId', select: 'companyName vendorType userId', populate: { path: 'userId', select: 'firstName lastName email avatarUrl' } });
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get vendor's bookings (by vendorId linked to currentUser)
router.get('/vendor', auth, async (req, res) => {
  try {
    const { status } = req.query;

    // Find vendor profile linked to this user
    const vendor = await Vendor.findOne({ userId: req.userId });
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor profile not found' });

    const query = { vendorId: vendor._id };
    if (status) query.status = status;

    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .populate('eventId', 'title startDate location')
      .populate('userId', 'firstName lastName email');
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get admin booking stats
router.get('/admin-stats', auth, async (req, res) => {
  try {
    const total = await Booking.countDocuments();
    const confirmed = await Booking.countDocuments({ status: 'confirmed' });
    const pending = await Booking.countDocuments({ status: 'pending' });
    const revenue = await Booking.aggregate([
      { $match: { status: 'confirmed', paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    res.json({ success: true, data: { total, confirmed, pending, revenue: revenue[0]?.total || 0 } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single booking
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('eventId', 'title startDate location')
      .populate('vendorId', 'companyName vendorType')
      .populate('userId', 'firstName lastName email');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create booking
router.post('/', auth, async (req, res) => {
  try {
    const booking = new Booking({ ...req.body, userId: req.userId });
    await booking.save();
    await booking.populate('vendorId', 'companyName vendorType');
    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update booking status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status, vendorResponse } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status, vendorResponse },
      { new: true }
    );
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update booking
router.put('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete booking
router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
