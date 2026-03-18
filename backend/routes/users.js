import express from 'express';
import User from '../models/User.js';
import { auth, adminOnly } from '../middleware/auth.js';
const router = express.Router();

// Get all users (admin)
router.get('/', auth, async (req, res) => {
  try {
    const { role, search, isActive } = req.query;
    const query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    const users = await User.find(query).sort({ createdAt: -1 }).select('-password');
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get user stats (admin)
router.get('/stats', auth, async (req, res) => {
  try {
    const now = new Date();
    const total = await User.countDocuments();
    const vendors = await User.countDocuments({ role: 'vendor' });
    const admins = await User.countDocuments({ role: 'admin' });
    const regular = await User.countDocuments({ role: 'user' });
    const thisMonth = await User.countDocuments({ createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), 1) } });
    res.json({ success: true, data: { total, vendors, admins, regular, thisMonth } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get current user's profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update current user's profile
router.put('/me', auth, async (req, res) => {
  try {
    const { password, role, ...updates } = req.body; // Prevent role/password change here
    const user = await User.findByIdAndUpdate(req.userId, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update user (admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete user (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
