import express from 'express';
import ChatConversation from '../models/ChatConversation.js';
import { auth, optionalAuth } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Helper function to call AI API (OpenAI or Gemini)
async function getAIResponse(messages, context = 'general') {
  try {
    const apiKey = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;
    const useOpenAI = !!process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error('No AI API key configured');
      return getFallbackResponse(messages, context);
    }

    // System prompt based on context
    const systemPrompts = {
      general: 'You are a helpful AI assistant for an event planning platform. Help users with event planning, vendor selection, budgeting, and general questions.',
      event_planning: 'You are an expert event planner. Help users plan their events, suggest timelines, and provide creative ideas.',
      vendor_search: 'You are a vendor recommendation specialist. Help users find the right vendors for their events.',
      booking: 'You are a booking assistant. Help users understand the booking process and manage their bookings.',
      budget: 'You are a budget planning expert. Help users create and manage event budgets effectively.',
      guest_management: 'You are a guest management specialist. Help users with invitations, RSVPs, and guest coordination.'
    };

    const systemMessage = {
      role: 'system',
      content: systemPrompts[context] || systemPrompts.general
    };

    if (useOpenAI) {
      // OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
          messages: [systemMessage, ...messages],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('OpenAI API error:', response.status, errorData);
        return getFallbackResponse(messages, context);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } else {
      // Google Gemini API
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemMessage.content}\n\nConversation:\n${messages.map(m => `${m.role}: ${m.content}`).join('\n')}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Gemini API error:', response.status, errorData);
        return getFallbackResponse(messages, context);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    }
  } catch (error) {
    console.error('AI API Error:', error);
    return getFallbackResponse(messages, context);
  }
}

// Fallback response when AI is unavailable
function getFallbackResponse(messages, context) {
  const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';
  
  // Context-aware fallback responses
  const fallbackResponses = {
    greeting: "Hello! I'm here to help you with your event planning needs. How can I assist you today?",
    event_planning: "I can help you plan your event! Please tell me about the type of event you're organizing, the date, and the number of guests you're expecting.",
    vendor_search: "I can help you find vendors for your event. What type of vendor are you looking for? (e.g., catering, photography, venue, entertainment)",
    budget: "I can assist with budget planning. What's your estimated budget for the event, and what are your main expense categories?",
    booking: "I can help with bookings. Are you looking to book a vendor or manage existing bookings?",
    guest_management: "I can help with guest management. Would you like to send invitations, track RSVPs, or manage your guest list?",
    default: "I'm currently experiencing connectivity issues with my AI service. However, I'm still here to help! You can:\n\n• Browse available vendors\n• Create and manage events\n• Track your budget\n• Manage guest lists\n• View your bookings\n\nPlease try asking your question again, or navigate to the relevant section using the menu."
  };

  // Simple keyword matching for better responses
  if (lastMessage.match(/hello|hi|hey|greet/)) {
    return fallbackResponses.greeting;
  } else if (lastMessage.match(/event|plan|organize/)) {
    return fallbackResponses.event_planning;
  } else if (lastMessage.match(/vendor|supplier|caterer|photographer/)) {
    return fallbackResponses.vendor_search;
  } else if (lastMessage.match(/budget|cost|price|expense/)) {
    return fallbackResponses.budget;
  } else if (lastMessage.match(/book|booking|reserve/)) {
    return fallbackResponses.booking;
  } else if (lastMessage.match(/guest|invite|rsvp/)) {
    return fallbackResponses.guest_management;
  }

  return fallbackResponses.default;
}

// Start or get conversation
router.post('/conversation/start', optionalAuth, async (req, res) => {
  try {
    const { sessionId, context = 'general' } = req.body;
    const userId = req.headers.authorization ? req.userId : null;

    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'Session ID required' });
    }

    // Check if conversation exists
    let conversation = await ChatConversation.findOne({ sessionId, isActive: true });

    if (!conversation) {
      // Create new conversation
      conversation = new ChatConversation({
        userId,
        sessionId,
        context,
        messages: [],
        metadata: {
          userAgent: req.headers['user-agent'],
          ipAddress: req.ip,
          referrer: req.headers.referer
        }
      });
      await conversation.save();
    }

    res.json({
      success: true,
      data: {
        conversationId: conversation._id,
        messages: conversation.messages,
        context: conversation.context
      }
    });
  } catch (error) {
    console.error('Start conversation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Send message and get AI response
router.post('/message', optionalAuth, [
  body('sessionId').notEmpty(),
  body('message').notEmpty().trim(),
  body('context').optional().isIn(['general', 'event_planning', 'vendor_search', 'booking', 'budget', 'guest_management'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { sessionId, message, context = 'general' } = req.body;
    const userId = req.headers.authorization ? req.userId : null;

    // Find or create conversation
    let conversation = await ChatConversation.findOne({ sessionId, isActive: true });

    if (!conversation) {
      conversation = new ChatConversation({
        userId,
        sessionId,
        context,
        messages: [],
        metadata: {
          userAgent: req.headers['user-agent'],
          ipAddress: req.ip
        }
      });
    }

    // Add user message
    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    conversation.messages.push(userMessage);

    // Prepare messages for AI (last 10 messages for context)
    const recentMessages = conversation.messages.slice(-10).map(m => ({
      role: m.role,
      content: m.content
    }));

    // Get AI response
    const aiResponse = await getAIResponse(recentMessages, context);

    // Add AI message
    const assistantMessage = {
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    };
    conversation.messages.push(assistantMessage);
    conversation.lastMessageAt = new Date();
    conversation.context = context;

    await conversation.save();

    // Emit real-time update if socket available
    const io = req.app.get('io');
    if (io && userId) {
      io.to(`user_${userId}`).emit('chatbot_message', {
        conversationId: conversation._id,
        message: assistantMessage
      });
    }

    res.json({
      success: true,
      data: {
        conversationId: conversation._id,
        userMessage,
        assistantMessage,
        context: conversation.context
      }
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get conversation history
router.get('/conversation/:sessionId', optionalAuth, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const conversation = await ChatConversation.findOne({ sessionId, isActive: true });

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    res.json({
      success: true,
      data: {
        conversationId: conversation._id,
        messages: conversation.messages,
        context: conversation.context,
        createdAt: conversation.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Clear conversation
router.delete('/conversation/:sessionId', optionalAuth, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const conversation = await ChatConversation.findOne({ sessionId, isActive: true });

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    conversation.isActive = false;
    await conversation.save();

    res.json({ success: true, message: 'Conversation cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get user's conversation history (authenticated)
router.get('/history', auth, async (req, res) => {
  try {
    const conversations = await ChatConversation.find({ userId: req.userId })
      .sort({ lastMessageAt: -1 })
      .limit(20)
      .select('sessionId context messages lastMessageAt createdAt');

    res.json({ success: true, data: conversations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
