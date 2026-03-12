import { api } from '../lib/api';
import { toast } from 'react-toastify';

export const getUserNotifications = async (userId, limit = 20, includeRead = false) => {
  try {
    const params = new URLSearchParams({ limit });
    if (!includeRead) params.append('unreadOnly', 'true');
    const response = await api.get(`/notifications?${params.toString()}`);
    return response?.data || [];
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

export const sendNotification = async (userId, message, type = 'info', entityId = null, priority = 'medium', options = {}) => {
  try {
    const response = await api.post('/notifications', {
      userId,
      title: options.title || 'Notification',
      message,
      type,
      entityId,
      entityType: options.entityType || null,
      actionUrl: options.actionUrl || null,
      priority,
    });
    return response?.data || null;
  } catch (error) {
    console.error('Error sending notification:', error);
    return null;
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    await api.put(`/notifications/${notificationId}/read`, {});
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
};

export const markAllAsRead = async () => {
  try {
    await api.put('/notifications/read-all', {});
    return true;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return false;
  }
};

export const deleteNotification = async (notificationId) => {
  try {
    await api.delete(`/notifications/${notificationId}`);
    return true;
  } catch (error) {
    console.error('Error deleting notification:', error);
    return false;
  }
};

export const showNotificationToast = (notification) => {
  const { type, message, title } = notification;
  const text = message || title;

  const toastOptions = { position: 'bottom-right', autoClose: 5000 };

  switch (type) {
    case 'booking_confirmed':
    case 'payment_received':
    case 'vendor_verified':
      toast.success(text, toastOptions);
      break;
    case 'booking_cancelled':
    case 'booking_rejected':
    case 'payment_failed':
      toast.error(text, toastOptions);
      break;
    case 'booking_request':
    case 'message_received':
    case 'review_received':
    case 'guest_rsvp':
      toast.info(text, toastOptions);
      break;
    default:
      toast.info(text, toastOptions);
  }
};

export const initializeRealTimeSubscriptions = () => ({ unsubscribe: () => {} });
export const unsubscribeAll = () => {};

export default {
  getUserNotifications,
  sendNotification,
  markNotificationAsRead,
  markAllAsRead,
  deleteNotification,
  showNotificationToast,
  initializeRealTimeSubscriptions,
  unsubscribeAll,
};
