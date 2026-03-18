import { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Card, CardContent, Button, Chip, 
  TextField, MenuItem, IconButton, Avatar, InputAdornment, Fade, Zoom, Slide
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';
import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EditIcon from '@mui/icons-material/Edit';
import LaunchIcon from '@mui/icons-material/Launch';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { api } from '../../lib/api';

const glass = {
  background: 'rgba(255, 255, 255, 0.04)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '24px',
};

const EventsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filterOptions = [
    { value: 'all', label: 'All Events', color: '#8B5CF6' },
    { value: 'planning', label: 'Planning', color: '#F59E0B' },
    { value: 'confirmed', label: 'Confirmed', color: '#10B981' },
    { value: 'completed', label: 'Completed', color: '#6B7280' },
  ];

  useEffect(() => {
    loadEvents();
  }, [user]);

  const loadEvents = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const result = await api.get('/events');
      if (result.success) {
        setEvents(result.data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || event.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    const colors = {
      planning: { main: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)', glow: 'rgba(245, 158, 11, 0.3)' },
      confirmed: { main: '#10B981', bg: 'rgba(16, 185, 129, 0.15)', glow: 'rgba(16, 185, 129, 0.3)' },
      completed: { main: '#6B7280', bg: 'rgba(107, 114, 128, 0.15)', glow: 'rgba(107, 114, 128, 0.3)' },
      cancelled: { main: '#EF4444', bg: 'rgba(239, 68, 68, 0.15)', glow: 'rgba(239, 68, 68, 0.3)' },
    };
    return colors[status] || colors.planning;
  };

  const getEventIcon = (type) => {
    const icons = {
      wedding: '💒',
      birthday: '🎂',
      corporate: '💼',
      conference: '🎤',
      graduation: '🎓',
      anniversary: '💝',
      holiday: '🎄',
    };
    return icons[type?.toLowerCase()] || '🎉';
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #0d1117 0%, #1a0533 55%, #0d1117 100%)',
      p: { xs: 2, sm: 3, md: 4, lg: 6 },
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated Background Grid */}
      <Box sx={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.03) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        animation: 'gridMove 20s linear infinite',
        '@keyframes gridMove': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '60px 60px' }
        },
        pointerEvents: 'none', zIndex: 0
      }} />

      {/* Floating Orbs */}
      {[
        { w: 600, h: 600, t: -100, l: -200, c: 'rgba(139, 92, 246, 0.12)', delay: 0 },
        { w: 400, h: 400, b: 100, r: -50, c: 'rgba(59, 130, 246, 0.08)', delay: 2 },
        { w: 300, h: 300, t: '50%', l: '50%', c: 'rgba(236, 72, 153, 0.06)', delay: 4 },
      ].map((orb, i) => (
        <Box key={i} sx={{
          position: 'absolute', width: orb.w, height: orb.h, 
          top: orb.t, left: orb.l, right: orb.r, bottom: orb.b,
          background: orb.c, borderRadius: '50%', filter: 'blur(100px)',
          animation: `float 8s ease-in-out infinite ${orb.delay}s`,
          '@keyframes float': {
            '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
            '50%': { transform: 'translate(30px, -30px) scale(1.1)' }
          },
          pointerEvents: 'none', zIndex: 0
        }} />
      ))}

      <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 1400, mx: 'auto' }}>
        {/* Header with Slide Animation */}
        <Slide direction="down" in timeout={600}>
          <Box sx={{ mb: 6 }}>
            <Grid container justifyContent="space-between" alignItems="center" spacing={3}>
              <Grid item xs={12} md={7}>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Typography variant="h2" sx={{ 
                    fontWeight: 900, mb: 1, letterSpacing: '-0.02em',
                    background: 'linear-gradient(90deg, #fff, rgba(255,255,255,0.7))',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    fontSize: { xs: '2rem', md: '3rem' }
                  }}>
                    My Events
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500, fontSize: '1.1rem' }}>
                    {events.length} event{events.length !== 1 ? 's' : ''} in your timeline
                  </Typography>
                </motion.div>
              </Grid>
              <Grid item xs={12} md={5} sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/user/create-event')}
                    sx={{
                      background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                      px: 4, py: 1.8, borderRadius: '16px', fontWeight: 800, textTransform: 'none', fontSize: '1rem',
                      boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
                      transition: 'all 0.3s ease',
                      '&:hover': { 
                        boxShadow: '0 12px 40px rgba(139, 92, 246, 0.5)',
                        background: 'linear-gradient(135deg, #9F7AEA, #F472B6)',
                      },
                    }}
                  >
                    Create Event
                  </Button>
                </motion.div>
              </Grid>
            </Grid>
          </Box>
        </Slide>

        {/* Search and Filter Bar */}
        <Zoom in timeout={800}>
          <Box sx={{ ...glass, p: 3, mb: 5 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '16px',
                      background: 'rgba(255,255,255,0.03)',
                      color: 'white',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                      '&.Mui-focused fieldset': { borderColor: '#8B5CF6' },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {filterOptions.map((filter, index) => (
                    <motion.div
                      key={filter.value}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Chip
                        label={filter.label}
                        onClick={() => setSelectedFilter(filter.value)}
                        sx={{
                          background: selectedFilter === filter.value 
                            ? `linear-gradient(135deg, ${filter.color}, ${filter.color}dd)`
                            : 'rgba(255,255,255,0.05)',
                          color: 'white',
                          fontWeight: 700,
                          px: 2,
                          py: 2.5,
                          borderRadius: '12px',
                          border: selectedFilter === filter.value 
                            ? `1px solid ${filter.color}`
                            : '1px solid rgba(255,255,255,0.1)',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: `${filter.color}33`,
                            transform: 'translateY(-2px)',
                          },
                        }}
                      />
                    </motion.div>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Zoom>

        {/* Events Grid */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
            <Box sx={{ 
              width: 60, height: 60, borderRadius: '50%',
              border: '4px solid rgba(139, 92, 246, 0.2)',
              borderTopColor: '#8B5CF6',
              animation: 'spin 1s linear infinite',
              '@keyframes spin': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } }
            }} />
          </Box>
        ) : filteredEvents.length === 0 ? (
          <Fade in timeout={600}>
            <Box sx={{ ...glass, p: 8, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ color: 'white', mb: 2, fontWeight: 700 }}>
                {searchQuery || selectedFilter !== 'all' ? 'No events found' : 'No events yet'}
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', mb: 4 }}>
                {searchQuery || selectedFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Create your first event to get started'}
              </Typography>
              {!searchQuery && selectedFilter === 'all' && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/user/create-event')}
                  sx={{
                    background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                    px: 4, py: 1.5, borderRadius: '12px', fontWeight: 700, textTransform: 'none',
                  }}
                >
                  Create Your First Event
                </Button>
              )}
            </Box>
          </Fade>
        ) : (
          <Grid container spacing={3}>
            <AnimatePresence>
              {filteredEvents.map((event, index) => {
                const statusColor = getStatusColor(event.status);
                return (
                  <Grid item xs={12} sm={6} lg={4} key={event._id || event.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      whileHover={{ y: -8, transition: { duration: 0.2 } }}
                    >
                      <Card sx={{
                        ...glass,
                        height: '100%',
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: `0 20px 60px ${statusColor.glow}`,
                          border: `1px solid ${statusColor.main}40`,
                        },
                        '&:hover .event-actions': {
                          opacity: 1,
                          transform: 'translateY(0)',
                        },
                      }}>
                        {/* Status Indicator */}
                        <Box sx={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          zIndex: 2,
                        }}>
                          <Chip
                            label={event.status?.toUpperCase()}
                            size="small"
                            sx={{
                              background: statusColor.bg,
                              color: statusColor.main,
                              fontWeight: 800,
                              fontSize: '0.7rem',
                              border: `1px solid ${statusColor.main}40`,
                              boxShadow: `0 4px 12px ${statusColor.glow}`,
                            }}
                          />
                        </Box>

                        <CardContent sx={{ p: 3 }}>
                          {/* Event Icon */}
                          <Box sx={{
                            width: 60,
                            height: 60,
                            borderRadius: '16px',
                            background: `linear-gradient(135deg, ${statusColor.main}20, ${statusColor.main}10)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 3,
                            fontSize: '2rem',
                          }}>
                            {getEventIcon(event.eventType)}
                          </Box>

                          {/* Event Title */}
                          <Typography variant="h6" sx={{
                            color: 'white',
                            fontWeight: 700,
                            mb: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}>
                            {event.title}
                          </Typography>

                          {/* Event Type */}
                          <Typography variant="caption" sx={{
                            color: statusColor.main,
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            display: 'block',
                            mb: 3,
                          }}>
                            {event.eventType}
                          </Typography>

                          {/* Event Details */}
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CalendarTodayIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.5)' }} />
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                {event.startDate ? format(new Date(event.startDate), 'MMM dd, yyyy') : 'Date TBD'}
                              </Typography>
                            </Box>

                            {event.location && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LocationOnIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.5)' }} />
                                <Typography variant="body2" sx={{ 
                                  color: 'rgba(255,255,255,0.7)',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}>
                                  {event.location}
                                </Typography>
                              </Box>
                            )}

                            {event.estimatedGuests && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PeopleIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.5)' }} />
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                  {event.estimatedGuests} guests
                                </Typography>
                              </Box>
                            )}
                          </Box>

                          {/* Action Buttons */}
                          <Box
                            className="event-actions"
                            sx={{
                              display: 'flex',
                              gap: 1,
                              mt: 3,
                              pt: 3,
                              borderTop: '1px solid rgba(255,255,255,0.05)',
                              opacity: 0,
                              transform: 'translateY(10px)',
                              transition: 'all 0.3s ease',
                            }}
                          >
                            <Button
                              fullWidth
                              variant="outlined"
                              startIcon={<LaunchIcon />}
                              onClick={() => navigate(`/user/events/${event._id || event.id}`)}
                              sx={{
                                borderColor: 'rgba(255,255,255,0.1)',
                                color: 'white',
                                borderRadius: '12px',
                                textTransform: 'none',
                                fontWeight: 600,
                                '&:hover': {
                                  borderColor: statusColor.main,
                                  background: statusColor.bg,
                                },
                              }}
                            >
                              View
                            </Button>
                            <IconButton
                              onClick={() => navigate(`/user/events/${event._id || event.id}/edit`)}
                              sx={{
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                color: 'white',
                                '&:hover': {
                                  borderColor: statusColor.main,
                                  background: statusColor.bg,
                                },
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                );
              })}
            </AnimatePresence>
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default EventsPage;
