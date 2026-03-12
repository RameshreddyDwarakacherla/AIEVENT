import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, CardMedia, Chip, TextField, InputAdornment, Button, Rating, IconButton, Fade, Zoom, Slide, CircularProgress, Tabs, Tab } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VerifiedIcon from '@mui/icons-material/Verified';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import BusinessIcon from '@mui/icons-material/Business';
import CakeIcon from '@mui/icons-material/Cake';

/* ── premium dark glass style ── */
const glass = {
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(30px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '24px',
};

const VendorsPage = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState([]);

  const categories = [
    { id: 'all', name: 'All Vendors', icon: <BusinessIcon />, color: '#8B5CF6' },
    { id: 'catering', name: 'Catering', icon: <RestaurantIcon />, color: '#EC4899' },
    { id: 'decoration', name: 'Decoration', icon: <LocalFloristIcon />, color: '#10B981' },
    { id: 'entertainment', name: 'Entertainment', icon: <MusicNoteIcon />, color: '#F59E0B' },
    { id: 'photography', name: 'Photography', icon: <CameraAltIcon />, color: '#3B82F6' },
    { id: 'venue', name: 'Venues', icon: <BusinessIcon />, color: '#06B6D4' },
    { id: 'bakery', name: 'Bakery', icon: <CakeIcon />, color: '#F43F5E' },
  ];

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/vendors');
      const data = await res.json();
      
      if (data.success) {
        // Map backend schema to frontend representation
        const formattedVendors = data.data.map(v => ({
          id: v._id,
          name: v.companyName || 'Unnamed Vendor',
          category: v.vendorType ? v.vendorType.toLowerCase() : 'general',
          description: v.description || 'No description available',
          rating: v.avgRating || 0,
          reviewCount: v.totalReviews || 0,
          image_url: v.image_url || 'https://images.unsplash.com/photo-1555244162-803834f70033?w=500',
          location: v.city && v.state ? `${v.city}, ${v.state}` : (v.city || 'Location unavailable'),
          yearsInBusiness: 0,
          verified: v.isVerified,
          priceRange: v.services && v.services.length > 0 ? v.services[0].price : 'Contact for pricing',
          specialties: v.services && v.services.length > 0 
            ? Array.from(new Set(v.services.map(s => s.category))) 
            : [v.vendorType || 'General Event Services'],
          availability: v.services && v.services.some(s => s.isAvailable) ? 'Available' : 'Check Availability'
        }));
        setVendors(formattedVendors);
      } else {
         console.error('Failed to fetch vendors:', data.message);
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (event, newValue) => setSelectedCategory(newValue);

  const toggleFavorite = (vendorId) => {
    setFavorites(prev => 
      prev.includes(vendorId) ? prev.filter(id => id !== vendorId) : [...prev, vendorId]
    );
  };

  const filteredVendors = vendors.filter(vendor => {
    const categoryMatch = selectedCategory === 0 || vendor.category === categories[selectedCategory].id;
    const searchMatch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       vendor.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       vendor.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    return categoryMatch && searchMatch;
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'linear-gradient(160deg, #0d1117 0%, #1a0533 55%, #0d1117 100%)' }}>
        <CircularProgress sx={{ color: '#A78BFA' }} size={60} thickness={4} />
      </Box>
    );
  }

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
      {/* Immersive Background Grid and Orbs */}
      <Box sx={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.03) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none', zIndex: 0 }} />
      {[
        { w: 600, h: 600, t: -100, l: -200, c: 'rgba(139, 92, 246, 0.12)' },
        { w: 500, h: 500, b: -100, r: -100, c: 'rgba(236, 72, 153, 0.08)' },
      ].map((o, i) => (
        <Box key={i} sx={{ position: 'absolute', width: o.w, height: o.h, top: o.t, left: o.l, right: o.r, bottom: o.b, background: o.c, borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0 }} />
      ))}

      {/* Content wrapper */}
      <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 1400, mx: 'auto' }}>
        
        {/* Dynamic Header */}
        <Slide direction="down" in timeout={600}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h2" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #fff, rgba(255,255,255,0.7))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Vendor Marketplace
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 400 }}>
              Access the master network of elite professionals
            </Typography>
          </Box>
        </Slide>

        {/* Neural Network Search Bar */}
        <Zoom in timeout={800}>
          <Box sx={{ mb: 5, maxWidth: 800, mx: 'auto' }}>
            <TextField
              fullWidth placeholder="Search by name, expertise, or core specialty..."
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: ( <InputAdornment position="start"><SearchIcon sx={{ color: '#8B5CF6', fontSize: 28 }} /></InputAdornment> ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(30px)',
                  borderRadius: '30px', color: 'white', py: 0.5, px: 1,
                  border: '1px solid rgba(255, 255, 255, 0.1)', transition: 'all 0.3s ease',
                  '& fieldset': { border: 'none' },
                  '&:hover': { background: 'rgba(255, 255, 255, 0.06)', border: '1px solid rgba(139, 92, 246, 0.4)' },
                  '&.Mui-focused': { background: 'rgba(255, 255, 255, 0.08)', border: '1px solid #8B5CF6', boxShadow: '0 0 20px rgba(139, 92, 246, 0.2)' }
                },
              }}
            />
          </Box>
        </Zoom>

        {/* Holographic Category Tabs */}
        <Zoom in timeout={1000}>
          <Box sx={{ mb: 5, ...glass, p: 1.5, display: 'inline-flex', width: '100%', overflowX: 'auto', '&::-webkit-scrollbar': { display: 'none' } }}>
            <Tabs
              value={selectedCategory} onChange={handleCategoryChange}
              variant="scrollable" scrollButtons="auto"
              sx={{
                width: '100%',
                '& .MuiTabs-flexContainer': { gap: 1 },
                '& .MuiTab-root': {
                  minHeight: 64, py: 1, px: 3, borderRadius: '20px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, textTransform: 'capitalize', fontSize: '0.95rem',
                  display: 'flex', flexDirection: 'row', gap: 1.5, opacity: 1, border: '1px solid transparent', transition: 'all 0.4s ease',
                  '&:hover': { color: 'white', background: 'rgba(255, 255, 255, 0.05)' },
                },
                '& .Mui-selected': {
                  color: 'white !important', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', filter: 'drop-shadow(0 0 10px rgba(139,92,246,0.3))'
                },
                '& .MuiTabs-indicator': { display: 'none' },
              }}
            >
              {categories.map((category, index) => (
                <Tab
                  key={category.id}
                  icon={<Box sx={{ color: selectedCategory === index ? category.color : 'rgba(255,255,255,0.4)', transition: 'color 0.3s', display: 'flex' }}>{category.icon}</Box>}
                  iconPosition="start"
                  label={category.name}
                />
              ))}
            </Tabs>
          </Box>
        </Zoom>

        {/* Discovery Metrics Interface */}
        <Fade in timeout={1200}>
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', ...glass, p: 2, px: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'white', letterSpacing: '0.02em' }}>
                {filteredVendors.length}
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                Entities Logged
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Chip icon={<TrendingUpIcon sx={{ color: 'white !important' }} />} label="Highly Recommended" 
                sx={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)', color: 'white', fontWeight: 800, border: 'none', px: 1 }} />
              <Chip icon={<VerifiedIcon sx={{ color: '#06B6D4 !important' }} />} label="Fully Verified" 
                variant="outlined" sx={{ borderColor: 'rgba(6, 182, 212, 0.5)', color: 'white', fontWeight: 600, background: 'rgba(6, 182, 212, 0.05)' }} />
            </Box>
          </Box>
        </Fade>

        {/* Vendors Grid Matrix */}
        {filteredVendors.length > 0 ? (
          <Grid container spacing={4}>
            {filteredVendors.map((vendor, index) => (
              <Grid item xs={12} sm={6} lg={4} key={vendor.id}>
                <Zoom in timeout={400 + index * 100}>
                  <Card
                    sx={{
                      display: 'flex', flexDirection: 'column', height: '100%',
                      background: 'rgba(255, 255, 255, 0.02)', backdropFilter: 'blur(30px)',
                      borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)',
                      overflow: 'hidden', position: 'relative',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        transform: 'translateY(-10px)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
                        borderColor: 'rgba(139, 92, 246, 0.3)',
                        '& .MuiCardMedia-root': { transform: 'scale(1.05)' },
                      },
                    }}
                  >
                    {/* Media Display */}
                    <Box sx={{ position: 'relative', height: 240, overflow: 'hidden' }}>
                      <CardMedia
                        component="img" height="240" image={vendor.image_url} alt={vendor.name}
                        sx={{ objectFit: 'cover', width: '100%', transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}
                      />
                      <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 50%, rgba(13, 17, 23, 0.9) 100%)' }} />
                      
                      {/* Interaction Layer */}
                      <IconButton onClick={() => toggleFavorite(vendor.id)} sx={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', '&:hover': { background: 'rgba(236,72,153,0.2)', transform: 'scale(1.1)' } }}>
                        {favorites.includes(vendor.id) ? <FavoriteIcon sx={{ color: '#F43F5E' }} /> : <FavoriteBorderIcon sx={{ color: 'white' }} />}
                      </IconButton>

                      {vendor.verified && (
                        <Chip icon={<VerifiedIcon sx={{ color: 'white !important', fontSize: '1rem !important' }} />} label="Secure" size="small"
                          sx={{ position: 'absolute', top: 16, left: 16, background: 'linear-gradient(135deg, #06B6D4, #3B82F6)', color: 'white', fontWeight: 800, textTransform: 'uppercase', border: 'none', height: 28 }}
                        />
                      )}

                      <Chip label={vendor.availability} size="small"
                        sx={{
                          position: 'absolute', bottom: 16, right: 16,
                          background: vendor.availability === 'Available' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                          color: vendor.availability === 'Available' ? '#34D399' : '#FBBF24',
                          border: `1px solid ${vendor.availability === 'Available' ? '#10B981' : '#F59E0B'}`,
                          fontWeight: 800, backdropFilter: 'blur(10px)', textTransform: 'uppercase', letterSpacing: '0.05em'
                        }}
                      />
                      
                      <Box sx={{ position: 'absolute', bottom: 16, left: 16, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Rating value={vendor.rating} precision={0.1} readOnly size="small" sx={{ color: '#FBBF24', '& .MuiRating-iconEmpty': { color: 'rgba(255,255,255,0.3)' } }} />
                        <Typography variant="body2" sx={{ fontWeight: 800, color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                          {vendor.rating} <Typography component="span" sx={{ color: 'rgba(255,255,255,0.6)', ml: 0.5, fontWeight: 500, fontSize: '0.8rem' }}>({vendor.reviewCount})</Typography>
                        </Typography>
                      </Box>
                    </Box>

                    {/* Data Block */}
                    <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: 'white', lineHeight: 1.3, pr: 2 }}>
                          {vendor.name}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                        <Chip label={categories.find(c => c.id === vendor.category)?.name} size="small"
                          sx={{ background: 'rgba(139, 92, 246, 0.1)', color: '#A78BFA', fontWeight: 700, border: '1px solid rgba(139, 92, 246, 0.3)' }} />
                      </Box>

                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mb: 3, lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {vendor.description}
                      </Typography>

                      <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {vendor.specialties.slice(0, 3).map((specialty, idx) => (
                          <Chip key={idx} label={specialty} size="small" sx={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', fontWeight: 500 }} />
                        ))}
                      </Box>

                      <Box sx={{ flexGrow: 1 }} />
                      
                      <Box sx={{ p: 2, background: 'rgba(0,0,0,0.2)', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, border: '1px solid rgba(255,255,255,0.02)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationOnIcon sx={{ fontSize: 18, color: '#A78BFA', mr: 0.8 }} />
                          <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>{vendor.location}</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block', fontWeight: 700, textTransform: 'uppercase' }}>Financial</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 900, color: '#34D399', letterSpacing: '0.1em' }}>{vendor.priceRange}</Typography>
                        </Box>
                      </Box>

                      <Button component={Link} to={`/vendors/${vendor.id}`} fullWidth variant="contained"
                        sx={{
                          background: 'rgba(255,255,255,0.05)', color: 'white', borderRadius: '16px', py: 1.8, fontWeight: 800, textTransform: 'none', fontSize: '1rem', border: '1px solid rgba(255,255,255,0.1)',
                          transition: 'all 0.3s ease', '&:hover': { background: 'white', color: '#0d1117', transform: 'translateY(-2px)' }
                        }}
                      >
                        Access Portfolio
                      </Button>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Fade in>
            <Box sx={{ ...glass, textAlign: 'center', p: { xs: 4, md: 8 }, maxWidth: 600, mx: 'auto', mt: 4 }}>
              <BusinessIcon sx={{ fontSize: 80, color: 'rgba(255,255,255,0.1)', mb: 3 }} />
              <Typography variant="h4" sx={{ mb: 2, color: 'white', fontWeight: 900 }}>
                Signal Lost
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, color: 'rgba(255,255,255,0.5)', fontSize: '1.1rem' }}>
                No entities match your current configuration parameters.
              </Typography>
              <Button onClick={() => { setSelectedCategory(0); setSearchTerm(''); }} variant="contained"
                sx={{ background: 'linear-gradient(135deg, #8B5CF6, #EC4899)', borderRadius: '16px', px: 5, py: 1.5, fontWeight: 800, textTransform: 'none' }}>
                Revert Filters
              </Button>
            </Box>
          </Fade>
        )}
      </Box>
    </Box>
  );
};

export default VendorsPage;
