import express from 'express';
import Review from '../models/Review.js';
import Vendor from '../models/Vendor.js';
import { auth } from '../middleware/auth.js';
const router = express.Router();

// Get reviews for a vendor
router.get('/vendor/:vendorId', async (req, res) => {
  try {
    const reviews = await Review.find({ vendorId: req.params.vendorId })
      .sort({ createdAt: -1 })
      .populate('userId', 'firstName lastName avatarUrl');
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get my reviews (vendor)
router.get('/my-vendor-reviews', auth, async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.userId });
    if (!vendor) return res.json({ success: true, data: [] });
    const reviews = await Review.find({ vendorId: vendor._id })
      .sort({ createdAt: -1 })
      .populate('userId', 'firstName lastName avatarUrl');
    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create review
router.post('/', auth, async (req, res) => {
  try {
    const review = new Review({ ...req.body, userId: req.userId });
    await review.save();

    // Update vendor's avg rating
    const allReviews = await Review.find({ vendorId: req.body.vendorId });
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await Vendor.findByIdAndUpdate(req.body.vendorId, { avgRating: avg, totalReviews: allReviews.length });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add vendor reply to review
router.put('/:id/reply', auth, async (req, res) => {
  try {
    const { vendorReply } = req.body;
    const review = await Review.findByIdAndUpdate(req.params.id, { vendorReply }, { new: true });
    res.json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
