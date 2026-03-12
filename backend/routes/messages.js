import express from 'express';
import Message from '../models/Message.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/messages/conversations
 * Returns a list of all unique conversations for the logged-in user
 */
router.get('/conversations', auth, async (req, res) => {
  try {
    const userId = req.userId;

    // Find all messages involving this user
    const messages = await Message.find({
      $or: [{ senderId: userId }, { recipientId: userId }],
    })
      .sort({ createdAt: -1 })
      .populate('senderId', 'firstName lastName email avatarUrl role')
      .populate('recipientId', 'firstName lastName email avatarUrl role');

    // Build unique conversation summaries
    const conversationMap = new Map();

    for (const msg of messages) {
      const otherId =
        msg.senderId._id.toString() === userId.toString()
          ? msg.recipientId._id.toString()
          : msg.senderId._id.toString();

      const otherUser =
        msg.senderId._id.toString() === userId.toString()
          ? msg.recipientId
          : msg.senderId;

      if (!conversationMap.has(otherId)) {
        const unreadCount = await Message.countDocuments({
          conversationId: msg.conversationId,
          recipientId: userId,
          isRead: false,
        });

        conversationMap.set(otherId, {
          conversationId: msg.conversationId,
          otherUser: {
            id: otherUser._id,
            firstName: otherUser.firstName,
            lastName: otherUser.lastName,
            email: otherUser.email,
            avatarUrl: otherUser.avatarUrl,
            role: otherUser.role,
          },
          lastMessage: msg.message,
          lastMessageTime: msg.createdAt,
          unreadCount,
        });
      }
    }

    const conversations = Array.from(conversationMap.values());
    res.json({ success: true, data: conversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/messages/:conversationId
 * Returns all messages in a conversation (paginated)
 */
router.get('/:conversationId', auth, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('senderId', 'firstName lastName email avatarUrl')
      .populate('recipientId', 'firstName lastName email avatarUrl');

    // Mark messages as read
    await Message.updateMany(
      { conversationId, recipientId: req.userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    const total = await Message.countDocuments({ conversationId });

    res.json({
      success: true,
      data: messages,
      pagination: { total, page: parseInt(page), limit: parseInt(limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/messages
 * Send a new message
 */
router.post('/', auth, async (req, res) => {
  try {
    const { recipientId, message, messageType = 'text', fileUrl, fileName } = req.body;

    if (!recipientId || !message) {
      return res.status(400).json({ success: false, message: 'recipientId and message are required' });
    }

    // Build a deterministic conversationId from the two user IDs
    const ids = [req.userId.toString(), recipientId.toString()].sort();
    const conversationId = `conv_${ids[0]}_${ids[1]}`;

    const newMessage = new Message({
      conversationId,
      senderId: req.userId,
      recipientId,
      message,
      messageType,
      fileUrl,
      fileName,
    });

    await newMessage.save();
    await newMessage.populate('senderId', 'firstName lastName email avatarUrl');
    await newMessage.populate('recipientId', 'firstName lastName email avatarUrl');

    // Emit socket event to recipient (if Socket.IO is set up on server)
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${recipientId}`).emit('new_message', newMessage);
    }

    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * PUT /api/messages/:conversationId/read
 * Mark all messages in a conversation as read
 */
router.put('/:conversationId/read', auth, async (req, res) => {
  try {
    await Message.updateMany(
      { conversationId: req.params.conversationId, recipientId: req.userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );
    res.json({ success: true, message: 'Messages marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * DELETE /api/messages/:id
 * Delete a single message (only sender can delete)
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const msg = await Message.findOneAndDelete({ _id: req.params.id, senderId: req.userId });
    if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });
    res.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
