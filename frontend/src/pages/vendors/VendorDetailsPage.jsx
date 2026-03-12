import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Button, Chip, Rating, Avatar, CircularProgress, Divider, List, ListItem, ListItemIcon, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Fade, Slide } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import VerifiedIcon from '@mui/icons-material/Verified';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MessageIcon from '@mui/icons-material/Message';
import { toast } from 'react-toastify';
import { api } from '../../lib/api';

const VendorDetailsPage = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    eventId: '',
    eventName: '',
    service: '',
    date: '',
    guestCount: '',
    budget: '',
    notes: ''
  });
  const [userEvents, setUserEvents] = useState([]);

  useEffect(() => {
    fetchVendorDetails();
    loadUserEvents();
  }, [vendorId]);

  const loadUserEvents = () => {
    if (!user) return;
    
    // Load user's events from localStorage
    const eventsData = localStorage.getItem('userEvents');
    if (eventsData) {
      try {
        const events = JSON.parse(eventsData);
        // Filter events for current user
        const myEvents = events.filter(e => e.userId === user.id);
        setUserEvents(myEvents);
      } catch (error) {
        console.error('Error loading events:', error);
      }
    }
  };

  const fetchVendorDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/vendors/${vendorId}`);
      const data = await res.json();
      
      if (data.success && data.data) {
        const v = data.data;
        setVendor({
          id: v._id,
          userId: v.userId?._id || v.userId,
          name: v.companyName || 'Unnamed Vendor',
          category: v.vendorType ? v.vendorType.toLowerCase() : 'general',
          description: v.description || 'No description available',
          rating: v.avgRating || 0,
          reviewCount: v.totalReviews || 0,
          image_url: v.image_url || 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800',
          location: v.city && v.state ? `${v.city}, ${v.state}` : (v.city || 'Location unavailable'),
          yearsInBusiness: 0,
          verified: v.isVerified,
          priceRange: v.services && v.services.length > 0 ? v.services[0].price : 'Contact for pricing',
          specialties: v.services && v.services.length > 0 
            ? Array.from(new Set(v.services.map(s => s.category))) 
            : [v.vendorType || 'General Event Services'],
          availability: v.services && v.services.some(s => s.isAvailable) ? 'Available' : 'Check Availability',
          phone: v.userId?.phone || 'Contact not provided',
          email: v.userId?.email || 'Contact not provided',
          website: v.website || 'No website',
          services: v.services || [],
          reviews: [],
          gallery: [v.image_url || 'https://images.unsplash.com/photo-1555244162-803834f70033?w=400']
        });
      }
    } catch (error) {
      console.error('Error fetching vendor details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async () => {
    if (!user) {
      toast.error('Please login to book a vendor');
      navigate('/login');
      return;
    }

    // Validate required fields
    if (!bookingData.service || !bookingData.date || !bookingData.guestCount || !bookingData.budget) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Create booking via backend
      const res = await api.post('/bookings', {
        vendorId: vendor.id,
        eventId: bookingData.eventId || undefined,
        eventName: bookingData.eventName || 'New Event',
        serviceType: bookingData.service,
        eventDate: bookingData.date,
        guestCount: parseInt(bookingData.guestCount),
        amount: parseFloat(bookingData.budget),
        notes: bookingData.notes
      });

      if (res.success) {
        toast.success('Booking request sent! The vendor will contact you soon.');
        setBookingDialogOpen(false);
        setBookingData({ 
          eventId: '',
          eventName: '',
          service: '',
          date: '',
          guestCount: '',
          budget: '',
          notes: ''
        });
      } else {
        toast.error(res.message || 'Failed to send booking request');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast.error('Failed to submit booking');
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '80vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <CircularProgress sx={{ color: 'white' }} size={60} />
      </Box>
    );
  }

  if (!vendor) {
    return (
      <Box sx={{ 
        minHeight: '80vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4
      }}>
        <Card sx={{ p: 4, textAlign: 'center', maxWidth: 500 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>Vendor Not Found</Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/vendors')}
            sx={{
              background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
            }}
          >
            Back to Vendors
          </Button>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      p: 4,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Circles */}
      {[...Array(6)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            animation: `float ${15 + i * 2}s ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`,
            width: `${100 + i * 50}px`,
            height: `${100 + i * 50}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            '@keyframes float': {
              '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
              '33%': { transform: `translate(${30 + i * 10}px, ${-30 - i * 10}px) scale(1.1)` },
              '66%': { transform: `translate(${-20 - i * 5}px, ${20 + i * 5}px) scale(0.9)` },
            },
          }}
        />
      ))}

      {/* Content */}
      <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 1200, mx: 'auto' }}>
        {/* Back Button */}
        <Slide direction="down" in timeout={400}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/vendors')}
            sx={{
              mb: 3,
              color: 'white',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.3)',
              }
            }}
          >
            Back to Vendors
          </Button>
        </Slide>

        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Left Column - Vendor Info */}
          <Grid item xs={12} md={8}>
            <Fade in timeout={600}>
              <Card sx={{
                borderRadius: 4,
                overflow: 'hidden',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}>
                {/* Hero Image */}
                <Box
                  component="img"
                  src={vendor.image_url}
                  alt={vendor.name}
                  sx={{
                    width: '100%',
                    height: 400,
                    objectFit: 'cover',
                  }}
                />

                <CardContent sx={{ p: 4 }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#2c3e50', mr: 2 }}>
                          {vendor.name}
                        </Typography>
                        {vendor.verified && (
                          <Chip
                            icon={<VerifiedIcon />}
                            label="Verified"
                            size="small"
                            sx={{
                              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                              color: 'white',
                              fontWeight: 600,
                            }}
                          />
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Rating value={vendor.rating} precision={0.1} readOnly />
                        <Typography variant="body1" sx={{ ml: 1, fontWeight: 600 }}>
                          {vendor.rating}
                        </Typography>
                        <Typography variant="body2" sx={{ ml: 1, color: '#7f8c8d' }}>
                          ({vendor.reviewCount} reviews)
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      label={vendor.availability}
                      sx={{
                        background: vendor.availability === 'Available' 
                          ? 'linear-gradient(45deg, #4CAF50 30%, #66BB6A 90%)'
                          : 'linear-gradient(45deg, #FFA726 30%, #FFB74D 90%)',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '1rem',
                        px: 2,
                        py: 2.5,
                      }}
                    />
                  </Box>

                  {/* Description */}
                  <Typography variant="body1" sx={{ color: '#2c3e50', mb: 3, lineHeight: 1.8 }}>
                    {vendor.description}
                  </Typography>

                  {/* Specialties */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Specialties</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {vendor.specialties.map((specialty, idx) => (
                        <Chip
                          key={idx}
                          label={specialty}
                          icon={<CheckCircleIcon />}
                          sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            fontWeight: 600,
                          }}
                        />
                      ))}
                    </Box>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  {/* Services */}
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Services & Pricing</Typography>
                  <Grid container spacing={2}>
                    {vendor.services.map((service, idx) => (
                      <Grid item xs={12} key={idx}>
                        <Card sx={{ 
                          p: 2, 
                          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateX(10px)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          }
                        }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                                {service.name}
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                                {service.description}
                              </Typography>
                            </Box>
                            <Chip
                              icon={<AttachMoneyIcon />}
                              label={service.price}
                              sx={{
                                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                                color: 'white',
                                fontWeight: 600,
                              }}
                            />
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>

                  <Divider sx={{ my: 3 }} />

                  {/* Reviews */}
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Recent Reviews</Typography>
                  {vendor.reviews.map((review, idx) => (
                    <Card key={idx} sx={{ p: 2, mb: 2, background: '#f8f9fa' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ mr: 2, background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)' }}>
                            {review.author.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {review.author}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#7f8c8d' }}>
                              {review.date}
                            </Typography>
                          </Box>
                        </Box>
                        <Rating value={review.rating} readOnly size="small" />
                      </Box>
                      <Typography variant="body2" sx={{ color: '#2c3e50' }}>
                        {review.comment}
                      </Typography>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </Fade>
          </Grid>

          {/* Right Column - Contact & Booking */}
          <Grid item xs={12} md={4}>
            <Fade in timeout={800}>
              <Box>
                {/* Contact Card */}
                <Card sx={{
                  borderRadius: 4,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  mb: 3,
                  p: 3,
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Contact Information</Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <LocationOnIcon sx={{ color: '#667eea' }} />
                      </ListItemIcon>
                      <ListItemText primary={vendor.location} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <PhoneIcon sx={{ color: '#667eea' }} />
                      </ListItemIcon>
                      <ListItemText primary={vendor.phone} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <EmailIcon sx={{ color: '#667eea' }} />
                      </ListItemIcon>
                      <ListItemText primary={vendor.email} />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <LanguageIcon sx={{ color: '#667eea' }} />
                      </ListItemIcon>
                      <ListItemText primary={vendor.website} />
                    </ListItem>
                  </List>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Typography variant="body2" sx={{ color: '#7f8c8d', mb: 1 }}>
                      Price Range
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#667eea' }}>
                      {vendor.priceRange}
                    </Typography>
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={<CalendarTodayIcon />}
                    onClick={() => setBookingDialogOpen(true)}
                    sx={{
                      background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                      color: 'white',
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 3,
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                      transition: 'all 0.3s ease',
                      mb: 1,
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)',
                      },
                    }}
                  >
                    Request Booking
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    startIcon={<MessageIcon />}
                    onClick={() => navigate('/messages', { 
                      state: { 
                        preselectUserId: vendor.userId, 
                        preselectUserName: vendor.name 
                      } 
                    })}
                    sx={{
                      borderColor: '#667eea',
                      color: '#667eea',
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 3,
                      borderWidth: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: '#667eea',
                        borderWidth: 2,
                        background: 'rgba(102, 126, 234, 0.1)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    Contact Vendor
                  </Button>
                </Card>

                {/* Gallery */}
                <Card sx={{
                  borderRadius: 4,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  p: 3,
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Gallery</Typography>
                  <Grid container spacing={1}>
                    {vendor.gallery.map((image, idx) => (
                      <Grid item xs={4} key={idx}>
                        <Box
                          component="img"
                          src={image}
                          alt={`Gallery ${idx + 1}`}
                          sx={{
                            width: '100%',
                            height: 100,
                            objectFit: 'cover',
                            borderRadius: 2,
                            cursor: 'pointer',
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.1)',
                            }
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Card>
              </Box>
            </Fade>
          </Grid>
        </Grid>
      </Box>

      {/* Enhanced Booking Dialog */}
      <Dialog 
        open={bookingDialogOpen} 
        onClose={() => setBookingDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
          color: 'white',
          fontWeight: 700,
          fontSize: '1.5rem'
        }}>
          Request Booking - {vendor?.name}
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            {/* Event Selection */}
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Select Event (Optional)"
                value={bookingData.eventId}
                onChange={(e) => {
                  const selectedEvent = userEvents.find(ev => ev.id === e.target.value);
                  setBookingData({ 
                    ...bookingData, 
                    eventId: e.target.value,
                    eventName: selectedEvent ? selectedEvent.name : ''
                  });
                }}
                SelectProps={{
                  native: true,
                }}
                helperText="Select an existing event or leave blank to create a new one"
              >
                <option value="">Create New Event</option>
                {userEvents.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name} - {event.date}
                  </option>
                ))}
              </TextField>
            </Grid>

            {/* Event Name (if creating new) */}
            {!bookingData.eventId && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Event Name"
                  value={bookingData.eventName}
                  onChange={(e) => setBookingData({ ...bookingData, eventName: e.target.value })}
                  placeholder="e.g., Summer Wedding 2024"
                  helperText="Give your event a name"
                />
              </Grid>
            )}

            {/* Service Selection */}
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                required
                label="Select Service *"
                value={bookingData.service}
                onChange={(e) => setBookingData({ ...bookingData, service: e.target.value })}
                SelectProps={{
                  native: true,
                }}
              >
                <option value="">Choose a service...</option>
                {vendor?.services.map((service, idx) => (
                  <option key={idx} value={service.name}>
                    {service.name} - {service.price}
                  </option>
                ))}
              </TextField>
            </Grid>

            {/* Date and Guest Count */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="date"
                label="Event Date *"
                value={bookingData.date}
                onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: new Date().toISOString().split('T')[0] }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type="number"
                label="Number of Guests *"
                value={bookingData.guestCount}
                onChange={(e) => setBookingData({ ...bookingData, guestCount: e.target.value })}
                placeholder="e.g., 150"
                inputProps={{ min: 1 }}
              />
            </Grid>

            {/* Budget */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                type="number"
                label="Budget (USD) *"
                value={bookingData.budget}
                onChange={(e) => setBookingData({ ...bookingData, budget: e.target.value })}
                placeholder="e.g., 5000"
                inputProps={{ min: 0, step: 100 }}
                helperText="Your estimated budget for this service"
              />
            </Grid>

            {/* Special Requests */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Special Requests / Additional Notes"
                value={bookingData.notes}
                onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                placeholder="Tell us about any special requirements, dietary restrictions, setup preferences, etc."
              />
            </Grid>
          </Grid>

          {/* Info Box */}
          <Box sx={{ 
            mt: 3, 
            p: 2, 
            borderRadius: 2, 
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.2)'
          }}>
            <Typography variant="body2" sx={{ color: '#64748B', lineHeight: 1.6 }}>
              <strong>Note:</strong> This is a booking request. The vendor will review your request and contact you to confirm availability and finalize details. You will be notified once the vendor responds.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            onClick={() => setBookingDialogOpen(false)}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleBookingSubmit}
            sx={{
              background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
              px: 4,
              py: 1,
              textTransform: 'none',
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(139, 92, 246, 0.4)',
              }
            }}
          >
            Send Booking Request
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VendorDetailsPage;
