import express from 'express';
import Task from '../models/Task.js';
import { auth } from '../middleware/auth.js';
const router = express.Router();

// Get tasks for an event
router.get('/event/:eventId', auth, async (req, res) => {
  try {
    const { status, priority } = req.query;
    const query = { eventId: req.params.eventId, userId: req.userId };
    if (status) query.status = status;
    if (priority) query.priority = priority;
    const tasks = await Task.find(query).sort({ dueDate: 1, priority: -1 });
    res.json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all user's tasks
router.get('/', auth, async (req, res) => {
  try {
    const { status } = req.query;
    const query = { userId: req.userId };
    if (status) query.status = status;
    const tasks = await Task.find(query).sort({ dueDate: 1 }).populate('eventId', 'title');
    res.json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create task
router.post('/', auth, async (req, res) => {
  try {
    const task = new Task({ ...req.body, userId: req.userId });
    await task.save();
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update task status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const update = { status };
    if (status === 'completed') update.completedAt = new Date();
    const task = await Task.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update task
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
