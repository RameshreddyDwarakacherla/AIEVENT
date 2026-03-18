import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';

export const useChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [isConnected, setIsConnected] = useState(true);
  const { user } = useAuth();

  // Generate session ID
  useEffect(() => {
    const generateSessionId = () => {
      return `chatbot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    };

    const storedSessionId = localStorage.getItem('chatbot_session_id');
    if (storedSessionId) {
      setSessionId(storedSessionId);
      loadConversationHistory(storedSessionId);
    } else {
      const newSessionId = generateSessionId();
      setSessionId(newSessionId);
      localStorage.setItem('chatbot_session_id', newSessionId);
      initializeConversation(newSessionId);
    }
  }, []);

  const initializeConversation = async (sessionId) => {
    try {
      const response = await api.post('/chatbot/conversation/start', {
        sessionId,
        context: 'general'
      });
      
      if (response.success) {
        console.log('Conversation initialized successfully');
      }
    } catch (error) {
      console.error('Failed to initialize conversation:', error);
      setIsConnected(false);
    }
  };

  const loadConversationHistory = async (sessionId) => {
    try {
      const response = await api.get(`/chatbot/conversation/${sessionId}`);
      if (response.success) {
        setMessages(response.data.messages || []);
      }
    } catch (error) {
      console.error('Failed to load conversation history:', error);
      // If conversation doesn't exist, initialize a new one
      if (error.message?.includes('Conversation not found') || error.message?.includes('404')) {
        await initializeConversation(sessionId);
      }
    }
  };

  const sendMessage = useCallback(async (message, context = 'general') => {
    if (!sessionId || !message.trim()) return;

    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await api.post('/chatbot/message', {
        sessionId,
        message: message.trim(),
        context
      });

      if (response.success) {
        const { assistantMessage } = response.data;
        setMessages(prev => [...prev, assistantMessage]);
        setIsConnected(true);
      } else {
        throw new Error(response.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setIsConnected(false);
      
      // Add error message
      const errorMessage = {
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  const clearConversation = useCallback(async () => {
    if (!sessionId) return;

    try {
      await api.delete(`/chatbot/conversation/${sessionId}`);
      
      // Generate new session
      const newSessionId = `chatbot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setSessionId(newSessionId);
      localStorage.setItem('chatbot_session_id', newSessionId);
      
      // Clear messages
      setMessages([]);
      
      // Initialize new conversation
      await initializeConversation(newSessionId);
    } catch (error) {
      console.error('Failed to clear conversation:', error);
    }
  }, [sessionId]);

  const getConversationHistory = useCallback(async () => {
    if (!user) return [];

    try {
      const response = await api.get('/chatbot/history');
      return response.success ? response.data : [];
    } catch (error) {
      console.error('Failed to get conversation history:', error);
      return [];
    }
  }, [user]);

  return {
    messages,
    isLoading,
    sessionId,
    isConnected,
    sendMessage,
    clearConversation,
    getConversationHistory
  };
};