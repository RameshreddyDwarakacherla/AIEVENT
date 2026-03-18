import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Tooltip
} from '@mui/material';
import {
  SmartToy as BotIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  Chat as ChatIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { api } from '../../lib/api';
import { StatCard } from '../../components/common';

const ChatbotManagementPage = () => {
  const [conversations, setConversations] = useState([]);
  const [stats, setStats] = useState({
    totalConversations: 0,
    activeConversations: 0,
    totalMessages: 0,
    avgMessagesPerConversation: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [filterContext, setFilterContext] = useState('all');

  useEffect(() => {
    fetchConversations();
    fetchStats();
  }, [filterContext]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/chatbot/conversations', {
        params: { context: filterContext !== 'all' ? filterContext : undefined }
      });
      
      if (response.data.success) {
        setConversations(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/chatbot/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleViewConversation = (conversation) => {
    setSelectedConversation(conversation);
    setViewDialogOpen(true);
  };

  const handleDeleteConversation = async (conversationId) => {
    if (!window.confirm('Are you sure you want to delete this conversation?')) {
      return;
    }

    try {
      await api.delete(`/admin/chatbot/conversations/${conversationId}`);
      toast.success('Conversation deleted successfully');
      fetchConversations();
      fetchStats();
    } catch (error) {
      console.error('Failed to delete conversation:', error);
      toast.error('Failed to delete conversation');
    }
  };

  const getContextColor = (context) => {
    const colors = {
      general: '#2E7D32',
      event_planning: '#1976D2',
      vendor_search: '#7B1FA2',
      booking: '#F57C00',
      budget: '#388E3C',
      guest_management: '#D32F2F'
    };
    return colors[context] || colors.general;
  };

  const getContextLabel = (context) => {
    const labels = {
      general: 'General',
      event_planning: 'Event Planning',
      vendor_search: 'Vendor Search',
      booking: 'Booking',
      budget: 'Budget',
      guest_management: 'Guest Management'
    };
    return labels[context] || context;
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1B5E20', mb: 1 }}>
            Chatbot Management
          </Typography>
          <Typography variant="body1" sx={{ color: '#666' }}>
            Monitor and manage AI chatbot conversations
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Conversations"
              value={stats.totalConversations}
              icon={<ChatIcon />}
              color="#2E7D32"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Active Conversations"
              value={stats.activeConversations}
              icon={<TrendingUpIcon />}
              color="#1976D2"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Messages"
              value={stats.totalMessages}
              icon={<BotIcon />}
              color="#7B1FA2"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Avg Messages/Conv"
              value={stats.avgMessagesPerConversation.toFixed(1)}
              icon={<ScheduleIcon />}
              color="#F57C00"
            />
          </Grid>
        </Grid>

        {/* Filters and Actions */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Conversations
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                select
                size="small"
                value={filterContext}
                onChange={(e) => setFilterContext(e.target.value)}
                sx={{ minWidth: 150 }}
              >
                <MenuItem value="all">All Contexts</MenuItem>
                <MenuItem value="general">General</MenuItem>
                <MenuItem value="event_planning">Event Planning</MenuItem>
                <MenuItem value="vendor_search">Vendor Search</MenuItem>
                <MenuItem value="booking">Booking</MenuItem>
                <MenuItem value="budget">Budget</MenuItem>
                <MenuItem value="guest_management">Guest Management</MenuItem>
              </TextField>
              <Tooltip title="Refresh">
                <IconButton onClick={fetchConversations} sx={{ color: '#2E7D32' }}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Conversations Table */}
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Session ID</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Context</TableCell>
                  <TableCell>Messages</TableCell>
                  <TableCell>Last Activity</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {conversations.map((conversation) => (
                  <TableRow key={conversation._id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {conversation.sessionId.slice(-8)}...
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {conversation.userId ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PersonIcon fontSize="small" sx={{ color: '#666' }} />
                          <Typography variant="body2">
                            {conversation.userId.firstName} {conversation.userId.lastName}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" sx={{ color: '#666', fontStyle: 'italic' }}>
                          Anonymous
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getContextLabel(conversation.context)}
                        size="small"
                        sx={{
                          bgcolor: getContextColor(conversation.context),
                          color: 'white',
                          fontSize: '0.75rem'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {conversation.messages.length}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(conversation.lastMessageAt).toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={conversation.isActive ? 'Active' : 'Inactive'}
                        size="small"
                        color={conversation.isActive ? 'success' : 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="View Conversation">
                          <IconButton
                            size="small"
                            onClick={() => handleViewConversation(conversation)}
                            sx={{ color: '#1976D2' }}
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Conversation">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteConversation(conversation._id)}
                            sx={{ color: '#D32F2F' }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {conversations.length === 0 && !loading && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <BotIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#666' }}>
                No conversations found
              </Typography>
            </Box>
          )}
        </Paper>

        {/* View Conversation Dialog */}
        <Dialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BotIcon sx={{ color: '#2E7D32' }} />
              <Typography variant="h6">
                Conversation Details
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedConversation && (
              <Box>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" sx={{ color: '#666' }}>
                      Session ID
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {selectedConversation.sessionId}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" sx={{ color: '#666' }}>
                      Context
                    </Typography>
                    <Chip
                      label={getContextLabel(selectedConversation.context)}
                      size="small"
                      sx={{
                        bgcolor: getContextColor(selectedConversation.context),
                        color: 'white'
                      }}
                    />
                  </Grid>
                </Grid>

                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Messages ({selectedConversation.messages.length})
                </Typography>

                <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                  {selectedConversation.messages.map((message, index) => (
                    <Box
                      key={index}
                      sx={{
                        mb: 2,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: message.role === 'user' ? '#E3F2FD' : '#F1F8E9',
                        border: `1px solid ${message.role === 'user' ? '#BBDEFB' : '#DCEDC8'}`
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {message.role === 'user' ? 'User' : 'AI Assistant'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          {new Date(message.timestamp).toLocaleString()}
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        {message.content}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Container>
  );
};

export default ChatbotManagementPage;