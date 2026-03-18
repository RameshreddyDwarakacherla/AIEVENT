import { useState } from 'react';
import { 
  Box, Typography, Card, CardContent, TextField, Button, 
  MenuItem, Switch, FormControlLabel, Grid, IconButton, Divider, Avatar,
  Stepper, Step, StepLabel, Chip, LinearProgress, Fade, Zoom, Slide
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import InventoryIcon from '@mui/icons-material/Inventory';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CategoryIcon from '@mui/icons-material/Category';
import DescriptionIcon from '@mui/icons-material/Description';
import PublicIcon from '@mui/icons-material/Public';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { toast } from 'react-toastify';

/* ── shared glass card style ── */
const glass = {
  background: 'rgba(255, 255, 255, 0.04)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '24px',
};

const AddServicePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const existingServices = location.state?.services || [];
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Catering',
    isAvailable: true
  });

  const steps = ['Service Details', 'Pricing & Category', 'Description & Availability'];
  
  const categories = [
    { value: 'Catering', icon: '🍽️', color: '#FF6B6B' },
    { value: 'Decoration', icon: '🎨', color: '#4ECDC4' },
    { value: 'Photography', icon: '📸', color: '#45B7D1' },
    { value: 'Entertainment', icon: '🎵', color: '#96CEB4' },
    { value: 'Venue', icon: '🏛️', color: '#FFEAA7' },
    { value: 'Transportation', icon: '🚗', color: '#DDA0DD' }
  ];

  const getCompletionPercentage = () => {
    const fields = ['name', 'price', 'category', 'description'];
    const completed = fields.filter(field => serviceForm[field] && serviceForm[field].toString().trim() !== '').length;
    return Math.round((completed / fields.length) * 100);
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setServiceForm({
      ...serviceForm,
      [name]: name === 'isAvailable' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!serviceForm.name || !serviceForm.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    const newService = {
      id: Date.now().toString(),
      name: serviceForm.name,
      description: serviceForm.description,
      price: serviceForm.price,
      category: serviceForm.category,
      bookings: 0,
      rating: 0,
      views: 0,
      isAvailable: serviceForm.isAvailable
    };

    const updatedServices = [...existingServices, newService];
    
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch('http://localhost:5000/api/vendors/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ services: updatedServices })
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success('🎉 Service added successfully!');
        setTimeout(() => {
          navigate('/vendor/services', { state: { refresh: true } });
        }, 1500);
      } else {
        toast.error(data.message || 'Failed to add service');
      }
    } catch (error) {
      console.error('Error saving service:', error);
      toast.error('Failed to add service');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return serviceForm.name.trim() !== '';
      case 1:
        return serviceForm.price.trim() !== '' && serviceForm.category !== '';
      case 2:
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    const stepVariants = {
      hidden: { opacity: 0, x: 50 },
      visible: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -50 }
    };

    switch (currentStep) {
      case 0:
        return (
          <motion.div
            key="step0"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', mb: 4 }}>
                  <Avatar sx={{ width: 64, height: 64, borderRadius: '18px', background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6' }}>
                    <InventoryIcon fontSize="large" />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>Service Blueprint</Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>Define the core identity and name of your service offering.</Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Service Name" name="name" fullWidth required
                  value={serviceForm.name} onChange={handleInputChange}
                  placeholder="e.g. Cinematic Wedding Experience"
                  InputLabelProps={{ 
                    sx: { 
                      color: '#8B5CF6',
                      fontWeight: 600,
                      '&.Mui-focused': { color: '#8B5CF6' }
                    } 
                  }}
                  InputProps={{ 
                    sx: { 
                      background: 'linear-gradient(135deg, #87CEEB, #B0E0E6)',
                      border: '2px solid rgba(139, 92, 246, 0.3)',
                      borderRadius: '16px',
                      color: '#1a1a1a',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      py: 1,
                      px: 2,
                      '& input': {
                        color: '#1a1a1a !important',
                        fontWeight: 600,
                        '&::placeholder': {
                          color: 'rgba(26, 26, 26, 0.6)',
                          opacity: 1
                        }
                      },
                      '&:hover': { 
                        borderColor: '#8B5CF6',
                        background: 'linear-gradient(135deg, #7EC8E3, #A8D8EA)',
                        boxShadow: '0 4px 12px rgba(135, 206, 235, 0.3)'
                      },
                      '&.Mui-focused': { 
                        borderColor: '#8B5CF6',
                        background: 'linear-gradient(135deg, #7EC8E3, #A8D8EA)',
                        boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.2)'
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none'
                      }
                    } 
                  }}
                />
              </Grid>
            </Grid>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            key="step1"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', mb: 4 }}>
                  <Avatar sx={{ width: 64, height: 64, borderRadius: '18px', background: 'rgba(236, 72, 153, 0.1)', color: '#EC4899' }}>
                    <AttachMoneyIcon fontSize="large" />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>Pricing & Category</Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>Set your pricing strategy and market positioning.</Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Price Range" name="price" fullWidth required
                  value={serviceForm.price} onChange={handleInputChange}
                  placeholder="$2500 - $5000"
                  InputLabelProps={{ 
                    sx: { 
                      color: '#EC4899',
                      fontWeight: 600,
                      '&.Mui-focused': { color: '#EC4899' }
                    } 
                  }}
                  InputProps={{ 
                    sx: { 
                      background: 'linear-gradient(135deg, #87CEEB, #B0E0E6)',
                      border: '2px solid rgba(236, 72, 153, 0.3)',
                      borderRadius: '16px',
                      color: '#1a1a1a',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      py: 1,
                      px: 2,
                      '& input': {
                        color: '#1a1a1a !important',
                        fontWeight: 600,
                        '&::placeholder': {
                          color: 'rgba(26, 26, 26, 0.6)',
                          opacity: 1
                        }
                      },
                      '&:hover': { 
                        borderColor: '#EC4899',
                        background: 'linear-gradient(135deg, #7EC8E3, #A8D8EA)',
                        boxShadow: '0 4px 12px rgba(135, 206, 235, 0.3)'
                      },
                      '&.Mui-focused': { 
                        borderColor: '#EC4899',
                        background: 'linear-gradient(135deg, #7EC8E3, #A8D8EA)',
                        boxShadow: '0 0 0 3px rgba(236, 72, 153, 0.2)'
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none'
                      }
                    } 
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography sx={{ color: 'rgba(255,255,255,0.8)', mb: 3, fontWeight: 600, fontSize: '1.1rem' }}>
                  Select Category
                </Typography>
                <Grid container spacing={2}>
                  {categories.map((cat) => (
                    <Grid item xs={6} sm={4} key={cat.value}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Card
                          onClick={() => setServiceForm({ ...serviceForm, category: cat.value })}
                          sx={{
                            p: 3,
                            cursor: 'pointer',
                            borderRadius: '20px',
                            border: serviceForm.category === cat.value 
                              ? `3px solid ${cat.color}` 
                              : '2px solid rgba(255,255,255,0.1)',
                            background: serviceForm.category === cat.value 
                              ? `linear-gradient(135deg, ${cat.color}25, ${cat.color}15)` 
                              : 'rgba(255,255,255,0.05)',
                            backdropFilter: 'blur(20px)',
                            transition: 'all 0.3s ease',
                            transform: serviceForm.category === cat.value ? 'scale(1.02)' : 'scale(1)',
                            boxShadow: serviceForm.category === cat.value 
                              ? `0 8px 32px ${cat.color}40` 
                              : '0 4px 16px rgba(0,0,0,0.1)',
                            '&:hover': {
                              background: serviceForm.category === cat.value 
                                ? `linear-gradient(135deg, ${cat.color}35, ${cat.color}25)` 
                                : `${cat.color}15`,
                              borderColor: cat.color,
                              transform: 'scale(1.05)',
                              boxShadow: `0 12px 40px ${cat.color}30`
                            }
                          }}
                        >
                          <Box sx={{ textAlign: 'center', position: 'relative' }}>
                            {serviceForm.category === cat.value && (
                              <Box sx={{
                                position: 'absolute',
                                top: -8,
                                right: -8,
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                background: cat.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: `0 4px 12px ${cat.color}60`
                              }}>
                                <CheckCircleIcon sx={{ fontSize: 16, color: 'white' }} />
                              </Box>
                            )}
                            <Typography sx={{ 
                              fontSize: '2.5rem', 
                              mb: 1.5,
                              filter: serviceForm.category === cat.value ? 'brightness(1.2)' : 'brightness(1)'
                            }}>
                              {cat.icon}
                            </Typography>
                            <Typography sx={{ 
                              fontWeight: serviceForm.category === cat.value ? 700 : 600, 
                              color: serviceForm.category === cat.value ? cat.color : 'white',
                              fontSize: '1rem',
                              textShadow: serviceForm.category === cat.value ? `0 2px 8px ${cat.color}60` : 'none'
                            }}>
                              {cat.value}
                            </Typography>
                          </Box>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
                
                {/* Selected Category Indicator */}
                {serviceForm.category && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Box sx={{ 
                      mt: 3, 
                      p: 2, 
                      borderRadius: '16px',
                      background: `linear-gradient(135deg, ${categories.find(c => c.value === serviceForm.category)?.color}20, ${categories.find(c => c.value === serviceForm.category)?.color}10)`,
                      border: `1px solid ${categories.find(c => c.value === serviceForm.category)?.color}40`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2
                    }}>
                      <CheckCircleIcon sx={{ color: categories.find(c => c.value === serviceForm.category)?.color }} />
                      <Typography sx={{ color: 'white', fontWeight: 600 }}>
                        Selected: <span style={{ color: categories.find(c => c.value === serviceForm.category)?.color }}>
                          {serviceForm.category}
                        </span>
                      </Typography>
                    </Box>
                  </motion.div>
                )}
              </Grid>
            </Grid>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', mb: 4 }}>
                  <Avatar sx={{ width: 64, height: 64, borderRadius: '18px', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
                    <DescriptionIcon fontSize="large" />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>Final Details</Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>Add description and set availability preferences.</Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Service Description" name="description" fullWidth multiline rows={5}
                  value={serviceForm.description} onChange={handleInputChange}
                  placeholder="Describe what makes your service unique and what clients can expect..."
                  InputLabelProps={{ 
                    sx: { 
                      color: '#10B981',
                      fontWeight: 600,
                      '&.Mui-focused': { color: '#10B981' }
                    } 
                  }}
                  InputProps={{ 
                    sx: { 
                      background: 'linear-gradient(135deg, #87CEEB, #B0E0E6)',
                      border: '2px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '16px',
                      color: '#1a1a1a',
                      fontSize: '1rem',
                      fontWeight: 500,
                      p: 2,
                      '& textarea': {
                        color: '#1a1a1a !important',
                        fontWeight: 500,
                        '&::placeholder': {
                          color: 'rgba(26, 26, 26, 0.6)',
                          opacity: 1
                        }
                      },
                      '&:hover': { 
                        borderColor: '#10B981',
                        background: 'linear-gradient(135deg, #7EC8E3, #A8D8EA)',
                        boxShadow: '0 4px 12px rgba(135, 206, 235, 0.3)'
                      },
                      '&.Mui-focused': { 
                        borderColor: '#10B981',
                        background: 'linear-gradient(135deg, #7EC8E3, #A8D8EA)',
                        boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.2)'
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none'
                      }
                    } 
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ 
                  ...glass, 
                  p: 3, 
                  background: 'rgba(255,255,255,0.02)', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  border: '1px solid rgba(16, 185, 129, 0.2)'
                }}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <PublicIcon sx={{ color: '#10B981' }} />
                    <Box>
                      <Typography sx={{ fontWeight: 700 }}>Market Availability</Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
                        {serviceForm.isAvailable ? 'Service is visible to clients' : 'Service is hidden from clients'}
                      </Typography>
                    </Box>
                  </Box>
                  <Switch 
                    name="isAvailable" 
                    checked={serviceForm.isAvailable} 
                    onChange={handleInputChange} 
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#10B981',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#10B981',
                      },
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #0d1117 0%, #1a0533 55%, #0d1117 100%)',
      p: { xs: 2, md: 4, lg: 6 },
      position: 'relative',
      overflow: 'hidden',
      color: 'white',
      fontFamily: '"Inter", sans-serif'
    }}>
      {/* Background Effects */}
      <Box sx={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.05) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none', zIndex: 0
      }} />
      {[
        { w: 500, h: 500, t: -100, l: -200, c: 'rgba(139, 92, 246, 0.1)' },
        { w: 300, h: 300, b: 100, r: -50, c: 'rgba(236, 72, 153, 0.06)' },
      ].map((o, i) => (
        <Box key={i} sx={{
          position: 'absolute', width: o.w, height: o.h, top: o.t, left: o.l, right: o.r, bottom: o.b,
          background: o.c, borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0
        }} />
      ))}

      <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 900, mx: 'auto' }}>
        {/* Navigation Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', gap: 3 }}>
            <IconButton 
              onClick={() => navigate('/vendor/services')}
              sx={{ 
                ...glass, 
                color: 'white', 
                p: 1.5, 
                '&:hover': { 
                  background: 'rgba(255,255,255,0.1)',
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ 
                color: 'rgba(255,255,255,0.4)', 
                fontWeight: 700, 
                fontSize: '0.75rem', 
                textTransform: 'uppercase', 
                letterSpacing: '0.1em' 
              }}>
                Service Portfolio Builder
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>
                Create New Service
              </Typography>
              
              {/* Progress Indicator */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={getCompletionPercentage()} 
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(90deg, #8B5CF6, #EC4899)',
                        borderRadius: 3,
                      }
                    }}
                  />
                </Box>
                <Chip 
                  label={`${getCompletionPercentage()}%`}
                  size="small"
                  sx={{ 
                    background: 'rgba(139, 92, 246, 0.2)', 
                    color: '#8B5CF6',
                    fontWeight: 700
                  }}
                />
              </Box>
            </Box>
          </Box>
        </motion.div>

        {/* Stepper */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card sx={{ ...glass, mb: 4, overflow: 'visible' }}>
            <CardContent sx={{ p: 3 }}>
              <Stepper activeStep={currentStep} alternativeLabel>
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel
                      sx={{
                        '& .MuiStepLabel-label': {
                          color: index <= currentStep ? 'white' : 'rgba(255,255,255,0.4)',
                          fontWeight: index === currentStep ? 700 : 400,
                        },
                        '& .MuiStepIcon-root': {
                          color: index <= currentStep ? '#8B5CF6' : 'rgba(255,255,255,0.2)',
                        }
                      }}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </CardContent>
          </Card>
        </motion.div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card sx={{ ...glass, overflow: 'visible' }}>
            <CardContent sx={{ p: { xs: 3, md: 6 } }}>
              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  {renderStepContent()}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <Box sx={{ display: 'flex', gap: 2, mt: 6, pt: 4, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  {currentStep > 0 && (
                    <Button
                      onClick={prevStep}
                      variant="outlined"
                      sx={{ 
                        borderRadius: '16px', 
                        py: 1.8, 
                        px: 4,
                        textTransform: 'none', 
                        fontWeight: 700, 
                        color: 'rgba(255,255,255,0.6)', 
                        borderColor: 'rgba(255,255,255,0.2)',
                        '&:hover': {
                          borderColor: 'rgba(255,255,255,0.4)',
                          background: 'rgba(255,255,255,0.05)'
                        }
                      }}
                    >
                      Previous
                    </Button>
                  )}
                  
                  <Box sx={{ flex: 1 }} />
                  
                  {currentStep < steps.length - 1 ? (
                    <Button
                      onClick={nextStep}
                      disabled={!canProceed()}
                      variant="contained"
                      sx={{ 
                        background: canProceed() 
                          ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' 
                          : 'rgba(255,255,255,0.1)',
                        borderRadius: '16px', 
                        py: 1.8, 
                        px: 4,
                        fontWeight: 900, 
                        textTransform: 'none',
                        boxShadow: canProceed() ? '0 8px 32px rgba(139, 92, 246, 0.4)' : 'none',
                        '&:disabled': {
                          color: 'rgba(255,255,255,0.3)'
                        }
                      }}
                    >
                      Continue
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      variant="contained"
                      startIcon={isSubmitting ? null : <SaveIcon />}
                      sx={{ 
                        background: 'linear-gradient(135deg, #10B981, #059669)', 
                        borderRadius: '16px', 
                        py: 1.8, 
                        px: 4,
                        fontWeight: 900, 
                        textTransform: 'none',
                        boxShadow: '0 8px 32px rgba(16, 185, 129, 0.4)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #059669, #047857)',
                        }
                      }}
                    >
                      {isSubmitting ? 'Creating Service...' : 'Create Service'}
                    </Button>
                  )}
                </Box>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Success Animation Overlay */}
        <AnimatePresence>
          {isSubmitting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999
              }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '24px',
                  padding: '40px',
                  textAlign: 'center',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <StarIcon sx={{ fontSize: 60, color: '#10B981', mb: 2 }} />
                </motion.div>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                  Creating Your Service...
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.6)', mt: 1 }}>
                  Please wait while we save your service
                </Typography>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export default AddServicePage;
