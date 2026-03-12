import express from 'express';
import Event from '../models/Event.js';
import { auth } from '../middleware/auth.js';
const router = express.Router();

// Get all events (admin) or user's events
router.get('/', auth, async (req, res) => {
  try {
    const { status, eventType, search } = req.query;
    const query = { userId: req.userId };
    if (status) query.status = status;
    if (eventType) query.eventType = eventType;
    if (search) query.title = { $regex: search, $options: 'i' };
    const events = await Event.find(query).sort({ startDate: 1 }).populate('userId', 'firstName lastName email');
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all events for admin
router.get('/all', auth, async (req, res) => {
  try {
    const { status, eventType, search } = req.query;
    const query = {};
    if (status) query.status = status;
    if (eventType) query.eventType = eventType;
    if (search) query.title = { $regex: search, $options: 'i' };
    const events = await Event.find(query).sort({ createdAt: -1 }).populate('userId', 'firstName lastName email');
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get stats for dashboard
router.get('/stats', auth, async (req, res) => {
  try {
    const now = new Date();
    const total = await Event.countDocuments({ userId: req.userId });
    const upcoming = await Event.countDocuments({ userId: req.userId, startDate: { $gt: now }, status: { $ne: 'cancelled' } });
    const completed = await Event.countDocuments({ userId: req.userId, status: 'completed' });
    const planning = await Event.countDocuments({ userId: req.userId, status: 'planning' });
    res.json({ success: true, data: { total, upcoming, completed, planning } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get admin stats
router.get('/admin-stats', auth, async (req, res) => {
  try {
    const now = new Date();
    const total = await Event.countDocuments();
    const active = await Event.countDocuments({ status: { $in: ['planning', 'confirmed'] } });
    const completed = await Event.countDocuments({ status: 'completed' });
    const thisMonth = await Event.countDocuments({ createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), 1) } });
    res.json({ success: true, data: { total, active, completed, thisMonth } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single event
router.get('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, userId: req.userId });
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create event
router.post('/', auth, async (req, res) => {
  try {
    const eventPayload = { ...req.body, userId: req.userId };
    const event = new Event(eventPayload);
    await event.save();
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update event
router.put('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete event
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
