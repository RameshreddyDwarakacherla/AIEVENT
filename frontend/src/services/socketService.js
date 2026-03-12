import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

let socket = null;

/**
 * Initialize and connect the Socket.IO client
 */
export const connectSocket = (userId) => {
  if (socket?.connected) return socket;

  socket = io(SOCKET_URL, {
    transports: ['websocket', 'polling'],
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 20000,
  });

  socket.on('connect', () => {
    console.log('🔌 Socket connected:', socket.id);
    if (userId) {
      socket.emit('join', userId);
    }
  });

  socket.on('connect_error', (err) => {
    console.warn('Socket connection error:', err.message);
  });

  socket.on('disconnect', (reason) => {
    console.log('🔌 Socket disconnected:', reason);
  });

  return socket;
};

/**
 * Disconnect socket
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Get the current socket instance
 */
export const getSocket = () => socket;

/**
 * Check if the socket is currently connected
 */
export const isSocketConnected = () => socket?.connected || false;

/**
 * Subscribe to a Socket.IO event
 * Returns cleanup function
 */
export const onSocketEvent = (event, callback) => {
  if (!socket) return () => {};
  socket.on(event, callback);
  return () => socket.off(event, callback);
};

/**
 * Emit a Socket.IO event
 */
export const emitSocketEvent = (event, data) => {
  if (socket?.connected) {
    socket.emit(event, data);
  }
};

/**
 * Join a conversation room for real-time typing indicators
 */
export const joinConversation = (conversationId) => {
  if (socket?.connected) {
    socket.emit('join_conversation', conversationId);
  }
};

export const leaveConversation = (conversationId) => {
  if (socket?.connected) {
    socket.emit('leave_conversation', conversationId);
  }
};

/**
 * Emit typing status
 */
export const emitTyping = (conversationId, userId, isTyping) => {
  if (socket?.connected) {
    socket.emit('typing', { conversationId, userId, isTyping });
  }
};

export default {
  connectSocket,
  disconnectSocket,
  getSocket,
  onSocketEvent,
  emitSocketEvent,
  joinConversation,
  leaveConversation,
  emitTyping,
  isSocketConnected,
};
