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
  Divider,
  TextField,
  Switch,
  FormControlLabel,
  Slider,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import SettingsIcon from '@mui/icons-material/Settings';
import TuneIcon from '@mui/icons-material/Tune';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import BarChartIcon from '@mui/icons-material/BarChart';
import SecurityIcon from '@mui/icons-material/Security';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import StoreIcon from '@mui/icons-material/Store';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const SystemSettingsPage = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [settings, setSettings] = useState({
    general: {
      siteName: 'AI Event Planner',
      contactEmail: 'support@eventplanner.com',
      maxEventsPerUser: 10,
      maxGuestsPerEvent: 500,
      enablePublicEvents: true
    },
    ai: {
      enableAIRecommendations: true,
      recommendationConfidence: 75,
      maxRecommendationsPerEvent: 10,
      enableAutoSuggestions: true,
      aiModelVersion: '1.0.0'
    },
    notifications: {
      enableEmailNotifications: true,
      enablePushNotifications: false,
      reminderDays: 7,
      sendWeeklySummary: true,
      adminAlerts: true
    },
    security: {
      requireEmailVerification: true,
      passwordMinLength: 8,
      sessionTimeout: 60,
      enableTwoFactor: false,
      allowSocialLogin: true
    }
  });

  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    totalVendors: 0,
    totalEvents: 0,
    activeEvents: 0,
    aiRecommendationsGenerated: 0,
    aiRecommendationsApplied: 0
  });

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentSetting, setCurrentSetting] = useState(null);

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        // Check if user is admin using the userRole from context
        if (userRole !== 'admin') {
          throw new Error('You do not have admin privileges');
        }

        fetchSettings();
        fetchSystemStats();
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

  const fetchSettings = async () => {
    try {
      setLoading(true);

      // For now, we'll use default settings since we don't have a system_settings table
      // In a real implementation, you would fetch from your settings API
      console.log('Using default settings - no system_settings API endpoint available');
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSystemStats = async () => {
    try {
      // Fetch user count
      const usersResponse = await api.get('/users/stats');
      const usersCount = usersResponse.success ? usersResponse.data.total : 0;

      // Fetch vendor count
      const vendorsResponse = await api.get('/vendors/admin-stats');
      const vendorsCount = vendorsResponse.success ? vendorsResponse.data.total : 0;

      // Fetch event count
      const eventsResponse = await api.get('/events/admin-stats');
      const eventsCount = eventsResponse.success ? eventsResponse.data.total : 0;
      const activeEventsCount = eventsResponse.success ? eventsResponse.data.active : 0;

      // Mock AI recommendations stats since we don't have this endpoint yet
      const aiRecsCount = 0;
      const aiRecsAppliedCount = 0;

      setSystemStats({
        totalUsers: usersCount || 0,
        totalVendors: vendorsCount || 0,
        totalEvents: eventsCount || 0,
        activeEvents: activeEventsCount || 0,
        aiRecommendationsGenerated: aiRecsCount || 0,
        aiRecommendationsApplied: aiRecsAppliedCount || 0
      });
    } catch (err) {
      console.error('Error fetching system stats:', err);
      // Don't set error state here to avoid blocking the settings display
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);

      // For now, we'll just show a success message since we don't have a settings API
      // In a real implementation, you would save to your settings API
      console.log('Settings to save:', settings);
      toast.success('Settings saved successfully (demo mode)');
    } catch (err) {
      console.error('Error saving settings:', err);
      setError(err.message);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleEditSetting = (category, key, currentValue) => {
    setCurrentSetting({
      category,
      key,
      value: currentValue
    });
    setEditDialogOpen(true);
  };

  const handleUpdateSetting = () => {
    if (!currentSetting) return;

    const { category, key, value } = currentSetting;

    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));

    setEditDialogOpen(false);
  };

  const renderSettingValue = (value) => {
    if (typeof value === 'boolean') {
      return value ? 'Enabled' : 'Disabled';
    } else if (typeof value === 'number') {
      return value.toString();
    } else {
      return value;
    }
  };

  const renderSettingEditor = () => {
    if (!currentSetting) return null;

    const { category, key, value } = currentSetting;

    if (typeof value === 'boolean') {
      return (
        <FormControlLabel
          control={
            <Switch
              checked={value}
              onChange={(e) => setCurrentSetting({ ...currentSetting, value: e.target.checked })}
            />
          }
          label={value ? 'Enabled' : 'Disabled'}
        />
      );
    } else if (typeof value === 'number') {
      // Special case for slider values
      if (key === 'recommendationConfidence' || key === 'passwordMinLength' || key === 'sessionTimeout' || key === 'reminderDays') {
        let min = 0;
        let max = 100;
        let step = 1;

        if (key === 'recommendationConfidence') {
          min = 50;
          max = 100;
          step = 5;
        } else if (key === 'passwordMinLength') {
          min = 6;
          max = 16;
          step = 1;
        } else if (key === 'sessionTimeout') {
          min = 15;
          max = 240;
          step = 15;
        } else if (key === 'reminderDays') {
          min = 1;
          max = 30;
          step = 1;
        }

        return (
          <Box sx={{ width: '100%' }}>
            <Slider
              value={value}
              min={min}
              max={max}
              step={step}
              onChange={(e, newValue) => setCurrentSetting({ ...currentSetting, value: newValue })}
              valueLabelDisplay="auto"
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption">{min}</Typography>
              <Typography variant="body1">{value}</Typography>
              <Typography variant="caption">{max}</Typography>
            </Box>
          </Box>
        );
      } else {
        return (
          <TextField
            type="number"
            value={value}
            onChange={(e) => setCurrentSetting({ ...currentSetting, value: parseInt(e.target.value) })}
            fullWidth
          />
        );
      }
    } else {
      return (
        <TextField
          value={value}
          onChange={(e) => setCurrentSetting({ ...currentSetting, value: e.target.value })}
          fullWidth
        />
      );
    }
  };

  if (loading) {
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
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      sx={{ p: { xs: 2, md: 4 }, background: 'transparent', minHeight: '100vh' }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'white', mb: 1 }}>
            System Intelligence
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)' }}>
            Configure and monitor core platform parameters
          </Typography>
        </Box>
        <Button
          variant="contained"
          sx={{
            background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
            boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)',
            borderRadius: 3,
            px: 4, py: 1.2,
            fontWeight: 700,
            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(139, 92, 246, 0.5)' }
          }}
          startIcon={<SaveIcon />}
          onClick={handleSaveSettings}
          disabled={saving}
        >
          {saving ? 'Syncing...' : 'Save All Changes'}
        </Button>
      </Box>

      {/* System Stats Row */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {[
          { label: 'Platform Users', value: systemStats.totalUsers, icon: <PeopleIcon />, color: '#6366F1' },
          { label: 'Active Vendors', value: systemStats.totalVendors, icon: <StoreIcon />, color: '#10B981' },
          { label: 'Platform Events', value: systemStats.totalEvents, icon: <EventIcon />, color: '#F472B6' },
          { label: 'AI Generated', value: systemStats.aiRecommendationsGenerated, icon: <SmartToyIcon />, color: '#FBBF24' }
        ].map((stat, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card 
              component={motion.div}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              sx={{ 
                background: 'rgba(255,255,255,0.03)', 
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 4
              }}
            >
              <CardContent sx={{ p: 2.5, textAlign: 'center' }}>
                <Box sx={{ color: stat.color, mb: 1.5, display: 'flex', justifyContent: 'center' }}>
                  {stat.icon}
                </Box>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 800 }}>{stat.value}</Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Settings Tabs */}
      <Paper 
        elevation={0}
        sx={{ 
          width: '100%', 
          background: 'rgba(255,255,255,0.02)', 
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 5,
          overflow: 'hidden'
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'rgba(255,255,255,0.06)' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            sx={{
              px: 2,
              '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0', background: 'linear-gradient(90deg, #8B5CF6, #EC4899)' },
              '& .MuiTab-root': { color: 'rgba(255,255,255,0.4)', fontWeight: 600, py: 2.5 },
              '& .Mui-selected': { color: 'white !important' }
            }}
          >
            <Tab icon={<SettingsIcon sx={{ fontSize: 20 }} />} label="General" />
            <Tab icon={<SmartToyIcon sx={{ fontSize: 20 }} />} label="AI Engine" />
            <Tab icon={<NotificationsIcon sx={{ fontSize: 20 }} />} label="Notifications" />
            <Tab icon={<SecurityIcon sx={{ fontSize: 20 }} />} label="Security" />
          </Tabs>
        </Box>

        {/* General Settings */}
        <TabPanel value={tabValue} index={0}>
          <List>
            {Object.keys(settings.general).map((key) => (
              <ListItem
                key={key}
                secondaryAction={
                  <IconButton edge="end" onClick={() => handleEditSetting('general', key, settings.general[key])}>
                    <EditIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={formatSettingName(key)}
                  secondary={renderSettingValue(settings.general[key])}
                />
              </ListItem>
            ))}
          </List>
        </TabPanel>

        {/* AI Settings */}
        <TabPanel value={tabValue} index={1}>
          <List>
            {Object.keys(settings.ai).map((key) => (
              <ListItem
                key={key}
                secondaryAction={
                  <IconButton edge="end" onClick={() => handleEditSetting('ai', key, settings.ai[key])}>
                    <EditIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={formatSettingName(key)}
                  secondary={renderSettingValue(settings.ai[key])}
                />
              </ListItem>
            ))}
          </List>
        </TabPanel>

        {/* Notification Settings */}
        <TabPanel value={tabValue} index={2}>
          <List>
            {Object.keys(settings.notifications).map((key) => (
              <ListItem
                key={key}
                secondaryAction={
                  <IconButton edge="end" onClick={() => handleEditSetting('notifications', key, settings.notifications[key])}>
                    <EditIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={formatSettingName(key)}
                  secondary={renderSettingValue(settings.notifications[key])}
                />
              </ListItem>
            ))}
          </List>
        </TabPanel>

        {/* Security Settings */}
        <TabPanel value={tabValue} index={3}>
          <List>
            {Object.keys(settings.security).map((key) => (
              <ListItem
                key={key}
                secondaryAction={
                  <IconButton edge="end" onClick={() => handleEditSetting('security', key, settings.security[key])}>
                    <EditIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={formatSettingName(key)}
                  secondary={renderSettingValue(settings.security[key])}
                />
              </ListItem>
            ))}
          </List>
        </TabPanel>
      </Paper>

      {/* Edit Setting Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>
          Edit {currentSetting ? formatSettingName(currentSetting.key) : ''}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {renderSettingEditor()}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateSetting} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Helper function to format setting names
const formatSettingName = (key) => {
  // Convert camelCase to Title Case with spaces
  const formatted = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  return formatted;
};

// TabPanel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default SystemSettingsPage;