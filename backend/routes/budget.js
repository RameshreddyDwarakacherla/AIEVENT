import express from 'express';
import jwt from 'jsonwebtoken';
const router = express.Router();

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ success: false, message: 'No token provided' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// In-memory budget store (per event) - in production use a Budget model
const budgets = {};

// Get budget for an event
router.get('/event/:eventId', auth, async (req, res) => {
  try {
    const budget = budgets[req.params.eventId] || {
      eventId: req.params.eventId,
      totalBudget: 0,
      spent: 0,
      items: [],
      categories: {}
    };
    res.json({ success: true, data: budget });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update budget for an event
router.put('/event/:eventId', auth, async (req, res) => {
  try {
    budgets[req.params.eventId] = { ...req.body, eventId: req.params.eventId };
    res.json({ success: true, data: budgets[req.params.eventId] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add budget item
router.post('/event/:eventId/items', auth, async (req, res) => {
  try {
    if (!budgets[req.params.eventId]) {
      budgets[req.params.eventId] = { eventId: req.params.eventId, totalBudget: 0, spent: 0, items: [] };
    }
    const item = { ...req.body, id: Date.now().toString(), createdAt: new Date() };
    budgets[req.params.eventId].items.push(item);
    budgets[req.params.eventId].spent = budgets[req.params.eventId].items.reduce((s, i) => s + (i.amount || 0), 0);
    res.json({ success: true, data: budgets[req.params.eventId] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
