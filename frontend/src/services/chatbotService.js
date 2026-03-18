import { api } from '../lib/api';

class ChatbotService {
  // Start or get existing conversation
  async startConversation(sessionId, context = 'general') {
    try {
      const response = await api.post('/chatbot/conversation/start', {
        sessionId,
        context
      });
      return response.data;
    } catch (error) {
      console.error('ChatbotService: Failed to start conversation', error);
      throw error;
    }
  }

  // Send message to chatbot
  async sendMessage(sessionId, message, context = 'general') {
    try {
      const response = await api.post('/chatbot/message', {
        sessionId,
        message,
        context
      });
      return response.data;
    } catch (error) {
      console.error('ChatbotService: Failed to send message', error);
      throw error;
    }
  }

  // Get conversation history
  async getConversation(sessionId) {
    try {
      const response = await api.get(`/chatbot/conversation/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('ChatbotService: Failed to get conversation', error);
      throw error;
    }
  }

  // Clear conversation
  async clearConversation(sessionId) {
    try {
      const response = await api.delete(`/chatbot/conversation/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('ChatbotService: Failed to clear conversation', error);
      throw error;
    }
  }

  // Get user's conversation history (authenticated)
  async getUserConversationHistory() {
    try {
      const response = await api.get('/chatbot/history');
      return response.data;
    } catch (error) {
      console.error('ChatbotService: Failed to get user history', error);
      throw error;
    }
  }

  // Generate session ID
  generateSessionId() {
    return `chatbot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get or create session ID from localStorage
  getSessionId() {
    let sessionId = localStorage.getItem('chatbot_session_id');
    if (!sessionId) {
      sessionId = this.generateSessionId();
      localStorage.setItem('chatbot_session_id', sessionId);
    }
    return sessionId;
  }

  // Clear session ID
  clearSessionId() {
    localStorage.removeItem('chatbot_session_id');
  }

  // Context helpers
  getContextOptions() {
    return [
      { value: 'general', label: 'General Help', description: 'General questions and help' },
      { value: 'event_planning', label: 'Event Planning', description: 'Help with planning your events' },
      { value: 'vendor_search', label: 'Find Vendors', description: 'Find and select vendors for your event' },
      { value: 'booking', label: 'Bookings', description: 'Help with booking vendors and services' },
      { value: 'budget', label: 'Budget Help', description: 'Budget planning and management' },
      { value: 'guest_management', label: 'Guest Management', description: 'Managing guests and invitations' }
    ];
  }

  // Get context color
  getContextColor(context) {
    const colors = {
      general: '#2E7D32',
      event_planning: '#1976D2',
      vendor_search: '#7B1FA2',
      booking: '#F57C00',
      budget: '#388E3C',
      guest_management: '#D32F2F'
    };
    return colors[context] || colors.general;
  }

  // Format message for display
  formatMessage(message) {
    return {
      ...message,
      timestamp: new Date(message.timestamp),
      formattedTime: new Date(message.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  }

  // Check if message is from user
  isUserMessage(message) {
    return message.role === 'user';
  }

  // Check if message is from assistant
  isAssistantMessage(message) {
    return message.role === 'assistant';
  }
}

export default new ChatbotService();