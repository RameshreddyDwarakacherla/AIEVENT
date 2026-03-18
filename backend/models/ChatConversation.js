import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const chatConversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow anonymous users
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  messages: [messageSchema],
  context: {
    type: String,
    enum: ['general', 'event_planning', 'vendor_search', 'booking', 'budget', 'guest_management'],
    default: 'general'
  },
  metadata: {
    userAgent: String,
    ipAddress: String,
    referrer: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
chatConversationSchema.index({ userId: 1, createdAt: -1 });
chatConversationSchema.index({ sessionId: 1, isActive: 1 });

const ChatConversation = mongoose.model('ChatConversation', chatConversationSchema);

export default ChatConversation;
