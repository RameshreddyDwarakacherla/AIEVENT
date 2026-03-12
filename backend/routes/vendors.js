import express from 'express';
import Vendor from '../models/Vendor.js';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';
const router = express.Router();

// Get all vendors (public + filtered)
router.get('/', async (req, res) => {
  try {
    const { vendorType, city, search, verified, minRating } = req.query;
    const query = {};
    if (vendorType) query.vendorType = vendorType;
    if (city) query.city = { $regex: city, $options: 'i' };
    if (verified === 'true') query.isVerified = true;
    if (minRating) query.avgRating = { $gte: parseFloat(minRating) };
    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { vendorType: { $regex: search, $options: 'i' } }
      ];
    }
    const vendors = await Vendor.find(query)
      .sort({ avgRating: -1, isVerified: -1 })
      .populate('userId', 'firstName lastName email phone');
    res.json({ success: true, data: vendors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get pending vendors (admin)
router.get('/pending', auth, async (req, res) => {
  try {
    const vendors = await Vendor.find({ isVerified: false })
      .sort({ createdAt: -1 })
      .populate('userId', 'firstName lastName email');
    res.json({ success: true, data: vendors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get admin stats
router.get('/admin-stats', auth, async (req, res) => {
  try {
    const total = await Vendor.countDocuments();
    const verified = await Vendor.countDocuments({ isVerified: true });
    const pending = await Vendor.countDocuments({ isVerified: false });
    res.json({ success: true, data: { total, verified, pending } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get vendor by id
router.get('/:id', async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id).populate('userId', 'firstName lastName email phone');
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });
    res.json({ success: true, data: vendor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get vendor profile for logged-in vendor
router.get('/profile/me', auth, async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.userId }).populate('userId', 'firstName lastName email phone');
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor profile not found' });
    res.json({ success: true, data: vendor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create/update vendor profile
router.post('/profile', auth, async (req, res) => {
  try {
    let vendor = await Vendor.findOne({ userId: req.userId });
    if (vendor) {
      vendor = await Vendor.findOneAndUpdate({ userId: req.userId }, { $set: req.body }, { new: true });
    } else {
      vendor = new Vendor({ 
        companyName: req.body.companyName || 'My Vendor Business',
        vendorType: req.body.vendorType || 'General',
        ...req.body, 
        userId: req.userId 
      });
      await vendor.save();
    }
    res.json({ success: true, data: vendor });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Verify vendor (admin only)
router.put('/:id/verify', auth, async (req, res) => {
  try {
    const { isVerified } = req.body;
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, { isVerified }, { new: true });
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });
    res.json({ success: true, data: vendor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update vendor
router.put('/:id', auth, async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });
    res.json({ success: true, data: vendor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete vendor
router.delete('/:id', auth, async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });
    res.json({ success: true, message: 'Vendor deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
