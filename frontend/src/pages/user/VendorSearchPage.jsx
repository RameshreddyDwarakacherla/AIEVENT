import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/api';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  MenuItem,
  Box,
  Chip,
  Rating,
  CircularProgress,
  Divider,
  Paper,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CategoryIcon from '@mui/icons-material/Category';
import StarIcon from '@mui/icons-material/Star';

const VendorSearchPage = () => {
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'all',
    location: '',
    priceRange: 'all',
    searchTerm: ''
  });

  useEffect(() => {
    fetchVendors();
    fetchCategories();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/vendors');
      const data = await res.json();
      
      if (data.success) {
        const formatBackendVendors = data.data.map(v => ({
          id: v._id,
          name: v.companyName || 'Unnamed Vendor',
          category: v.vendorType ? v.vendorType.toLowerCase() : 'general',
          description: v.description || 'No description available',
          rating: v.avgRating || 0,
          price_range: v.services && v.services.length > 0 ? (v.services[0].price.includes('$') ? 'budget' : 'moderate') : 'moderate',
          image_url: v.image_url || 'https://images.unsplash.com/photo-1555244162-803834f70033',
          location: v.city && v.state ? `${v.city}, ${v.state}` : (v.city || 'Remote')
        }));
        setVendors(formatBackendVendors);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      setLoading(false);
    }
  };

  const fetchCategories = () => {
    // Mock categories
    setCategories([
      { id: 'catering', name: 'Catering' },
      { id: 'decoration', name: 'Decoration' },
      { id: 'entertainment', name: 'Entertainment' },
      { id: 'photography', name: 'Photography' },
      { id: 'venue', name: 'Venues' },
    ]);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesCategory = filters.category === 'all' || vendor.category === filters.category;
    const matchesLocation = !filters.location || vendor.location.toLowerCase().includes(filters.location.toLowerCase());
    const matchesPriceRange = filters.priceRange === 'all' || vendor.price_range === filters.priceRange;
    const matchesSearch = !filters.searchTerm ||
                          vendor.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                          vendor.description.toLowerCase().includes(filters.searchTerm.toLowerCase());

    return matchesCategory && matchesLocation && matchesPriceRange && matchesSearch;
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Find & Book Vendors for Your Event
      </Typography>

      <Paper elevation={2} sx={{ p: 3, mb: 5, borderRadius: 2, background: 'linear-gradient(to right, #f5f7fa, #ffffff)' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Category"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CategoryIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              size="small"
              variant="outlined"
            >
              <MenuItem value="all">All Categories</MenuItem>
              {categories.map(category => (
                <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Location"
              name="location"
              placeholder="City or state"
              value={filters.location}
              onChange={handleFilterChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              size="small"
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Price Range"
              name="priceRange"
              value={filters.priceRange}
              onChange={handleFilterChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoneyIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              size="small"
              variant="outlined"
            >
              <MenuItem value="all">All Prices</MenuItem>
              <MenuItem value="budget">Budget</MenuItem>
              <MenuItem value="moderate">Moderate</MenuItem>
              <MenuItem value="premium">Premium</MenuItem>
              <MenuItem value="luxury">Luxury</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                label="Search"
                name="searchTerm"
                placeholder="Search vendors..."
                value={filters.searchTerm}
                onChange={handleFilterChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                size="small"
                variant="outlined"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => setFilters({
                  category: 'all',
                  location: '',
                  priceRange: 'all',
                  searchTerm: ''
                })}
                sx={{ minWidth: '40px', px: 1 }}
              >
                Reset
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Loading vendors...
          </Typography>
        </Box>
      ) : filteredVendors.length === 0 ? (
        <Paper elevation={1} sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h5" color="text.secondary">
            No vendors found matching your criteria.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredVendors.map(vendor => (
            <Grid item xs={12} sm={6} lg={4} key={vendor.id}>
              <Card sx={{
                display: 'flex',
                height: '100%',
                borderRadius: 2,
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}>
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%'
                }}>
                  <Box sx={{
                    display: 'flex',
                    position: 'relative',
                    height: '120px',
                    overflow: 'hidden'
                  }}>
                    <CardMedia
                      component="img"
                      sx={{
                        width: '120px',
                        height: '120px',
                        objectFit: 'cover'
                      }}
                      image={vendor.image_url || `https://source.unsplash.com/random/120x120/?${vendor.vendor_type?.toLowerCase() || 'business'}`}
                      alt={vendor.company_name || vendor.name}
                    />
                    <Box sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      width: '100%',
                      background: 'linear-gradient(to right, rgba(255,255,255,0.9), rgba(255,255,255,0.7))'
                    }}>
                      <Box>
                        <Typography variant="h6" component="h2" noWrap>
                          {vendor.company_name || vendor.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Rating
                            value={vendor.rating || 4}
                            readOnly
                            size="small"
                            precision={0.5}
                            emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                          />
                        </Box>
                      </Box>
                      <Chip
                        label={vendor.vendor_type || vendor.category || 'Vendor'}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ alignSelf: 'flex-start' }}
                      />
                    </Box>
                  </Box>
                  <CardContent sx={{ flexGrow: 1, pt: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      height: '40px'
                    }}>
                      {vendor.description || 'No description available'}
                    </Typography>
                    <Button
                      component={Link}
                      to={`/vendors/${vendor.id}`}
                      variant="contained"
                      fullWidth
                      size="small"
                      sx={{ mt: 'auto' }}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default VendorSearchPage;