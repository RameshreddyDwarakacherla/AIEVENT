import { useEffect, useRef, useCallback } from 'react';
import { connectSocket, disconnectSocket, onSocketEvent, emitSocketEvent } from '../services/socketService';

/**
 * useSocket - React hook for Socket.IO integration
 *
 * @param {string} userId - The current user's ID (null = not connected)
 * @param {Object} eventHandlers - Map of { eventName: handlerFn }
 *
 * Usage:
 *   useSocket(user?.id, {
 *     new_message: (msg) => setMessages(prev => [...prev, msg]),
 *     new_notification: (notif) => setNotifications(prev => [notif, ...prev]),
 *     user_online: ({ userId, online }) => updateOnlineStatus(userId, online),
 *   });
 */
const useSocket = (userId, eventHandlers = {}) => {
  const socketRef = useRef(null);
  const handlersRef = useRef(eventHandlers);

  // Keep handlers ref current without re-running effects
  useEffect(() => {
    handlersRef.current = eventHandlers;
  });

  useEffect(() => {
    if (!userId) {
      disconnectSocket();
      return;
    }

    // Connect + join personal room
    socketRef.current = connectSocket(userId);

    // Stable wrapper functions so we can clean them up
    const cleanups = Object.entries(handlersRef.current).map(([event, handler]) => {
      const wrapper = (...args) => handler(...args);
      return onSocketEvent(event, wrapper);
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [userId]);

  const emit = useCallback((event, data) => {
    emitSocketEvent(event, data);
  }, []);

  return { emit, socket: socketRef.current };
};

export default useSocket;
