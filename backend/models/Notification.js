import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  title: {
    type: String,
    trim: true,
    default: 'Notification',
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: [
      'booking_request',
      'booking_confirmed',
      'booking_cancelled',
      'booking_rejected',
      'payment_received',
      'payment_failed',
      'review_received',
      'message_received',
      'event_reminder',
      'guest_rsvp',
      'vendor_verified',
      'system',
      'info',
    ],
    default: 'info',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  entityId: {
    type: String,
    default: null,
  },
  entityType: {
    type: String,
    enum: ['event', 'booking', 'message', 'review', 'vendor', 'user', null],
    default: null,
  },
  actionUrl: {
    type: String,
    trim: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  readAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
