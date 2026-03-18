import { useState } from 'react';
import { Box, Typography, Button, Stepper, Step, StepLabel, Paper, Grid, TextField, MenuItem, InputAdornment, Alert, CircularProgress, Fade, Slide, Zoom } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';
import { toast } from 'react-toastify';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

/* ── shared glass style ── */
const glass = {
  background: 'rgba(255, 255, 255, 0.04)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '24px',
};

const glassInputStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '16px', 
    background: 'linear-gradient(135deg, #87CEEB, #B0E0E6)', // Sky blue gradient background
    color: '#1a1a1a', // Dark text for contrast
    border: '2px solid rgba(139, 92, 246, 0.3)',
    '& fieldset': { border: 'none' }, // Remove default border
    '&:hover': { 
      background: 'linear-gradient(135deg, #7EC8E3, #A8D8EA)',
      borderColor: '#8B5CF6',
      boxShadow: '0 4px 12px rgba(135, 206, 235, 0.3)'
    },
    '&.Mui-focused': { 
      background: 'linear-gradient(135deg, #7EC8E3, #A8D8EA)',
      borderColor: '#8B5CF6', 
      borderWidth: '2px',
      boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.2)'
    },
  },
  '& .MuiInputLabel-root': { 
    color: '#8B5CF6', 
    fontWeight: 700,
    fontSize: '1rem'
  },
  '& .MuiInputLabel-root.Mui-focused': { 
    color: '#8B5CF6', 
    fontWeight: 800 
  },
  '& .MuiSvgIcon-root': { 
    color: '#8B5CF6' 
  },
  '& .MuiInputBase-input': { 
    color: '#1a1a1a !important', 
    fontWeight: 600,
    fontSize: '1.1rem'
  },
  '& .MuiInputBase-input::placeholder': { 
    color: 'rgba(26, 26, 26, 0.6)', 
    opacity: 1 
  },
  '& .MuiInputAdornment-root .MuiSvgIcon-root': {
    color: '#8B5CF6'
  }
};

const eventTypes = [
  { value: 'wedding', label: 'Wedding', icon: '💒', color: '#FF6B9D', bg: 'rgba(255, 107, 157, 0.1)' },
  { value: 'birthday', label: 'Birthday', icon: '🎂', color: '#FFA726', bg: 'rgba(255, 167, 38, 0.1)' },
  { value: 'corporate', label: 'Corporate', icon: '💼', color: '#42A5F5', bg: 'rgba(66, 165, 245, 0.1)' },
  { value: 'conference', label: 'Conference', icon: '🎤', color: '#AB47BC', bg: 'rgba(171, 71, 188, 0.1)' },
  { value: 'graduation', label: 'Graduation', icon: '🎓', color: '#66BB6A', bg: 'rgba(102, 187, 106, 0.1)' },
  { value: 'anniversary', label: 'Anniversary', icon: '💝', color: '#EC407A', bg: 'rgba(236, 64, 122, 0.1)' },
  { value: 'holiday', label: 'Holiday', icon: '🎄', color: '#EF5350', bg: 'rgba(239, 83, 80, 0.1)' },
  { value: 'other', label: 'Other', icon: '🎉', color: '#26C6DA', bg: 'rgba(38, 198, 218, 0.1)' }
];

const CreateEventPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  // Event details
  const [eventData, setEventData] = useState({
    title: '', description: '', event_type: '',
    start_date: null, end_date: null,
    location: '', address: '', city: '', state: '', zip_code: '',
    estimated_guests: '', budget: '', is_public: false
  });

  const steps = [
    { label: 'Basic Information', icon: <EventIcon /> },
    { label: 'Date & Location', icon: <CalendarTodayIcon /> },
    { label: 'Guest & Budget Details', icon: <PeopleIcon /> }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEventData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setError('');
  };

  const handleDateChange = (name, date) => {
    setEventData(prev => ({ ...prev, [name]: date }));
    setError('');
  };

  const validateCurrentStep = () => {
    setError('');
    if (activeStep === 0) {
      if (!eventData.title || !eventData.event_type) { setError('Please fill in all required fields'); return false; }
    } else if (activeStep === 1) {
      if (!eventData.start_date || !eventData.end_date || !eventData.location) { setError('Please fill in all required fields'); return false; }
      if (eventData.start_date >= eventData.end_date) { setError('End date must be after start date'); return false; }
    } else if (activeStep === 2) {
      if (!eventData.estimated_guests) { setError('Please enter estimated number of guests'); return false; }
    }
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) setActiveStep(prev => prev + 1);
  };
  const handleBack = () => {
    setActiveStep(prev => prev - 1); setError('');
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;
    setLoading(true); setError('');

    try {
      if (!user) throw new Error('You must be logged in to create an event');

      const typeMapping = {
        'wedding': 'Wedding', 'birthday': 'Birthday', 'corporate': 'Corporate',
        'conference': 'Conference', 'graduation': 'Graduation', 'anniversary': 'Anniversary', 
        'holiday': 'Holiday', 'other': 'Other'
      };

      const eventPayload = {
        title: eventData.title,
        description: eventData.description,
        eventType: typeMapping[eventData.event_type] || 'Other',
        startDate: eventData.start_date?.toISOString(),
        endDate: eventData.end_date?.toISOString(),
        location: eventData.location,
        address: eventData.address,
        city: eventData.city,
        state: eventData.state,
        zipCode: eventData.zip_code,
        estimatedGuests: parseInt(eventData.estimated_guests) || 0,
        budget: parseInt(eventData.budget) || 0,
        status: 'planning',
        isPublic: eventData.is_public || false
      };

      const response = await api.post('/events', eventPayload);

      if (!response.success) {
        throw new Error(response.message || 'Failed to initialize event sequence');
      }

      setShowConfetti(true);
      toast.success('Event initialized into the matrix!');
      
      // Delay navigation to show confetti
      setTimeout(() => {
        navigate('/events'); 
      }, 3500);

    } catch (err) {
      console.error('Error creating event:', err);
      setError(err.message || 'Failed to initialize event sequence.');
      toast.error('Initialization failed');
    } finally {
      if(!showConfetti) setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Fade in timeout={600}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <TextField
                  fullWidth label="Event Designation (Title)" name="title" value={eventData.title} onChange={handleChange}
                  required placeholder="e.g., Summer Wedding 2024"
                  InputProps={{ startAdornment: ( <InputAdornment position="start"><EventIcon /></InputAdornment> ) }}
                  sx={glassInputStyles}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="overline" sx={{ mb: 2, display: 'block', fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>
                  Select Event Archetype
                </Typography>
                <Grid container spacing={2}>
                  {eventTypes.map((type, index) => (
                    <Grid item xs={6} sm={4} md={3} key={type.value}>
                      <Zoom in timeout={300 + index * 50}>
                        <Paper
                          onClick={() => handleChange({ target: { name: 'event_type', value: type.value } })}
                          sx={{
                            ...glass, p: 2, textAlign: 'center', cursor: 'pointer',
                            border: eventData.event_type === type.value ? `2px solid ${type.color}` : '1px solid rgba(255,255,255,0.05)',
                            background: eventData.event_type === type.value ? type.bg : 'rgba(255,255,255,0.02)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': { transform: 'translateY(-5px)', background: type.bg, border: `1px solid ${type.color}80` }
                          }}
                        >
                          <Typography variant="h3" sx={{ mb: 1, filter: eventData.event_type === type.value ? `drop-shadow(0 0 10px ${type.color})` : 'none' }}>
                            {type.icon}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: eventData.event_type === type.value ? 800 : 500, color: eventData.event_type === type.value ? type.color : 'rgba(255,255,255,0.6)' }}>
                            {type.label}
                          </Typography>
                        </Paper>
                      </Zoom>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth label="Configuration Details (Description)" name="description" value={eventData.description} onChange={handleChange}
                  multiline rows={4} placeholder="Detail the specific parameters for this event..."
                  InputProps={{ startAdornment: ( <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 2 }}><DescriptionIcon /></InputAdornment> ) }}
                  sx={glassInputStyles}
                />
              </Grid>
            </Grid>
          </Fade>
        );

      case 1:
        return (
          <Fade in timeout={600}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="Initialization Timestamp (Start)" value={eventData.start_date} onChange={(date) => handleDateChange('start_date', date)}
                    renderInput={(params) => <TextField {...params} fullWidth required sx={glassInputStyles} />}
                    sx={{
                      width: '100%',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '16px', 
                        background: 'linear-gradient(135deg, #87CEEB, #B0E0E6)',
                        color: '#1a1a1a',
                        border: '2px solid rgba(139, 92, 246, 0.3)',
                        '& fieldset': { border: 'none' },
                        '&:hover': { 
                          background: 'linear-gradient(135deg, #7EC8E3, #A8D8EA)',
                          borderColor: '#8B5CF6',
                          boxShadow: '0 4px 12px rgba(135, 206, 235, 0.3)'
                        },
                        '&.Mui-focused': { 
                          background: 'linear-gradient(135deg, #7EC8E3, #A8D8EA)',
                          borderColor: '#8B5CF6', 
                          borderWidth: '2px',
                          boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.2)'
                        },
                      },
                      '& .MuiInputLabel-root': { 
                        color: '#8B5CF6', 
                        fontWeight: 700 
                      },
                      '& .MuiInputLabel-root.Mui-focused': { 
                        color: '#8B5CF6' 
                      },
                      '& .MuiSvgIcon-root': { 
                        color: '#8B5CF6' 
                      },
                      '& .MuiInputBase-input': { 
                        color: '#1a1a1a !important', 
                        fontWeight: 600 
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="Termination Timestamp (End)" value={eventData.end_date} onChange={(date) => handleDateChange('end_date', date)}
                    renderInput={(params) => <TextField {...params} fullWidth required sx={glassInputStyles} />}
                    sx={{
                      width: '100%',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '16px', 
                        background: 'linear-gradient(135deg, #87CEEB, #B0E0E6)',
                        color: '#1a1a1a',
                        border: '2px solid rgba(139, 92, 246, 0.3)',
                        '& fieldset': { border: 'none' },
                        '&:hover': { 
                          background: 'linear-gradient(135deg, #7EC8E3, #A8D8EA)',
                          borderColor: '#8B5CF6',
                          boxShadow: '0 4px 12px rgba(135, 206, 235, 0.3)'
                        },
                        '&.Mui-focused': { 
                          background: 'linear-gradient(135deg, #7EC8E3, #A8D8EA)',
                          borderColor: '#8B5CF6', 
                          borderWidth: '2px',
                          boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.2)'
                        },
                      },
                      '& .MuiInputLabel-root': { 
                        color: '#8B5CF6', 
                        fontWeight: 700 
                      },
                      '& .MuiInputLabel-root.Mui-focused': { 
                        color: '#8B5CF6' 
                      },
                      '& .MuiSvgIcon-root': { 
                        color: '#8B5CF6' 
                      },
                      '& .MuiInputBase-input': { 
                        color: '#1a1a1a !important', 
                        fontWeight: 600 
                      },
                    }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth label="Primary Coordinate Node (Location Name)" name="location" value={eventData.location} onChange={handleChange}
                  required placeholder="e.g., Grand Ballroom, Central Park"
                  InputProps={{ startAdornment: ( <InputAdornment position="start"><LocationOnIcon /></InputAdornment> ) }}
                  sx={glassInputStyles}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth label="Street Address Vectors" name="address" value={eventData.address} onChange={handleChange} placeholder="123 Main Street" sx={glassInputStyles}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                 <TextField fullWidth label="City Node" name="city" value={eventData.city} onChange={handleChange} placeholder="New York" sx={glassInputStyles} />
              </Grid>
              <Grid item xs={12} sm={3}>
                 <TextField fullWidth label="State Region" name="state" value={eventData.state} onChange={handleChange} placeholder="NY" sx={glassInputStyles} />
              </Grid>
              <Grid item xs={12} sm={3}>
                 <TextField fullWidth label="ZIP Route" name="zip_code" value={eventData.zip_code} onChange={handleChange} placeholder="10001" sx={glassInputStyles} />
              </Grid>
            </Grid>
          </Fade>
        );

      case 2:
        return (
          <Fade in timeout={600}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Estimated Entity Count (Guests)" name="estimated_guests" type="number" value={eventData.estimated_guests} onChange={handleChange} required placeholder="100"
                  InputProps={{ startAdornment: ( <InputAdornment position="start"><PeopleIcon /></InputAdornment> ) }}
                  sx={glassInputStyles}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth label="Financial Allocation (Budget)" name="budget" type="number" value={eventData.budget} onChange={handleChange} placeholder="10000"
                  InputProps={{ startAdornment: ( <InputAdornment position="start"><AttachMoneyIcon /></InputAdornment> ) }}
                  sx={glassInputStyles}
                />
              </Grid>

              <Grid item xs={12}>
                <Paper sx={{ ...glass, p: 5, background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.05) 100%)', border: '1px solid rgba(139, 92, 246, 0.2)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                   <Box sx={{ position: 'absolute', top: -50, right: -50, width: 150, height: 150, background: 'rgba(139, 92, 246, 0.2)', filter: 'blur(50px)', borderRadius: '50%' }} />
                   
                   <CheckCircleOutlineIcon sx={{ fontSize: 60, color: '#A78BFA', mb: 2 }} />
                   
                  <Typography variant="h4" sx={{ mb: 2, fontWeight: 900, color: 'white' }}>
                    Sequence Validation Complete
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 4, color: 'rgba(255,255,255,0.6)', maxWidth: 500, mx: 'auto' }}>
                    Parameters have been locked. Initialize the event to add it to your master timeline matrix.
                  </Typography>
                  
                  <Box sx={{ background: 'rgba(0,0,0,0.3)', borderRadius: '16px', p: 3, display: 'inline-flex', gap: 6, border: '1px solid rgba(255,255,255,0.05)' }}>
                     <Box textAlign="left">
                        <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 800 }}>Archetype</Typography>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, textTransform: 'capitalize' }}>
                          {eventData.event_type || 'Unspecified'}
                        </Typography>
                     </Box>
                     <Box textAlign="left">
                        <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 800 }}>Capacity</Typography>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                          {eventData.estimated_guests ? `${eventData.estimated_guests} Entities` : 'Unknown'}
                        </Typography>
                     </Box>
                     {eventData.budget && (
                     <Box textAlign="left">
                        <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 800 }}>Allocation</Typography>
                        <Typography variant="h6" sx={{ color: '#34D399', fontWeight: 700 }}>
                          ${eventData.budget}
                        </Typography>
                     </Box>
                     )}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Fade>
        );

      default: return null;
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #0d1117 0%, #1a0533 55%, #0d1117 100%)',
      p: { xs: 2, sm: 4, md: 6 },
      position: 'relative',
      overflow: 'hidden',
      color: 'white',
      fontFamily: '"Inter", sans-serif'
    }}>
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={800} gravity={0.15} colors={['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B']} />}
      
      {/* Immersive Background Effects */}
      <Box sx={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.03) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none', zIndex: 0 }} />
      {[
        { w: 600, h: 600, t: -100, l: -200, c: 'rgba(139, 92, 246, 0.12)' },
        { w: 500, h: 500, b: -100, r: -100, c: 'rgba(236, 72, 153, 0.08)' },
      ].map((o, i) => (
        <Box key={i} sx={{ position: 'absolute', width: o.w, height: o.h, top: o.t, left: o.l, right: o.r, bottom: o.b, background: o.c, borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }} />
      ))}

      <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 1000, mx: 'auto' }}>
        {/* Header */}
        <Slide direction="down" in timeout={600}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h2" sx={{ color: 'white', fontWeight: 900, mb: 1, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #fff, rgba(255,255,255,0.7))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Initialize Event Sequence
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 400 }}>
              Define parameters for your next timeline execution
            </Typography>
          </Box>
        </Slide>

        {/* Stepper Navigation */}
        <Zoom in timeout={800}>
          <Paper sx={{ ...glass, p: 3, mb: 5, background: 'rgba(0,0,0,0.4)', borderRadius: '24px' }}>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ '& .MuiStepConnector-line': { borderColor: 'rgba(255,255,255,0.1)' } }}>
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel
                    StepIconComponent={() => (
                      <Box sx={{
                        width: 48, height: 48, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: activeStep >= index ? 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)' : 'rgba(255,255,255,0.05)',
                        color: activeStep >= index ? 'white' : 'rgba(255,255,255,0.3)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: activeStep === index ? 'scale(1.15)' : 'scale(1)',
                        boxShadow: activeStep === index ? '0 8px 24px rgba(139, 92, 246, 0.4)' : 'none',
                        border: activeStep >= index ? 'none' : '1px solid rgba(255,255,255,0.1)'
                      }}>
                        {step.icon}
                      </Box>
                    )}
                  >
                    <Typography sx={{ fontWeight: activeStep === index ? 800 : 500, color: activeStep >= index ? 'white' : 'rgba(255,255,255,0.4)', mt: 1.5, letterSpacing: '0.02em' }}>
                      {step.label}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>
        </Zoom>

        {/* Main Interface Form */}
        <Zoom in timeout={1000}>
          <Paper sx={{ ...glass, p: { xs: 3, md: 5 }, borderRadius: '32px', minHeight: 450, display: 'flex', flexDirection: 'column' }}>
            
            {error && (
              <Fade in>
                <Alert severity="error" sx={{ mb: 4, borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#FCA5A5', border: '1px solid rgba(239, 68, 68, 0.3)', '& .MuiAlert-icon': { color: '#F87171' } }}>
                  {error}
                </Alert>
              </Fade>
            )}

            <Box sx={{ flexGrow: 1 }}>
              {renderStepContent(activeStep)}
            </Box>

            {/* Navigation Flow Controls */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 6, pt: 3, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <Button
                onClick={handleBack} disabled={activeStep === 0 || showConfetti}
                sx={{
                  borderRadius: '16px', px: 4, py: 1.5, fontWeight: 700, color: 'white', textTransform: 'none', fontSize: '1rem',
                  visibility: activeStep === 0 ? 'hidden' : 'visible',
                  border: '1px solid rgba(255,255,255,0.1)', '&:hover': { background: 'rgba(255,255,255,0.08)' }
                }}
              >
                Revert Sequence
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained" onClick={handleSubmit} disabled={loading || showConfetti}
                  sx={{
                    background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', color: 'white', borderRadius: '16px', px: 5, py: 1.5, fontSize: '1.1rem', fontWeight: 800, textTransform: 'none',
                    boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4)', transition: 'all 0.3s ease',
                    '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 12px 40px rgba(139, 92, 246, 0.6)' }
                  }}
                >
                  {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : (showConfetti ? 'Initialized!' : 'Execute Sequence')}
                </Button>
              ) : (
                <Button
                  variant="contained" onClick={handleNext} disabled={showConfetti}
                  sx={{
                    background: 'rgba(255,255,255,0.1)', color: 'white', borderRadius: '16px', px: 5, py: 1.5, fontSize: '1rem', fontWeight: 700, textTransform: 'none', border: '1px solid rgba(255,255,255,0.2)',
                    transition: 'all 0.3s ease', '&:hover': { background: 'white', color: '#0d1117', transform: 'translateY(-2px)' }
                  }}
                >
                  Advance Sequence
                </Button>
              )}
            </Box>
          </Paper>
        </Zoom>
      </Box>
    </Box>
  );
};

export default CreateEventPage;
