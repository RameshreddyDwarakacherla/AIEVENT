import express from 'express';
import { auth } from '../middleware/auth.js';
import Budget from '../models/Budget.js';
import Event from '../models/Event.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Get budget for an event
router.get('/event/:eventId', auth, async (req, res) => {
  try {
    const { eventId } = req.params;

    // Verify event exists and user has access
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    if (event.userId.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    let budget = await Budget.findOne({ eventId }).populate('items.vendor', 'companyName');
    
    // Create default budget if doesn't exist
    if (!budget) {
      budget = new Budget({
        eventId,
        userId: req.userId,
        totalBudget: event.budget || 0,
        items: []
      });
      await budget.save();
    }

    res.json({ success: true, data: budget });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create or update budget
router.put('/event/:eventId', auth, [
  body('totalBudget').isNumeric().withMessage('Total budget must be a number'),
  body('currency').optional().isIn(['USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { eventId } = req.params;
    const { totalBudget, currency, notes } = req.body;

    // Verify event exists and user has access
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    if (event.userId.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    let budget = await Budget.findOne({ eventId });
    
    if (budget) {
      budget.totalBudget = totalBudget;
      if (currency) budget.currency = currency;
      if (notes !== undefined) budget.notes = notes;
    } else {
      budget = new Budget({
        eventId,
        userId: req.userId,
        totalBudget,
        currency: currency || 'USD',
        notes
      });
    }

    await budget.save();
    res.json({ success: true, data: budget });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add budget item
router.post('/event/:eventId/items', auth, [
  body('category').isIn(['Venue', 'Catering', 'Decoration', 'Entertainment', 'Photography', 'Transportation', 'Miscellaneous', 'Other']),
  body('description').trim().notEmpty(),
  body('allocatedAmount').isNumeric().isFloat({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { eventId } = req.params;
    const itemData = req.body;

    let budget = await Budget.findOne({ eventId });
    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found. Create budget first.' });
    }

    if (budget.userId.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    budget.items.push(itemData);
    await budget.save();

    res.json({ success: true, data: budget });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update budget item
router.put('/event/:eventId/items/:itemId', auth, async (req, res) => {
  try {
    const { eventId, itemId } = req.params;
    const updates = req.body;

    const budget = await Budget.findOne({ eventId });
    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }

    if (budget.userId.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const item = budget.items.id(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Budget item not found' });
    }

    Object.assign(item, updates);
    await budget.save();

    res.json({ success: true, data: budget });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete budget item
router.delete('/event/:eventId/items/:itemId', auth, async (req, res) => {
  try {
    const { eventId, itemId } = req.params;

    const budget = await Budget.findOne({ eventId });
    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }

    if (budget.userId.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    budget.items.pull(itemId);
    await budget.save();

    res.json({ success: true, data: budget });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get budget alerts
router.get('/event/:eventId/alerts', auth, async (req, res) => {
  try {
    const { eventId } = req.params;

    const budget = await Budget.findOne({ eventId });
    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }

    if (budget.userId.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const alerts = budget.checkAlerts();
    res.json({ success: true, data: alerts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mark alert as read
router.put('/event/:eventId/alerts/:alertId/read', auth, async (req, res) => {
  try {
    const { eventId, alertId } = req.params;

    const budget = await Budget.findOne({ eventId });
    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }

    if (budget.userId.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const alert = budget.alerts.id(alertId);
    if (alert) {
      alert.isRead = true;
      await budget.save();
    }

    res.json({ success: true, data: budget });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get budget report
router.get('/event/:eventId/report', auth, async (req, res) => {
  try {
    const { eventId } = req.params;

    const budget = await Budget.findOne({ eventId }).populate('items.vendor', 'companyName');
    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }

    if (budget.userId.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Generate report
    const report = {
      summary: {
        totalBudget: budget.totalBudget,
        totalAllocated: budget.totalAllocated,
        totalSpent: budget.totalSpent,
        remainingBudget: budget.remainingBudget,
        utilizationPercentage: budget.utilizationPercentage,
        currency: budget.currency
      },
      categoryBreakdown: {},
      alerts: budget.alerts.filter(a => !a.isRead),
      items: budget.items
    };

    // Category breakdown
    budget.items.forEach(item => {
      if (!report.categoryBreakdown[item.category]) {
        report.categoryBreakdown[item.category] = {
          allocated: 0,
          spent: 0,
          remaining: 0,
          count: 0
        };
      }
      report.categoryBreakdown[item.category].allocated += item.allocatedAmount;
      report.categoryBreakdown[item.category].spent += item.spentAmount;
      report.categoryBreakdown[item.category].remaining += (item.allocatedAmount - item.spentAmount);
      report.categoryBreakdown[item.category].count += 1;
    });

    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
