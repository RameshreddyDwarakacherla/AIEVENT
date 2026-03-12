import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../lib/api';
import { toast } from 'react-toastify';
import { connectSocket, disconnectSocket, onSocketEvent } from '../services/socketService';

const AppContext = createContext();

export function useApp() {
  return useContext(AppContext);
}

export const AppProvider = ({ children }) => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [appStats, setAppStats] = useState({
    events: 0,
    tasks: 0,
    guests: 0,
    vendors: 0,
    bookings: 0,
  });
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [socketConnected, setSocketConnected] = useState(false);


  // ─── Fetch real stats from backend API ───────────────────────────────────
  const fetchAppStats = useCallback(async () => {
    if (!user) return;
    try {
      const [eventsRes, bookingsRes] = await Promise.allSettled([
        api.get('/events/stats'),
        api.get('/bookings/stats'),
      ]);

      const eventData = eventsRes.status === 'fulfilled' ? eventsRes.value?.data : {};
      const bookingData = bookingsRes.status === 'fulfilled' ? bookingsRes.value?.data : {};

      setAppStats({
        events: eventData?.total ?? 0,
        tasks: eventData?.tasks ?? 0,
        guests: eventData?.guests ?? 0,
        vendors: eventData?.vendors ?? 0,
        bookings: bookingData?.total ?? 0,
      });
    } catch (error) {
      console.error('Error fetching app stats:', error);
    }
  }, [user]);

  // ─── Fetch real notifications from backend API ───────────────────────────
  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const response = await api.get('/notifications?limit=20');
      if (response?.data) {
        setNotifications(response.data);
        setUnreadNotificationsCount(response.unreadCount || 0);
      }
    } catch (error) {
      // notifications not critical; fail silently
    }
  }, [user]);

  // ─── Socket.IO real-time events ──────────────────────────────────────────
  useEffect(() => {
    if (!user) {
      disconnectSocket();
      setNotifications([]);
      setUnreadNotificationsCount(0);
      setAppStats({ events: 0, tasks: 0, guests: 0, vendors: 0, bookings: 0 });
      setLoading(false);
      return;
    }

    // Connect socket
    connectSocket(user.id || user._id);

    // Listen for new notifications
    const unsubNotif = onSocketEvent('new_notification', (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadNotificationsCount((prev) => prev + 1);
      toast.info(notification.message || notification.title, {
        position: 'bottom-right',
        autoClose: 5000,
      });
    });

    // Listen for new messages badge update
    const unsubMsg = onSocketEvent('new_message', (message) => {
      // Only show toast if not in messages page
      if (!window.location.pathname.includes('/messages')) {
        toast.info('💬 New message received', {
          position: 'bottom-right',
          autoClose: 4000,
        });
        setUnreadNotificationsCount((prev) => prev + 1);
      }
    });

    // Track online users
    const unsubOnline = onSocketEvent('user_online', ({ userId, online }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        if (online) next.add(userId);
        else next.delete(userId);
        return next;
      });
    });

    // Track own connection status
    const unsubConn = onSocketEvent('connect', () => setSocketConnected(true));
    const unsubDisc = onSocketEvent('disconnect', () => setSocketConnected(false));
    setSocketConnected(true); // Catch if already connected


    // Fetch initial data
    fetchNotifications();
    fetchAppStats();
    setLoading(false);

    return () => {
      unsubNotif();
      unsubMsg();
      unsubOnline();
      if (unsubConn) unsubConn();
      if (unsubDisc) unsubDisc();
    };
  }, [user, fetchNotifications, fetchAppStats]);

  // ─── Notification actions ─────────────────────────────────────────────────
  const markNotificationAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`, {});
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
      );
      setUnreadNotificationsCount((prev) => Math.max(0, prev - 1));
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await api.put('/notifications/read-all', {});
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadNotificationsCount(0);
      return true;
    } catch (error) {
      console.error('Error marking all as read:', error);
      return false;
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await api.delete(`/notifications/${notificationId}`);
      const deleted = notifications.find((n) => n._id === notificationId);
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
      if (deleted && !deleted.isRead) {
        setUnreadNotificationsCount((prev) => Math.max(0, prev - 1));
      }
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  };

  const isUserOnline = (userId) => onlineUsers.has(userId?.toString());

  const value = {
    loading,
    notifications,
    unreadNotificationsCount,
    appStats,
    onlineUsers,
    isUserOnline,
    isSocketConnected: socketConnected,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    refreshAppStats: fetchAppStats,
    refreshNotifications: fetchNotifications,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
