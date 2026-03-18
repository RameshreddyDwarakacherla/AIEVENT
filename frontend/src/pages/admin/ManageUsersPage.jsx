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
  Avatar,
  Tabs,
  Tab,
  InputAdornment,
  Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import RefreshIcon from '@mui/icons-material/Refresh';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { PageContainer } from '../../components/common';

const USER_ROLES = ['user', 'vendor', 'admin'];

const ManageUsersPage = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [userForm, setUserForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    role: 'user',
    is_active: true
  });

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        // Check if user is admin using the userRole from context
        if (userRole !== 'admin') {
          throw new Error('You do not have admin privileges');
        }

        fetchUsers();
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

  const fetchUsers = async () => {
    try {
      setLoading(true);

      // Fetch all users
      const response = await api.get('/users');
      if (!response.success) throw new Error(response.message);

      // Map backend fields to frontend expectations if necessary
      const mappedUsers = (response.data || []).map(u => ({
        ...u,
        id: u._id || u.id,
        first_name: u.firstName,
        last_name: u.lastName,
        avatar_url: u.avatarUrl,
        is_active: u.isActive,
        created_at: u.createdAt,
        last_login: u.lastLogin
      }));

      setUsers(mappedUsers);
      setFilteredUsers(mappedUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    filterUsers(newValue, searchQuery);
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    filterUsers(tabValue, query);
  };

  const filterUsers = (tabIndex, query) => {
    let filtered = users;

    // Filter by role based on tab
    if (tabIndex === 1) { // Users
      filtered = users.filter(user => user.role === 'user');
    } else if (tabIndex === 2) { // Vendors
      filtered = users.filter(user => user.role === 'vendor');
    } else if (tabIndex === 3) { // Admins
      filtered = users.filter(user => user.role === 'admin');
    }

    // Filter by search query
    if (query) {
      const lowercaseQuery = query.toLowerCase();
      filtered = filtered.filter(user =>
        (user.first_name && user.first_name.toLowerCase().includes(lowercaseQuery)) ||
        (user.last_name && user.last_name.toLowerCase().includes(lowercaseQuery)) ||
        (user.email && user.email.toLowerCase().includes(lowercaseQuery))
      );
    }

    setFilteredUsers(filtered);
  };

  const handleEditUser = (userData) => {
    setCurrentUser(userData);
    setUserForm({
      first_name: userData.first_name || '',
      last_name: userData.last_name || '',
      email: userData.email || '',
      role: userData.role || 'user',
      is_active: userData.is_active !== false // Default to true if not set
    });
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (userData) => {
    setCurrentUser(userData);
    setDeleteDialogOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setUserForm({
      ...userForm,
      [name]: name === 'is_active' ? checked : value
    });
  };

  const handleSubmitUser = async () => {
    try {
      setLoading(true);

      if (!currentUser) return;

      // Update user profile
      const response = await api.put(`/users/${currentUser.id}`, {
        firstName: userForm.first_name,
        lastName: userForm.last_name,
        role: userForm.role,
        isActive: userForm.is_active
      });

      if (!response.success) throw new Error(response.message);

      // Role is now stored directly in the profiles table
      // No need to create a separate admin record

      // Refresh user list
      await fetchUsers();
      setEditDialogOpen(false);
      toast.success('User updated successfully');
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err.message);
      toast.error('Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      if (!currentUser) return;

      // In a real application, you might want to implement soft delete instead
      // For this demo, we'll just deactivate the user
      const response = await api.put(`/users/${currentUser.id}`, {
        isActive: !currentUser.is_active
      });

      if (!response.success) throw new Error(response.message);

      // Refresh user list
      await fetchUsers();
      setDeleteDialogOpen(false);
      toast.success('User deactivated successfully');
    } catch (err) {
      console.error('Error deactivating user:', err);
      setError(err.message);
      toast.error('Failed to deactivate user');
    }
  };

  if (loading && users.length === 0) {
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
      title="User Management"
      badge={`${users.length} Total Users`}
    >
      {/* Filters and Search */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="user filter tabs"
              sx={{
                '& .MuiTab-root': {
                  color: 'text.secondary',
                  fontWeight: 600,
                },
                '& .Mui-selected': {
                  color: 'primary.main',
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: 'primary.main',
                }
              }}
            >
              <Tab label="All Users" />
              <Tab label="Event Organizers" />
              <Tab label="Vendors" />
              <Tab label="Admins" />
            </Tabs>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search users..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  '& fieldset': {
                    borderColor: 'rgba(139, 92, 246, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(139, 92, 246, 0.4)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                }
              }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Users Table */}
      <Paper 
        elevation={0}
        sx={{ 
          width: '100%', 
          overflow: 'hidden',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(139, 92, 246, 0.1)',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(139, 92, 246, 0.1)',
        }}
      >
        <TableContainer 
          sx={{ 
            maxHeight: 650,
            '& .MuiTableCell-head': {
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              color: 'text.primary',
              fontWeight: 700,
              borderBottom: '2px solid rgba(139, 92, 246, 0.2)',
            },
            '& .MuiTableCell-body': {
              color: 'text.primary',
            },
            '& .MuiTableRow-root:hover': {
              backgroundColor: 'rgba(139, 92, 246, 0.05)',
            }
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ background: 'rgba(30,30,50,0.8)', color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>User</TableCell>
                <TableCell sx={{ background: 'rgba(30,30,50,0.8)', color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>Email & Contact</TableCell>
                <TableCell sx={{ background: 'rgba(30,30,50,0.8)', color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>Role</TableCell>
                <TableCell sx={{ background: 'rgba(30,30,50,0.8)', color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ background: 'rgba(30,30,50,0.8)', color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>Activity</TableCell>
                <TableCell align="right" sx={{ background: 'rgba(30,30,50,0.8)', color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <AnimatePresence>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((userData, index) => (
                    <TableRow 
                      key={userData.id}
                      component={motion.tr}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      hover
                      sx={{ 
                        '&:hover': { background: 'rgba(255,255,255,0.04) !important' },
                        borderBottom: '1px solid rgba(255,255,255,0.04)'
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar 
                            src={userData.avatar_url} 
                            sx={{ 
                              width: 40, height: 40,
                              background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                              boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                            }}
                          >
                            {userData.first_name ? userData.first_name[0].toUpperCase() : <PersonIcon />}
                          </Avatar>
                          <Box>
                            <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '0.95rem' }}>
                              {userData.first_name} {userData.last_name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                              ID: {userData.id.substring(0, 8)}...
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem' }}>{userData.email}</Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                            {userData.phone || 'No phone provided'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={userData.role?.toUpperCase()}
                          size="small"
                          sx={{
                            background: userData.role === 'admin' ? 'rgba(239, 68, 68, 0.15)' : userData.role === 'vendor' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(139, 92, 246, 0.15)',
                            color: userData.role === 'admin' ? '#FCA5A5' : userData.role === 'vendor' ? '#FBBF24' : '#C4B5FD',
                            fontWeight: 800,
                            borderRadius: '8px',
                            border: '1px solid currentColor',
                            fontSize: '0.65rem'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={userData.is_active !== false ? <CheckCircleIcon style={{ fontSize: 16 }} /> : <BlockIcon style={{ fontSize: 16 }} />}
                          label={userData.is_active !== false ? 'ACTIVE' : 'SUSPENDED'}
                          size="small"
                          sx={{
                            background: userData.is_active !== false ? 'rgba(16, 185, 129, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                            color: userData.is_active !== false ? '#34D399' : '#9CA3AF',
                            fontWeight: 800,
                            borderRadius: '8px',
                            fontSize: '0.65rem'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block' }}>
                            Joined: {userData.created_at ? format(new Date(userData.created_at), 'MMM dd, yyyy') : 'N/A'}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                            Last login: {userData.last_login ? format(new Date(userData.last_login), 'p, MMM dd') : 'Never'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit Permissions">
                          <IconButton
                            onClick={() => handleEditUser(userData)}
                            sx={{ color: '#8B5CF6', '&:hover': { background: 'rgba(139, 92, 246, 0.1)' } }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={userData.is_active !== false ? "Suspend Account" : "Activate Account"}>
                          <IconButton
                            onClick={() => handleDeleteClick(userData)}
                            disabled={userData.id === user.id}
                            sx={{ color: userData.is_active !== false ? '#EF4444' : '#10B981', '&:hover': { background: userData.is_active !== false ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)' } }}
                          >
                            <BlockIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
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
                          background: 'rgba(99, 102, 241, 0.1)', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          mx: 'auto', mb: 3,
                          color: '#818CF8'
                        }}>
                          <PeopleIcon sx={{ fontSize: 40 }} />
                        </Box>
                        <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                          No Users Discovered
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.4)', maxWidth: 400, mx: 'auto' }}>
                          We couldn't find any users matching your criteria. Try widening your search or check if the database is synchronized.
                        </Typography>
                        <Button
                          variant="text"
                          startIcon={<RefreshIcon />}
                          onClick={() => fetchUsers()}
                          sx={{ mt: 3, color: '#818CF8', fontWeight: 700 }}
                        >
                          Synchronize Database
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

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Edit User
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                name="first_name"
                value={userForm.first_name}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                name="last_name"
                value={userForm.last_name}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                value={userForm.email}
                fullWidth
                disabled
                helperText="Email cannot be changed"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Role"
                name="role"
                value={userForm.role}
                onChange={handleInputChange}
                fullWidth
              >
                {USER_ROLES.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Status"
                name="is_active"
                value={userForm.is_active}
                onChange={(e) => setUserForm({ ...userForm, is_active: e.target.value === 'true' })}
                fullWidth
              >
                <MenuItem value="true">Active</MenuItem>
                <MenuItem value="false">Inactive</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSubmitUser}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deactivation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to deactivate the user account for {currentUser?.email}? This will prevent them from logging in.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteUser} color="error">
            Deactivate
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default ManageUsersPage;