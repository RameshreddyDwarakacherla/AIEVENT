import express from 'express';
import Guest from '../models/Guest.js';
import { auth } from '../middleware/auth.js';
const router = express.Router();

// Get guests for an event
router.get('/event/:eventId', auth, async (req, res) => {
  try {
    const { rsvpStatus, group } = req.query;
    const query = { eventId: req.params.eventId, userId: req.userId };
    if (rsvpStatus) query.rsvpStatus = rsvpStatus;
    if (group) query.group = group;
    const guests = await Guest.find(query).sort({ name: 1 });
    const stats = {
      total: await Guest.countDocuments({ eventId: req.params.eventId }),
      confirmed: await Guest.countDocuments({ eventId: req.params.eventId, rsvpStatus: 'confirmed' }),
      declined: await Guest.countDocuments({ eventId: req.params.eventId, rsvpStatus: 'declined' }),
      pending: await Guest.countDocuments({ eventId: req.params.eventId, rsvpStatus: 'invited' }),
    };
    res.json({ success: true, data: guests, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all user's guests
router.get('/', auth, async (req, res) => {
  try {
    const guests = await Guest.find({ userId: req.userId }).populate('eventId', 'title startDate');
    res.json({ success: true, data: guests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create guest
router.post('/', auth, async (req, res) => {
  try {
    const guest = new Guest({ ...req.body, userId: req.userId });
    await guest.save();
    res.status(201).json({ success: true, data: guest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Bulk add guests
router.post('/bulk', auth, async (req, res) => {
  try {
    const { guests, eventId } = req.body;
    const guestsWithUser = guests.map(g => ({ ...g, userId: req.userId, eventId }));
    const created = await Guest.insertMany(guestsWithUser);
    res.status(201).json({ success: true, data: created });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update guest RSVP
router.put('/:id/rsvp', auth, async (req, res) => {
  try {
    const { rsvpStatus } = req.body;
    const guest = await Guest.findByIdAndUpdate(req.params.id, { rsvpStatus }, { new: true });
    if (!guest) return res.status(404).json({ success: false, message: 'Guest not found' });
    res.json({ success: true, data: guest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update guest
router.put('/:id', auth, async (req, res) => {
  try {
    const guest = await Guest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!guest) return res.status(404).json({ success: false, message: 'Guest not found' });
    res.json({ success: true, data: guest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete guest
router.delete('/:id', auth, async (req, res) => {
  try {
    const guest = await Guest.findByIdAndDelete(req.params.id);
    if (!guest) return res.status(404).json({ success: false, message: 'Guest not found' });
    res.json({ success: true, message: 'Guest deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
