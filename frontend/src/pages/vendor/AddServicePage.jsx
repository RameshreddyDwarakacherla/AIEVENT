import { useState } from 'react';
import { 
  Box, Typography, Card, CardContent, TextField, Button, 
  MenuItem, Switch, FormControlLabel, Grid, IconButton, Divider, Avatar
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import InventoryIcon from '@mui/icons-material/Inventory';
import SecurityIcon from '@mui/icons-material/Security';
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
  
  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Catering',
    isAvailable: true
  });

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
        toast.success('Service added successfully!');
        navigate('/vendor/services', { state: { refresh: true } });
      } else {
        toast.error(data.message || 'Failed to add service');
      }
    } catch (error) {
      console.error('Error saving service:', error);
      toast.error('Failed to add service');
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

      <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 850, mx: 'auto' }}>
        {/* Navigation Header */}
        <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            onClick={() => navigate('/vendor/services')}
            sx={{ ...glass, color: 'white', p: 1.5, '&:hover': { background: 'rgba(255,255,255,0.1)' } }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Box>
             <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Portfolio Builder</Typography>
             <Typography variant="h4" sx={{ fontWeight: 900 }}>Create New Offering</Typography>
          </Box>
        </Box>

        {/* Form Container */}
        <Card sx={{ ...glass, overflow: 'visible' }}>
          <CardContent sx={{ p: { xs: 3, md: 6 } }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={4}>
                {/* Intro Section */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', mb: 2 }}>
                    <Avatar sx={{ width: 64, height: 64, borderRadius: '18px', background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6' }}>
                      <InventoryIcon fontSize="large" />
                    </Avatar>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>Service Blueprint</Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>Define the core parameters and value proposition of your new service.</Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ mt: 3, borderColor: 'rgba(255,255,255,0.06)' }} />
                </Grid>

                {/* Primary Data */}
                <Grid item xs={12}>
                  <TextField
                    label="Portfolio Name" name="name" fullWidth required
                    value={serviceForm.name} onChange={handleInputChange}
                    placeholder="e.g. Cinematic Wedding Experience"
                    InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.4)' } }}
                    InputProps={{ sx: { ...glass, color: 'white', py: 0.5 } }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Price Projection" name="price" fullWidth required
                    value={serviceForm.price} onChange={handleInputChange}
                    placeholder="$2500 - $5000"
                    InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.4)' } }}
                    InputProps={{ sx: { ...glass, color: 'white', py: 0.5 } }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    select label="Market Category" name="category" fullWidth
                    value={serviceForm.category} onChange={handleInputChange}
                    InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.4)' } }}
                    InputProps={{ sx: { ...glass, color: 'white', py: 0.5 } }}
                  >
                    {['Catering', 'Decoration', 'Photography', 'Entertainment', 'Venue', 'Transportation'].map(c => (
                      <MenuItem key={c} value={c} sx={{ py: 1.5 }}>{c}</MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Service Context & Description" name="description" fullWidth multiline rows={5}
                    value={serviceForm.description} onChange={handleInputChange}
                    placeholder="Provide a detailed roadmap of what the client receives..."
                    InputLabelProps={{ sx: { color: 'rgba(255,255,255,0.4)' } }}
                    InputProps={{ sx: { ...glass, color: 'white' } }}
                  />
                </Grid>

                <Grid item xs={12}>
                   <Box sx={{ ...glass, p: 3, background: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                         <SecurityIcon sx={{ color: '#10B981' }} />
                         <Box>
                           <Typography sx={{ fontWeight: 700 }}>Market Availability</Typography>
                           <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>Toggle visibility to global event planners immediately.</Typography>
                         </Box>
                      </Box>
                      <Switch 
                         name="isAvailable" checked={serviceForm.isAvailable} 
                         onChange={handleInputChange} color="secondary"
                      />
                   </Box>
                </Grid>

                {/* Final Actions */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                    <Button
                      fullWidth variant="outlined"
                      onClick={() => navigate('/vendor/services')}
                      sx={{ borderRadius: '16px', py: 1.8, textTransform: 'none', fontWeight: 800, color: 'rgba(255,255,255,0.4)', borderColor: 'rgba(255,255,255,0.1)' }}
                    >
                      Discard Blueprint
                    </Button>
                    <Button
                      type="submit" fullWidth variant="contained"
                      sx={{ 
                        background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', 
                        borderRadius: '16px', py: 1.8, fontWeight: 900, textTransform: 'none',
                        boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4)'
                      }}
                    >
                      Authenticate & Save Service
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default AddServicePage;
