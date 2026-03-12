import { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Card, CardContent, Button, Chip, 
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, MenuItem, Switch, FormControlLabel, Divider, Avatar
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { toast } from 'react-toastify';

/* ── shared glass card style ── */
const glass = {
  background: 'rgba(255, 255, 255, 0.04)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '24px',
};

const VendorServicesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Catering',
    isAvailable: true
  });

  // Initial mock services
  const initialServices = [
    {
      id: 1,
      name: 'Premium Wedding Catering',
      description: 'Full-service catering for weddings with customizable menus, professional staff, and elegant presentation.',
      price: '$5000 - $10000',
      category: 'Catering',
      bookings: 15,
      rating: 4.9,
      views: 342,
      isAvailable: true
    },
    {
      id: 2,
      name: 'Corporate Event Catering',
      description: 'Professional catering services for corporate events, conferences, and business meetings.',
      price: '$3000 - $8000',
      category: 'Catering',
      bookings: 22,
      rating: 4.7,
      views: 289,
      isAvailable: true
    },
    {
      id: 3,
      name: 'Birthday Party Package',
      description: 'Fun and delicious catering for birthday celebrations of all sizes.',
      price: '$1500 - $3000',
      category: 'Catering',
      bookings: 18,
      rating: 4.8,
      views: 256,
      isAvailable: true
    },
    {
      id: 4,
      name: 'Cocktail Reception Service',
      description: 'Elegant cocktail hour service with hors d\'oeuvres and beverage service.',
      price: '$2000 - $4000',
      category: 'Catering',
      bookings: 12,
      rating: 4.6,
      views: 198,
      isAvailable: true
    },
    {
      id: 5,
      name: 'Buffet Style Catering',
      description: 'Versatile buffet-style catering perfect for large gatherings and events.',
      price: '$2500 - $5000',
      category: 'Catering',
      bookings: 20,
      rating: 4.7,
      views: 312,
      isAvailable: false
    }
  ];

  // Load services from localStorage or use initial services
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, [location]);

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch('http://localhost:5000/api/vendors/profile/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success && data.data && data.data.services) {
        setServices(data.data.services);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = () => {
    navigate('/vendor/services/add', { state: { services } });
  };

  const handleEditService = (service) => {
    setCurrentService(service);
    setServiceForm({
      name: service.name,
      description: service.description,
      price: service.price,
      category: service.category,
      isAvailable: service.isAvailable
    });
    setDialogOpen(true);
  };

  const handleDeleteService = async (serviceId) => {
    try {
      const updatedServices = services.filter(s => s._id !== serviceId && s.id !== serviceId);
      const token = localStorage.getItem('authToken');
      await fetch('http://localhost:5000/api/vendors/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ services: updatedServices })
      });
      setServices(updatedServices);
      toast.success('Service deleted successfully');
    } catch (error) {
      toast.error('Failed to delete service');
    }
  };

  const handleSubmitService = async () => {
    if (!serviceForm.name || !serviceForm.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      let updatedServices;
      if (currentService) {
        updatedServices = services.map(s => 
          (s._id === currentService._id || s.id === currentService.id) ? { ...s, ...serviceForm } : s
        );
      } else {
        const newService = {
          id: Date.now().toString(),
          ...serviceForm,
          bookings: 0,
          rating: 0,
          views: 0
        };
        updatedServices = [...services, newService];
      }
      
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
        setServices(data.data.services || updatedServices);
        toast.success(currentService ? 'Service updated successfully' : 'Service added successfully');
        setDialogOpen(false);
      } else {
        toast.error(data.message || 'Failed to update services');
      }
    } catch (error) {
      toast.error('Error saving service');
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Catering': '#8B5CF6',
      'Decoration': '#EC4899',
      'Photography': '#3B82F6',
      'Entertainment': '#10B981',
      'Venue': '#F59E0B',
      'Transportation': '#6366F1'
    };
    return colors[category] || '#8B5CF6';
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
      {/* Mesh and Orbs */}
      <Box sx={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.05) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none', zIndex: 0
      }} />
      {[
        { w: 600, h: 600, t: -100, l: -200, c: 'rgba(139, 92, 246, 0.1)' },
        { w: 400, h: 400, b: -100, r: -100, c: 'rgba(236, 72, 153, 0.08)' },
      ].map((o, i) => (
        <Box key={i} sx={{
          position: 'absolute', width: o.w, height: o.h, top: o.t, left: o.l, right: o.r, bottom: o.b,
          background: o.c, borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0
        }} />
      ))}

      {/* Content */}
      <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 1400, mx: 'auto' }}>
        {/* Header Section */}
        <Box sx={{ 
          mb: 6,
          animation: 'fadeInDown 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          '@keyframes fadeInDown': { from: { opacity: 0, transform: 'translateY(-20px)' }, to: { opacity: 1, transform: 'translateY(0)' } }
        }}>
          <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
            <Grid item xs={12} md={8}>
              <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #fff, rgba(255,255,255,0.7))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Service Portfolio
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
                  {services.length} elite offerings active
                </Typography>
                <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.1)', height: 20, mt: 1 }} />
                <Chip 
                  label="Global Standard" 
                  size="small" 
                  sx={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8B5CF6', fontWeight: 700, border: '1px solid rgba(139, 92, 246, 0.2)' }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: { md: 'right' } }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddService}
                sx={{
                  background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                  px: 4, py: 1.8, borderRadius: '16px', fontWeight: 800, textTransform: 'none', fontSize: '1rem',
                  boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 40px rgba(139, 92, 246, 0.5)' },
                  transition: 'all 0.3s ease'
                }}
              >
                Assemble New Offering
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Services Grid */}
        <Grid container spacing={4}>
          {services.map((service, index) => (
            <Grid item xs={12} md={6} lg={4} key={service.id}>
              <Card
                sx={{
                  ...glass,
                  height: '100%', display: 'flex', flexDirection: 'column',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                  '@keyframes fadeInUp': { from: { opacity: 0, transform: 'translateY(30px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
                  '&:hover': {
                    transform: 'translateY(-10px) scale(1.02)',
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                    '& .service-icon': { transform: 'rotate(10deg) scale(1.1)' }
                  }
                }}
              >
                <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Category Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Avatar 
                      className="service-icon"
                      sx={{ 
                        width: 54, height: 54, borderRadius: '16px', 
                        background: `${getCategoryColor(service.category)}20`,
                        border: `1px solid ${getCategoryColor(service.category)}50`,
                        color: getCategoryColor(service.category),
                        transition: 'all 0.4s ease'
                      }}
                    >
                      <InventoryIcon />
                    </Avatar>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton size="small" onClick={() => handleEditService(service)} sx={{ ...glass, p: 1, color: 'rgba(255,255,255,0.4)', '&:hover': { color: '#8B5CF6', background: 'rgba(139, 92, 246, 0.1)' } }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteService(service.id)} sx={{ ...glass, p: 1, color: 'rgba(255,255,255,0.4)', '&:hover': { color: '#EF4444', background: 'rgba(239, 68, 68, 0.1)' } }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Info */}
                  <Typography variant="h5" sx={{ fontWeight: 900, mb: 1, color: 'white' }}>{service.name}</Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                    <Chip 
                      label={service.category} 
                      size="small" 
                      sx={{ background: `${getCategoryColor(service.category)}15`, color: getCategoryColor(service.category), fontWeight: 800, borderRadius: '8px', border: `1px solid ${getCategoryColor(service.category)}30` }}
                    />
                    <Chip 
                      label={service.isAvailable ? 'ACTIVE' : 'ARCHIVED'} 
                      size="small"
                      sx={{ background: service.isAvailable ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.05)', color: service.isAvailable ? '#10B981' : 'rgba(255,255,255,0.4)', fontWeight: 800, borderRadius: '8px' }}
                    />
                  </Box>

                  <Typography sx={{ color: 'rgba(255,255,255,0.4)', mb: 4, lineHeight: 1.7, minHeight: 70, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {service.description}
                  </Typography>

                  <Box sx={{ mt: 'auto' }}>
                    <Box sx={{ p: 2, mb: 3, borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                      <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', mb: 0.5, letterSpacing: '0.1em' }}>Market Value</Typography>
                      <Typography variant="h4" sx={{ fontWeight: 900, color: '#white' }}>{service.price}</Typography>
                    </Box>

                    <Grid container spacing={2}>
                      {[
                        { icon: <StarIcon sx={{ color: '#F59E0B' }} />, label: 'Rating', val: service.rating },
                        { icon: <TrendingUpIcon sx={{ color: '#10B981' }} />, label: 'Lead Vol', val: service.bookings },
                        { icon: <VisibilityIcon sx={{ color: '#3B82F6' }} />, label: 'Visits', val: service.views }
                      ].map((stat, i) => (
                        <Grid item xs={4} key={i}>
                          <Box sx={{ textAlign: 'center' }}>
                             <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0.5, gap: 0.5 }}>
                                {stat.icon}
                                <Typography sx={{ fontWeight: 900, fontSize: '0.9rem' }}>{stat.val}</Typography>
                             </Box>
                             <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase' }}>{stat.label}</Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Modern Dialog - Redesigned for better arrangement */}
      <Dialog 
        open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ 
          sx: { 
            ...glass, 
            background: 'linear-gradient(180deg, #161b22 0%, #0d1117 100%)', 
            color: 'white', 
            p: 1,
            boxShadow: '0 24px 48px rgba(0,0,0,0.8)',
            border: '1px solid rgba(255,255,255,0.1)'
          } 
        }}
      >
        <DialogTitle sx={{ fontWeight: 900, fontSize: '1.8rem', pt: 4, px: 4 }}>
          Service Configuration
          <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', fontWeight: 500, mt: 0.5 }}>
            {currentService ? 'Refining existing portfolio parameters' : 'Initializing new service blueprint'}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ px: 4, pb: 2 }}>
          <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Basic Info Row */}
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField 
                  fullWidth label="Portfolio Name" variant="outlined"
                  value={serviceForm.name} onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px', background: 'rgba(255,255,255,0.03)', color: 'white',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                      '&.Mui-focused fieldset': { borderColor: '#8B5CF6' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#8B5CF6' },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth label="Financial Range" placeholder="$1000 - $5000" variant="outlined"
                  value={serviceForm.price} onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px', background: 'rgba(255,255,255,0.03)', color: 'white',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                      '&.Mui-focused fieldset': { borderColor: '#8B5CF6' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#8B5CF6' },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  select fullWidth label="Core Category" variant="outlined"
                  value={serviceForm.category} onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px', background: 'rgba(255,255,255,0.03)', color: 'white',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                      '&.Mui-focused fieldset': { borderColor: '#8B5CF6' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#8B5CF6' },
                    '& .MuiSvgIcon-root': { color: 'white' }
                  }}
                >
                  {['Catering', 'Decoration', 'Photography', 'Entertainment', 'Venue', 'Transportation'].map(c => (
                    <MenuItem key={c} value={c} sx={{ py: 1.5 }}>{c}</MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            {/* Intelligence/Description Row - Always Full Width for better arrangement */}
            <Box>
              <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', mb: 1.5, letterSpacing: '0.1em' }}>
                Service Scope & Intelligence
              </Typography>
              <TextField 
                fullWidth multiline rows={4} variant="outlined"
                placeholder="Detail the technical specs and client deliverables..."
                value={serviceForm.description} onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '16px', background: 'rgba(255,255,255,0.02)', color: 'white', p: 2,
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.05)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                    '&.Mui-focused fieldset': { borderColor: '#8B5CF6' },
                  }
                }}
              />
            </Box>

            {/* Marketplace Status */}
            <Box sx={{ 
              p: 2.5, 
              borderRadius: '16px', 
              background: 'rgba(139, 92, 246, 0.05)', 
              border: '1px solid rgba(139, 92, 246, 0.1)',
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: 'white' }}>Visibility Protocol</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>Broadcast availability to the global marketplace</Typography>
              </Box>
              <Switch 
                 checked={serviceForm.isAvailable} 
                 onChange={(e) => setServiceForm({ ...serviceForm, isAvailable: e.target.checked })} 
                 color="secondary"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 4, gap: 1.5 }}>
          <Button 
            onClick={() => setDialogOpen(false)} 
            sx={{ 
              color: 'rgba(255,255,255,0.4)', 
              textTransform: 'none', 
              fontWeight: 700,
              '&:hover': { color: 'white' }
            }}
          >
            Dismiss
          </Button>
          <Button 
            onClick={handleSubmitService} 
            variant="contained"
            sx={{ 
              background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', 
              borderRadius: '14px', 
              px: 4, 
              py: 1.5,
              fontWeight: 900, 
              textTransform: 'none',
              boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)'
            }}
          >
            {currentService ? 'Commit Changes' : 'Initialize Portfolio'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VendorServicesPage;
