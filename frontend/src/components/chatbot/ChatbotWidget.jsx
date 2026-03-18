import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Fab,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Chip,
  Fade,
  CircularProgress,
  Tooltip
} from '@mui/material';
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatbot } from '../../hooks/useChatbot';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [context, setContext] = useState('general');
  const messagesEndRef = useRef(null);
  
  const {
    messages,
    isLoading,
    sendMessage,
    clearConversation,
    isConnected
  } = useChatbot();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage('');
    await sendMessage(userMessage, context);
  };

  const handleContextChange = (newContext) => {
    setContext(newContext);
  };

  const contextOptions = [
    { value: 'general', label: 'General Help', color: '#2E7D32' },
    { value: 'event_planning', label: 'Event Planning', color: '#1976D2' },
    { value: 'vendor_search', label: 'Find Vendors', color: '#7B1FA2' },
    { value: 'booking', label: 'Bookings', color: '#F57C00' },
    { value: 'budget', label: 'Budget Help', color: '#388E3C' },
    { value: 'guest_management', label: 'Guest Management', color: '#D32F2F' }
  ];

  const getCurrentContextColor = () => {
    return contextOptions.find(opt => opt.value === context)?.color || '#2E7D32';
  };

  if (!isOpen) {
    return (
      <Fab
        color="primary"
        onClick={() => setIsOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'linear-gradient(135deg, #2E7D32 0%, #43A047 100%)',
          zIndex: 1300,
          '&:hover': {
            background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
            transform: 'scale(1.1)',
          },
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 20px rgba(46,125,50,0.4)',
        }}
      >
        <ChatIcon />
      </Fab>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 100 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 100 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1300,
          width: 380,
          height: isMinimized ? 60 : 500,
        }}
      >
        <Paper
          elevation={8}
          sx={{
            width: '100%',
            height: '100%',
            borderRadius: 3,
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
            border: '2px solid #2E7D32',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #2E7D32 0%, #43A047 100%)',
              color: 'white',
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}
            onClick={() => setIsMinimized(!isMinimized)}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.2)' }}>
                <BotIcon fontSize="small" />
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
                  AI Event Assistant
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: isConnected ? '#4CAF50' : '#F44336',
                    }}
                  />
                  <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                    {isConnected ? 'Online' : 'Offline'}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Tooltip title="Clear conversation">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearConversation();
                  }}
                  sx={{ color: 'rgba(255,255,255,0.8)' }}
                >
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <IconButton
                size="small"
                sx={{ color: 'rgba(255,255,255,0.8)' }}
              >
                {isMinimized ? <ExpandIcon /> : <CollapseIcon />}
              </IconButton>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                sx={{ color: 'rgba(255,255,255,0.8)' }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {!isMinimized && (
            <>
              {/* Context Selector */}
              <Box sx={{ p: 1, borderBottom: '1px solid rgba(46,125,50,0.2)' }}>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {contextOptions.map((option) => (
                    <Chip
                      key={option.value}
                      label={option.label}
                      size="small"
                      onClick={() => handleContextChange(option.value)}
                      sx={{
                        fontSize: '0.7rem',
                        height: 24,
                        bgcolor: context === option.value ? option.color : 'rgba(46,125,50,0.1)',
                        color: context === option.value ? 'white' : '#2E7D32',
                        '&:hover': {
                          bgcolor: context === option.value ? option.color : 'rgba(46,125,50,0.2)',
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Messages */}
              <Box
                sx={{
                  flex: 1,
                  overflowY: 'auto',
                  p: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  '&::-webkit-scrollbar': { width: 4 },
                  '&::-webkit-scrollbar-thumb': { 
                    background: 'rgba(46,125,50,0.3)', 
                    borderRadius: 2 
                  },
                }}
              >
                {messages.length === 0 && (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <BotIcon sx={{ fontSize: 48, color: '#2E7D32', mb: 1 }} />
                    <Typography variant="body2" sx={{ color: '#2E7D32', mb: 1 }}>
                      Hi! I'm your AI Event Assistant
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#666' }}>
                      Ask me anything about event planning, vendors, budgets, or bookings!
                    </Typography>
                  </Box>
                )}

                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        mb: 1,
                      }}
                    >
                      <Box
                        sx={{
                          maxWidth: '80%',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 1,
                          flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 24,
                            height: 24,
                            bgcolor: msg.role === 'user' ? getCurrentContextColor() : '#2E7D32',
                          }}
                        >
                          {msg.role === 'user' ? (
                            <PersonIcon sx={{ fontSize: 14 }} />
                          ) : (
                            <BotIcon sx={{ fontSize: 14 }} />
                          )}
                        </Avatar>
                        <Paper
                          elevation={1}
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: msg.role === 'user' 
                              ? getCurrentContextColor()
                              : 'rgba(255,255,255,0.9)',
                            color: msg.role === 'user' ? 'white' : '#333',
                            border: msg.role === 'assistant' ? '1px solid rgba(46,125,50,0.2)' : 'none',
                          }}
                        >
                          <Typography variant="body2" sx={{ fontSize: '0.85rem', lineHeight: 1.4 }}>
                            {msg.content}
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              fontSize: '0.7rem', 
                              opacity: 0.7,
                              display: 'block',
                              mt: 0.5
                            }}
                          >
                            {new Date(msg.timestamp).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </Typography>
                        </Paper>
                      </Box>
                    </Box>
                  </motion.div>
                ))}

                {isLoading && (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 24, height: 24, bgcolor: '#2E7D32' }}>
                        <BotIcon sx={{ fontSize: 14 }} />
                      </Avatar>
                      <Paper
                        elevation={1}
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: 'rgba(255,255,255,0.9)',
                          border: '1px solid rgba(46,125,50,0.2)',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CircularProgress size={16} sx={{ color: '#2E7D32' }} />
                          <Typography variant="body2" sx={{ fontSize: '0.85rem', color: '#666' }}>
                            Thinking...
                          </Typography>
                        </Box>
                      </Paper>
                    </Box>
                  </Box>
                )}

                <div ref={messagesEndRef} />
              </Box>

              {/* Input */}
              <Box
                component="form"
                onSubmit={handleSendMessage}
                sx={{
                  p: 1,
                  borderTop: '1px solid rgba(46,125,50,0.2)',
                  background: 'rgba(255,255,255,0.5)',
                }}
              >
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Ask me anything about event planning..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={isLoading}
                    multiline
                    maxRows={3}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor: 'white',
                        '& fieldset': { borderColor: 'rgba(46,125,50,0.3)' },
                        '&:hover fieldset': { borderColor: '#2E7D32' },
                        '&.Mui-focused fieldset': { borderColor: getCurrentContextColor() },
                      },
                    }}
                  />
                  <IconButton
                    type="submit"
                    disabled={!message.trim() || isLoading}
                    sx={{
                      bgcolor: getCurrentContextColor(),
                      color: 'white',
                      '&:hover': { bgcolor: '#1B5E20' },
                      '&.Mui-disabled': { bgcolor: 'rgba(46,125,50,0.3)' },
                    }}
                  >
                    <SendIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </>
          )}
        </Paper>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatbotWidget;