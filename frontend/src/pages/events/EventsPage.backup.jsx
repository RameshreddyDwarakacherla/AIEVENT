import { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Card, CardContent, Button, Chip, 
  TextField, MenuItem, IconButton, Avatar, InputAdornment 
} from '@mui/material';
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
import CelebrationIcon from '@mui/icons-material/Celebration';

import { api } from '../../lib/api';

/* ── shared glass style ── */
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
  const [filters, setFilters] = useState({
    eventType: 'all',
    status: 'all'
  });

  const eventTypes = ['all', 'wedding', 'corporate', 'birthday', 'conference', 'party', 'seminar', 'workshop', 'other'];
  const statusTypes = ['all', 'planning', 'confirmed', 'ongoing', 'completed', 'cancelled'];

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
      } else {
        console.error('Failed to load events', result.message);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    const typeMatch = filters.eventType === 'all' || event.eventType === filters.eventType;
    const statusMatch = filters.status === 'all' || event.status === filters.status;
    return typeMatch && statusMatch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'planning': return { main: '#F59E0B', bg: 'rgba(245, 158, 11, 0.15)' };
      case 'confirmed': return { main: '#10B981', bg: 'rgba(16, 185, 129, 0.15)' };
      case 'ongoing': return { main: '#3B82F6', bg: 'rgba(59, 130, 246, 0.15)' };
      case 'completed': return { main: '#6B7280', bg: 'rgba(107, 114, 128, 0.15)' };
      case 'cancelled': return { main: '#EF4444', bg: 'rgba(239, 68, 68, 0.15)' };
      default: return { main: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.15)' };
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #0d1117 0%, #1a0533 55%, #0d1117 100%)',
      p: { xs: 2, sm: 3, md: 4, lg: 6 },
      position: 'relative',
      overflow: 'hidden',
      color: 'white',
      fontFamily: '"Inter", sans-serif'
    }}>
      {/* Immersive Background Effects */}
      <Box sx={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.03) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        pointerEvents: 'none', zIndex: 0
      }} />
      {[
        { w: 600, h: 600, t: -100, l: -200, c: 'rgba(139, 92, 246, 0.12)' },
        { w: 400, h: 400, b: 100, r: -50, c: 'rgba(59, 130, 246, 0.08)' },
      ].map((o, i) => (
        <Box key={i} sx={{
          position: 'absolute', width: o.w, height: o.h, top: o.t, left: o.l, right: o.r, bottom: o.b,
          background: o.c, borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0
        }} />
      ))}

      {loading ? (
        <Box sx={{ position: 'relative', zIndex: 1, minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box sx={{ width: 60, height: 60, borderRadius: '50%', border: '4px solid rgba(139, 92, 246, 0.2)', borderTopColor: '#8B5CF6', animation: 'spin 1s linear infinite', '@keyframes spin': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } } }} />
        </Box>
      ) : (
      <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 1400, mx: 'auto' }}>
        {/* Modern Header Sequence */}
        <Box sx={{ 
          mb: 6,
          animation: 'fadeInDown 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          '@keyframes fadeInDown': { from: { opacity: 0, transform: 'translateY(-20px)' }, to: { opacity: 1, transform: 'translateY(0)' } }
        }}>
          <Grid container justifyContent="space-between" alignItems="center" spacing={3}>
            <Grid item xs={12} md={7}>
              <Typography variant="h2" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #fff, rgba(255,255,255,0.7))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Master Timeline
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 500, fontSize: '1.1rem' }}>
                Orchestrating {events.length} active event{events.length === 1 ? '' : 's'} globally
              </Typography>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/events/create')}
                sx={{
                  background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                  px: 4, py: 1.8, borderRadius: '16px', fontWeight: 800, textTransform: 'none', fontSize: '1rem',
                  boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 40px rgba(139, 92, 246, 0.5)' },
                }}
              >
                Initialize Event
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Filter Navigation Engine */}
        <Box sx={{ 
          mb: 5, p: 1, ...glass, display: 'inline-flex', flexWrap: 'wrap', gap: 2,
          animation: 'fadeIn 0.6s ease-out 0.2s both',
          '@keyframes fadeIn': { from: { opacity: 0 }, to: { opacity: 1 } }
        }}>
           <TextField
            select
            value={filters.eventType}
            onChange={(e) => setFilters({ ...filters, eventType: e.target.value })}
            sx={{
              minWidth: 200,
              '& .MuiOutlinedInput-root': {
                color: 'white', borderRadius: '16px', background: 'rgba(255,255,255,0.03)',
                '& fieldset': { border: 'none' },
                '&:hover': { background: 'rgba(255,255,255,0.08)' }
              },
              '& .MuiSelect-icon': { color: 'rgba(255,255,255,0.5)' }
            }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'rgba(255,255,255,0.4)' }}/></InputAdornment> }}
          >
            {eventTypes.map((type) => (
              <MenuItem key={type} value={type} sx={{ py: 1.5, textTransform: 'capitalize', fontWeight: 600 }}>
                 {type === 'all' ? 'All Archetypes' : type}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            sx={{
              minWidth: 200,
              '& .MuiOutlinedInput-root': {
                color: 'white', borderRadius: '16px', background: 'rgba(255,255,255,0.03)',
                '& fieldset': { border: 'none' },
                '&:hover': { background: 'rgba(255,255,255,0.08)' }
              },
              '& .MuiSelect-icon': { color: 'rgba(255,255,255,0.5)' }
            }}
          >
            {statusTypes.map((status) => (
              <MenuItem key={status} value={status} sx={{ py: 1.5, textTransform: 'capitalize', fontWeight: 600 }}>
                {status === 'all' ? 'All Vectors' : status}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {/* Data Grid Matrix */}
        {filteredEvents.length > 0 ? (
          <Grid container spacing={4}>
            {filteredEvents.map((event, index) => {
              const statusColors = getStatusColor(event.status);
              
              return (
                <Grid item xs={12} sm={6} lg={4} key={event.id}>
                  <Card
                    sx={{
                      ...glass,
                      display: 'flex', flexDirection: 'column', height: '100%',
                      animation: `zoomIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s both`,
                      '@keyframes zoomIn': { from: { opacity: 0, transform: 'scale(0.95) translateY(20px)' }, to: { opacity: 1, transform: 'scale(1) translateY(0)' } },
                      '&:hover': {
                        transform: 'translateY(-10px)',
                        boxShadow: `0 20px 40px ${statusColors.bg}`,
                        borderColor: 'rgba(255,255,255,0.2)',
                        '& .event-avatar': { transform: 'scale(1.1) rotate(5deg)' }
                      }
                    }}
                  >
                    <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      {/* Top Bar */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                        <Avatar
                          className="event-avatar"
                          sx={{
                            width: 64, height: 64, borderRadius: '18px',
                            background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6',
                            border: '1px solid rgba(139, 92, 246, 0.3)',
                            transition: 'all 0.4s ease'
                          }}
                        >
                          <EventIcon fontSize="large" />
                        </Avatar>
                        <Chip
                          label={event.status}
                          size="small"
                          sx={{
                            background: statusColors.bg, color: statusColors.main,
                            fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em',
                            border: `1px solid ${statusColors.main}40`, borderRadius: '8px'
                          }}
                        />
                      </Box>

                      {/* Event Core Info */}
                      <Typography variant="h5" sx={{ fontWeight: 800, color: 'white', mb: 1, lineHeight: 1.3 }}>
                        {event.title}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                         <Chip
                           label={event.eventType}
                           size="small"
                           sx={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', fontWeight: 700, textTransform: 'capitalize' }}
                         />
                      </Box>

                      {/* Micro Details Matrix */}
                      <Box sx={{ mb: 'auto', p: 2, background: 'rgba(0,0,0,0.2)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
                          <CalendarTodayIcon sx={{ fontSize: 18, color: '#A78BFA', mt: 0.3 }} />
                          <Box>
                             <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 800 }}>Operation Date</Typography>
                             <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>{format(new Date(event.startDate), 'MMMM dd, yyyy')}</Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
                          <LocationOnIcon sx={{ fontSize: 18, color: '#F472B6', mt: 0.3 }} />
                           <Box>
                             <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 800 }}>Coordinates</Typography>
                             <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{event.location}</Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                          <PeopleIcon sx={{ fontSize: 18, color: '#34D399', mt: 0.3 }} />
                          <Box>
                             <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 800 }}>Capacity</Typography>
                             <Typography sx={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>{event.estimatedGuests} attendees</Typography>
                          </Box>
                        </Box>
                      </Box>

                      {/* Action Triggers */}
                      <Box sx={{ display: 'flex', gap: 1.5, mt: 4 }}>
                        <Button
                          fullWidth
                          onClick={() => navigate(`/events/${event.id}`)}
                          sx={{
                            background: 'rgba(255,255,255,0.05)', color: 'white', py: 1.5, borderRadius: '12px', fontWeight: 800, textTransform: 'none',
                            '&:hover': { background: 'white', color: '#0d1117' }
                          }}
                        >
                          Access Matrix
                        </Button>
                        <IconButton
                          sx={{ ...glass, border: '1px solid rgba(255,255,255,0.1)', color: 'white', '&:hover': { background: 'rgba(139, 92, 246, 0.2)', color: '#8B5CF6' } }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Card sx={{ ...glass, p: { xs: 4, md: 8 }, textAlign: 'center', maxWidth: 600, mx: 'auto', mt: 8 }}>
            <Box sx={{ position: 'relative', display: 'inline-flex', mb: 4 }}>
                <Box sx={{ position: 'absolute', inset: -20, background: 'rgba(139, 92, 246, 0.2)', borderRadius: '50%', filter: 'blur(30px)' }} />
                <CelebrationIcon sx={{ fontSize: 80, color: 'white', position: 'relative' }} />
            </Box>
            <Typography variant="h4" sx={{ color: 'white', mb: 2, fontWeight: 900 }}>
              Universe of emptiness here.
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)', mb: 5, fontSize: '1.1rem' }}>
              {filters.eventType !== 'all' || filters.status !== 'all'
                ? 'Your filtering matrix yielded zero results. Adjust the parameters.'
                : 'You have not initialized any event parameters yet. Start orchestrating today.'}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/events/create')}
              sx={{
                background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', px: 5, py: 2, borderRadius: '16px', fontWeight: 900, fontSize: '1.1rem',
                textTransform: 'none', boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4)'
              }}
            >
              Initialize Paradigm
            </Button>
          </Card>
        )}
      </Box>
      )}
    </Box>
  );
};

export default EventsPage;
