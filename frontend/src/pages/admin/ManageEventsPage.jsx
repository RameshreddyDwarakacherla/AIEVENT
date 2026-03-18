import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Tabs,
  Tab,
  InputAdornment,
  Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EventIcon from '@mui/icons-material/Event';
import DeleteIcon from '@mui/icons-material/Delete';
import PeopleIcon from '@mui/icons-material/People';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import RefreshIcon from '@mui/icons-material/Refresh';
import { PageContainer } from '../../components/common';

const EVENT_STATUSES = ['planning', 'confirmed', 'completed', 'cancelled'];

const ManageEventsPage = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [eventDetails, setEventDetails] = useState({
    tasks: [],
    guests: [],
    budget: []
  });

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        // Check if user is admin using the userRole from context
        if (userRole !== 'admin') {
          throw new Error('You do not have admin privileges');
        }

        fetchEvents();
      } catch (err) {
        console.error('Error checking admin access:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (user) {
      checkAdminAccess();
    }
  }, [user, userRole]);

  const fetchEvents = async () => {
    try {
      setLoading(true);

      // Fetch all events from API (admin view)
      const response = await api.get('/events/all');
      if (!response.success) throw new Error(response.message);

      // Map backend fields to frontend expectations
      const mappedEvents = (response.data || []).map(e => ({
        ...e,
        id: e._id || e.id,
        event_type: e.eventType,
        start_date: e.startDate,
        end_date: e.endDate,
        profiles: {
          id: e.userId?._id || e.userId?.id,
          email: e.userId?.email,
          first_name: e.userId?.firstName,
          last_name: e.userId?.lastName
        }
      }));

      setEvents(mappedEvents);
      setFilteredEvents(mappedEvents);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    filterEvents(newValue, searchQuery);
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    filterEvents(tabValue, query);
  };

  const filterEvents = (tabIndex, query) => {
    let filtered = events;

    // Filter by status based on tab
    if (tabIndex === 1) { // Planning
      filtered = events.filter(event => event.status === 'planning');
    } else if (tabIndex === 2) { // Confirmed
      filtered = events.filter(event => event.status === 'confirmed');
    } else if (tabIndex === 3) { // Completed
      filtered = events.filter(event => event.status === 'completed');
    } else if (tabIndex === 4) { // Cancelled
      filtered = events.filter(event => event.status === 'cancelled');
    }

    // Filter by search query
    if (query) {
      const lowercaseQuery = query.toLowerCase();
      filtered = filtered.filter(event =>
        (event.title && event.title.toLowerCase().includes(lowercaseQuery)) ||
        (event.event_type && event.event_type.toLowerCase().includes(lowercaseQuery)) ||
        (event.location && event.location.toLowerCase().includes(lowercaseQuery)) ||
        (event.profiles?.email && event.profiles.email.toLowerCase().includes(lowercaseQuery)) ||
        (event.profiles?.first_name && event.profiles.first_name.toLowerCase().includes(lowercaseQuery)) ||
        (event.profiles?.last_name && event.profiles.last_name.toLowerCase().includes(lowercaseQuery))
      );
    }

    setFilteredEvents(filtered);
  };

  const handleViewDetails = async (event) => {
    try {
      setCurrentEvent(event);
      setLoading(true);

      // Fetch event tasks - mock data for now since we don't have this endpoint
      const tasksData = [];

      // Fetch event guests - mock data for now since we don't have this endpoint
      const guestsData = [];

      // Fetch event budget items - mock data for now since we don't have this endpoint
      const budgetData = [];

      setEventDetails({
        tasks: tasksData || [],
        guests: guestsData || [],
        budget: budgetData || []
      });

      setDetailsDialogOpen(true);
    } catch (err) {
      console.error('Error fetching event details:', err);
      toast.error('Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (event) => {
    setCurrentEvent(event);
    setDeleteDialogOpen(true);
  };

  const handleDeleteEvent = async () => {
    try {
      if (!currentEvent) return;

      // In a real application, you might want to implement soft delete instead
      // For this demo, we'll just update the status to cancelled
      const response = await api.put(`/events/${currentEvent.id}`, {
        status: 'cancelled'
      });

      if (!response.success) throw new Error(response.message);

      // Refresh event list
      await fetchEvents();
      setDeleteDialogOpen(false);
      toast.success('Event cancelled successfully');
    } catch (err) {
      console.error('Error cancelling event:', err);
      setError(err.message);
      toast.error('Failed to cancel event');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'planning':
        return 'primary';
      case 'confirmed':
        return 'info';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading && events.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <PageContainer
      title="Event Monitoring"
      badge={`${events.length} Total Platform Events`}
    >
      {/* Filters and Search */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="event filter tabs"
              sx={{
                '& .MuiTab-root': {
                  color: 'text.secondary',
                  fontWeight: 600,
                },
                '& .Mui-selected': {
                  color: 'primary.main',
                },
              }}
            >
              <Tab label="All Events" />
              <Tab label="Planning" />
              <Tab label="Confirmed" />
              <Tab label="Completed" />
              <Tab label="Cancelled" />
            </Tabs>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search events..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              size="small"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Events Table */}
      <Paper 
        elevation={0}
        sx={{ 
          width: '100%', 
          overflow: 'hidden',
          background: 'rgba(255,255,255,0.02)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 4
        }}
      >
        <TableContainer sx={{ maxHeight: 650 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ background: 'rgba(30,30,50,0.8)', color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>Event details</TableCell>
                <TableCell sx={{ background: 'rgba(30,30,50,0.8)', color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>Schedule</TableCell>
                <TableCell sx={{ background: 'rgba(30,30,50,0.8)', color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>Location</TableCell>
                <TableCell sx={{ background: 'rgba(30,30,50,0.8)', color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>Organizer</TableCell>
                <TableCell sx={{ background: 'rgba(30,30,50,0.8)', color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>Status</TableCell>
                <TableCell align="right" sx={{ background: 'rgba(30,30,50,0.8)', color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <AnimatePresence>
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((event, index) => (
                    <TableRow 
                      key={event.id}
                      component={motion.tr}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      hover
                      sx={{ 
                        '&:hover': { background: 'rgba(255,255,255,0.04) !important' },
                        borderBottom: '1px solid rgba(255,255,255,0.04)'
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ 
                            width: 44, height: 44, borderRadius: 2,
                            background: 'rgba(16, 185, 129, 0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '1px solid rgba(16, 185, 129, 0.2)'
                          }}>
                            <EventIcon sx={{ color: '#10B981' }} />
                          </Box>
                          <Box>
                            <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '0.95rem' }}>
                              {event.title}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: 600 }}>
                              {event.event_type}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.2 }}>
                            <CalendarTodayIcon sx={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }} />
                            <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.82rem', fontWeight: 500 }}>
                              {format(new Date(event.start_date), 'MMM dd, yyyy')}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AccessTimeIcon sx={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }} />
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                              {format(new Date(event.start_date), 'h:mm a')}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
                          <LocationOnIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', mt: 0.3 }} />
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
                            {event.location || 'Remote/Online'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: '0.85rem' }}>
                            {event.profiles?.first_name} {event.profiles?.last_name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                            {event.profiles?.email}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={event.status.toUpperCase()}
                          size="small"
                          sx={{
                            background: 
                              event.status === 'completed' ? 'rgba(16, 185, 129, 0.15)' :
                              event.status === 'planning' ? 'rgba(59, 130, 246, 0.15)' :
                              event.status === 'confirmed' ? 'rgba(139, 92, 246, 0.15)' :
                              'rgba(239, 68, 68, 0.15)',
                            color: 
                              event.status === 'completed' ? '#34D399' :
                              event.status === 'planning' ? '#60A5FA' :
                              event.status === 'confirmed' ? '#A78BFA' :
                              '#FCA5A5',
                            fontWeight: 800,
                            borderRadius: '6px',
                            fontSize: '0.6rem',
                            letterSpacing: '0.05em'
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="View Full Metrics">
                          <IconButton
                            onClick={() => handleViewDetails(event)}
                            sx={{ color: '#8B5CF6', '&:hover': { background: 'rgba(139, 92, 246, 0.1)' } }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {event.status !== 'cancelled' && event.status !== 'completed' && (
                          <Tooltip title="Cancel Event">
                            <IconButton
                              onClick={() => handleDeleteClick(event)}
                              sx={{ color: '#EF4444', '&:hover': { background: 'rgba(239, 68, 68, 0.1)' } }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 12, border: 'none' }}>
                      <Box
                        component={motion.div}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        sx={{ textAlign: 'center' }}
                      >
                        <Box sx={{ 
                          width: 80, height: 80, 
                          borderRadius: '50%', 
                          background: 'rgba(236, 72, 153, 0.1)', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          mx: 'auto', mb: 3,
                          color: '#F472B6'
                        }}>
                          <EventIcon sx={{ fontSize: 40 }} />
                        </Box>
                        <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                          Zero Events Found
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.4)', maxWidth: 400, mx: 'auto' }}>
                          There are currently no events matching your criteria. This might be a great time to check the database connections.
                        </Typography>
                        <Button
                          variant="text"
                          startIcon={<RefreshIcon />}
                          onClick={() => fetchEvents()}
                          sx={{ mt: 3, color: '#F472B6', fontWeight: 700 }}
                        >
                          Refresh Events List
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Event Details Dialog */}
      <Dialog open={detailsDialogOpen} onClose={() => setDetailsDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Event Details
        </DialogTitle>
        <DialogContent>
          {currentEvent && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {/* Event Overview */}
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="h5">
                          {currentEvent.title}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                          {currentEvent.event_type}
                        </Typography>
                      </Box>
                      <Chip
                        label={currentEvent.status.toUpperCase()}
                        color={getStatusColor(currentEvent.status)}
                      />
                    </Box>

                    <Grid container spacing={2} sx={{ mt: 2 }}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Date & Time
                        </Typography>
                        <Typography variant="body1">
                          {format(new Date(currentEvent.start_date), 'EEEE, MMMM d, yyyy')}
                        </Typography>
                        <Typography variant="body2">
                          {format(new Date(currentEvent.start_date), 'h:mm a')} -
                          {currentEvent.end_date ? format(new Date(currentEvent.end_date), 'h:mm a') : 'Not specified'}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Location
                        </Typography>
                        <Typography variant="body1">
                          {currentEvent.location || 'No location specified'}
                        </Typography>
                        <Typography variant="body2">
                          {currentEvent.address ? (
                            <>
                              {currentEvent.address}<br />
                              {currentEvent.city}{currentEvent.state ? `, ${currentEvent.state}` : ''} {currentEvent.zip_code}
                            </>
                          ) : (
                            'No address specified'
                          )}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Organizer
                        </Typography>
                        <Typography variant="body1">
                          {currentEvent.profiles?.first_name} {currentEvent.profiles?.last_name}
                        </Typography>
                        <Typography variant="body2">
                          {currentEvent.profiles?.email}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Budget
                        </Typography>
                        <Typography variant="body1">
                          ${currentEvent.budget ? currentEvent.budget.toFixed(2) : '0.00'}
                        </Typography>
                        <Typography variant="body2">
                          {eventDetails.budget.length} budget items
                        </Typography>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Description
                        </Typography>
                        <Typography variant="body1">
                          {currentEvent.description || 'No description provided'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Event Stats */}
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  {/* Tasks */}
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h6">
                            Tasks
                          </Typography>
                          <Chip
                            label={`${eventDetails.tasks.filter(task => task.status === 'completed').length}/${eventDetails.tasks.length}`}
                            color="primary"
                            size="small"
                          />
                        </Box>

                        <Box>
                          <Typography variant="body2">
                            Completed: {eventDetails.tasks.filter(task => task.status === 'completed').length}
                          </Typography>
                          <Typography variant="body2">
                            In Progress: {eventDetails.tasks.filter(task => task.status === 'in_progress').length}
                          </Typography>
                          <Typography variant="body2">
                            Pending: {eventDetails.tasks.filter(task => task.status === 'pending').length}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Guests */}
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h6">
                            Guests
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PeopleIcon sx={{ mr: 0.5 }} />
                            <Typography>{eventDetails.guests.length}</Typography>
                          </Box>
                        </Box>

                        <Box>
                          <Typography variant="body2">
                            Confirmed: {eventDetails.guests.filter(guest => guest.rsvp_status.toLowerCase() === 'confirmed').length}
                          </Typography>
                          <Typography variant="body2">
                            Declined: {eventDetails.guests.filter(guest => guest.rsvp_status.toLowerCase() === 'declined').length}
                          </Typography>
                          <Typography variant="body2">
                            Pending: {eventDetails.guests.filter(guest =>
                              guest.rsvp_status.toLowerCase() === 'pending' ||
                              guest.rsvp_status.toLowerCase() === 'maybe'
                            ).length}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Budget */}
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h6">
                            Budget
                          </Typography>
                          <Typography variant="h6" color="primary">
                            ${currentEvent.budget ? currentEvent.budget.toFixed(2) : '0.00'}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="body2">
                            Estimated: ${eventDetails.budget.reduce((sum, item) => sum + parseFloat(item.estimated_cost || 0), 0).toFixed(2)}
                          </Typography>
                          <Typography variant="body2">
                            Actual: ${eventDetails.budget.reduce((sum, item) => sum + parseFloat(item.actual_cost || 0), 0).toFixed(2)}
                          </Typography>
                          <Typography variant="body2">
                            Paid: ${eventDetails.budget.filter(item => item.is_paid).reduce((sum, item) => sum + parseFloat(item.actual_cost || item.estimated_cost || 0), 0).toFixed(2)}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
          {currentEvent && currentEvent.status !== 'cancelled' && currentEvent.status !== 'completed' && (
            <Button
              onClick={() => {
                setDetailsDialogOpen(false);
                handleDeleteClick(currentEvent);
              }}
              color="error"
            >
              Cancel Event
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Cancellation</DialogTitle>
        <DialogContent>
          <Typography paragraph>
            Are you sure you want to cancel the event "{currentEvent?.title}"?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This will mark the event as cancelled and notify all participants.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>No, Keep Event</Button>
          <Button onClick={handleDeleteEvent} color="error">
            Yes, Cancel Event
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default ManageEventsPage;