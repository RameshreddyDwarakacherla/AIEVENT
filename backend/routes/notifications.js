import express from 'express';
import Notification from '../models/Notification.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/notifications
 * Get notifications for the logged-in user (paginated, with unread count)
 */
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly = 'false' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = { userId: req.userId };
    if (unreadOnly === 'true') query.isRead = false;

    const [notifications, unreadCount, total] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Notification.countDocuments({ userId: req.userId, isRead: false }),
      Notification.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: notifications,
      unreadCount,
      pagination: { total, page: parseInt(page), limit: parseInt(limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/notifications
 * Create a notification (usually called by server-side actions)
 */
router.post('/', auth, async (req, res) => {
  try {
    const { userId, title, message, type, priority, entityId, entityType, actionUrl } = req.body;

    const notification = new Notification({
      userId: userId || req.userId,
      title,
      message,
      type: type || 'info',
      priority: priority || 'medium',
      entityId,
      entityType,
      actionUrl,
    });

    await notification.save();

    // Emit to recipient via Socket.IO if available
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${userId || req.userId}`).emit('new_notification', notification);
    }

    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * PUT /api/notifications/:id/read
 * Mark a single notification as read
 */
router.put('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { isRead: true, readAt: new Date() },
      { new: true }
    );
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
    res.json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * PUT /api/notifications/read-all
 * Mark ALL notifications as read for the user
 */
router.put('/read-all', auth, async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * DELETE /api/notifications/:id
 * Delete a single notification
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * DELETE /api/notifications
 * Clear all notifications for the user
 */
router.delete('/', auth, async (req, res) => {
  try {
    await Notification.deleteMany({ userId: req.userId });
    res.json({ success: true, message: 'All notifications cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
