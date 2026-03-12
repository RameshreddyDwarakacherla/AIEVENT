import { useState } from 'react';
import {
  Box, Typography, Switch, Slider, Select, MenuItem,
  Button, TextField, Divider, Avatar, Chip, Alert,
  Snackbar, CircularProgress, Tabs, Tab, FormControl,
  InputLabel, ToggleButtonGroup, ToggleButton,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Palette as PaletteIcon,
  Security as SecurityIcon,
  Language as LanguageIcon,
  AccountCircle as AccountIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  VolumeUp as VolumeIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  CheckCircle as CheckCircleIcon,
  Save as SaveIcon,
  Refresh as ResetIcon,
  Speed as SpeedIcon,
  Storage as StorageIcon,
  Shield as ShieldIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

// ── Animated Section Card ──────────────────────────────────────────────
const SettingsCard = ({ icon, title, subtitle, children, delay = 0 }) => (
  <Box
    sx={{
      background: 'rgba(255,255,255,0.05)',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      border: '1px solid rgba(255,255,255,0.10)',
      p: { xs: 2.5, md: 3.5 },
      mb: 3,
      position: 'relative',
      overflow: 'hidden',
      animation: `slideUp 0.5s ease-out ${delay}s both`,
      transition: 'all 0.3s ease',
      '&:hover': {
        border: '1px solid rgba(139,92,246,0.3)',
        boxShadow: '0 8px 32px rgba(139,92,246,0.12)',
      },
      '&::before': {
        content: '""',
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, #8B5CF6, #EC4899, #8B5CF6)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 3s linear infinite',
      },
      '@keyframes slideUp': {
        from: { opacity: 0, transform: 'translateY(24px)' },
        to: { opacity: 1, transform: 'translateY(0)' },
      },
      '@keyframes shimmer': {
        '0%': { backgroundPosition: '200% 0' },
        '100%': { backgroundPosition: '-200% 0' },
      },
    }}
  >
    {/* Card Header */}
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
      <Box sx={{
        width: 44, height: 44, borderRadius: '12px',
        background: 'linear-gradient(135deg, rgba(139,92,246,0.3) 0%, rgba(236,72,153,0.3) 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '1px solid rgba(139,92,246,0.3)',
      }}>
        {icon}
      </Box>
      <Box>
        <Typography sx={{ fontWeight: 700, color: 'white', fontSize: '1rem' }}>{title}</Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem' }}>{subtitle}</Typography>
      </Box>
    </Box>
    {children}
  </Box>
);

// ── Toggle Row ─────────────────────────────────────────────────────────
const ToggleRow = ({ label, description, checked, onChange }) => (
  <Box sx={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    py: 1.5, px: 0,
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    '&:last-child': { borderBottom: 'none' },
  }}>
    <Box>
      <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600, fontSize: '0.9rem' }}>
        {label}
      </Typography>
      {description && (
        <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', mt: 0.3 }}>
          {description}
        </Typography>
      )}
    </Box>
    <Switch
      checked={checked}
      onChange={onChange}
      sx={{
        '& .MuiSwitch-switchBase.Mui-checked': { color: '#A78BFA' },
        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#7C3AED' },
      }}
    />
  </Box>
);

// ── Main Settings Page ─────────────────────────────────────────────────
const SettingsPage = () => {
  const { user, userRole, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailEvents: true,
    emailBookings: true,
    emailMessages: false,
    pushAll: true,
    pushBookings: true,
    pushMessages: true,
    weeklyDigest: false,
    marketingEmails: false,
  });

  // Appearance settings
  const [appearance, setAppearance] = useState({
    theme: 'dark',
    accentColor: '#8B5CF6',
    fontSize: 14,
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    timezone: 'Asia/Kolkata',
    animations: true,
    compactMode: false,
  });

  // Security settings
  const [security, setSecurity] = useState({
    twoFactor: false,
    loginNotifications: true,
    sessionTimeout: 30,
    showPassword: false,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showEmail: false,
    showPhone: false,
    analyticsConsent: true,
    dataSharing: false,
  });

  const accentColors = [
    '#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4',
  ];

  const handleSave = async (section) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    setSaving(false);
    setSnackbar({ open: true, message: `${section} settings saved successfully!`, severity: 'success' });
  };

  const tabLabels = [
    { label: 'Notifications', icon: <NotificationsIcon fontSize="small" /> },
    { label: 'Appearance', icon: <PaletteIcon fontSize="small" /> },
    { label: 'Security', icon: <SecurityIcon fontSize="small" /> },
    { label: 'Privacy', icon: <ShieldIcon fontSize="small" /> },
  ];

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F0C29 0%, #302b63 50%, #24243e 100%)',
      backgroundAttachment: 'fixed',
      p: { xs: 2, md: 4 },
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background decoration */}
      <Box sx={{
        position: 'fixed', top: -200, right: -200,
        width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <Box sx={{
        position: 'fixed', bottom: -200, left: -200,
        width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <Box sx={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: { sm: '100%', lg: 1000 }, mx: 'auto' }}>
        {/* ── Page Header ── */}
        <Box sx={{
          mb: 4,
          animation: 'headerSlide 0.6s ease-out both',
          '@keyframes headerSlide': {
            from: { opacity: 0, transform: 'translateY(-20px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
          },
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Box sx={{
              width: 56, height: 56, borderRadius: '16px',
              background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(139,92,246,0.4)',
              animation: 'iconSpin 0.8s ease-out 0.3s both',
              '@keyframes iconSpin': {
                from: { transform: 'rotate(-15deg) scale(0.8)', opacity: 0 },
                to: { transform: 'rotate(0deg) scale(1)', opacity: 1 },
              },
            }}>
              <SpeedIcon sx={{ fontSize: 28, color: 'white' }} />
            </Box>
            <Box>
              <Typography sx={{
                fontWeight: 900, fontSize: { xs: '1.8rem', md: '2.2rem' },
                background: 'linear-gradient(135deg, #E9D5FF 0%, #F9A8D4 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                Settings
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
                Customize your EventMaster experience
              </Typography>
            </Box>
          </Box>

          {/* User info chip */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 2 }}>
            <Avatar sx={{
              width: 32, height: 32,
              background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
              fontSize: '0.85rem', fontWeight: 700,
            }}>
              {user?.email?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
              {user?.email}
            </Typography>
            <Chip
              label={userRole || 'user'}
              size="small"
              sx={{
                background: 'rgba(139,92,246,0.2)',
                color: '#A78BFA',
                border: '1px solid rgba(139,92,246,0.3)',
                fontWeight: 700,
                fontSize: '0.7rem',
                textTransform: 'capitalize',
              }}
            />
          </Box>
        </Box>

        {/* ── Tabs ── */}
        <Box sx={{
          mb: 3,
          animation: 'slideUp 0.5s ease-out 0.1s both',
          '@keyframes slideUp': {
            from: { opacity: 0, transform: 'translateY(24px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
          },
        }}>
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              background: 'rgba(255,255,255,0.04)',
              borderRadius: '14px',
              p: 0.75,
              border: '1px solid rgba(255,255,255,0.08)',
              '& .MuiTabs-indicator': {
                background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                borderRadius: '8px',
                height: '100%',
                zIndex: 0,
              },
              '& .MuiTab-root': {
                color: 'rgba(255,255,255,0.5)',
                fontWeight: 600,
                fontSize: '0.85rem',
                zIndex: 1,
                borderRadius: '10px',
                minHeight: 44,
                gap: 0.8,
                transition: 'all 0.2s ease',
              },
              '& .Mui-selected': {
                color: 'white !important',
                fontWeight: 700,
              },
            }}
          >
            {tabLabels.map((t) => (
              <Tab key={t.label} label={t.label} icon={t.icon} iconPosition="start" />
            ))}
          </Tabs>
        </Box>

        {/* ─────────────────── TAB PANELS ─────────────────── */}

        {/* ── Tab 0: Notifications ── */}
        {activeTab === 0 && (
          <Box>
            <SettingsCard
              icon={<NotificationsIcon sx={{ color: '#A78BFA', fontSize: 22 }} />}
              title="Email Notifications"
              subtitle="Control what emails you receive"
              delay={0}
            >
              <ToggleRow
                label="Event Reminders"
                description="Get notified before your events"
                checked={notifications.emailEvents}
                onChange={(e) => setNotifications({ ...notifications, emailEvents: e.target.checked })}
              />
              <ToggleRow
                label="Booking Updates"
                description="Notifications about vendor bookings"
                checked={notifications.emailBookings}
                onChange={(e) => setNotifications({ ...notifications, emailBookings: e.target.checked })}
              />
              <ToggleRow
                label="New Messages"
                description="Email alerts for new messages"
                checked={notifications.emailMessages}
                onChange={(e) => setNotifications({ ...notifications, emailMessages: e.target.checked })}
              />
              <ToggleRow
                label="Weekly Digest"
                description="Summary of your weekly activity"
                checked={notifications.weeklyDigest}
                onChange={(e) => setNotifications({ ...notifications, weeklyDigest: e.target.checked })}
              />
              <ToggleRow
                label="Marketing Emails"
                description="Product updates and promotions"
                checked={notifications.marketingEmails}
                onChange={(e) => setNotifications({ ...notifications, marketingEmails: e.target.checked })}
              />
            </SettingsCard>

            <SettingsCard
              icon={<VolumeIcon sx={{ color: '#A78BFA', fontSize: 22 }} />}
              title="Push Notifications"
              subtitle="In-app notification preferences"
              delay={0.1}
            >
              <ToggleRow
                label="All Notifications"
                description="Master toggle for all push notifications"
                checked={notifications.pushAll}
                onChange={(e) => setNotifications({ ...notifications, pushAll: e.target.checked })}
              />
              <ToggleRow
                label="Booking Alerts"
                description="Instant alerts for booking changes"
                checked={notifications.pushBookings}
                onChange={(e) => setNotifications({ ...notifications, pushBookings: e.target.checked })}
              />
              <ToggleRow
                label="Message Alerts"
                description="Real-time message notifications"
                checked={notifications.pushMessages}
                onChange={(e) => setNotifications({ ...notifications, pushMessages: e.target.checked })}
              />
            </SettingsCard>

            <Button
              onClick={() => handleSave('Notification')}
              disabled={saving}
              startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
              sx={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                color: 'white', fontWeight: 700, px: 4, py: 1.5,
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(139,92,246,0.4)',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 28px rgba(139,92,246,0.5)' },
                transition: 'all 0.2s ease',
              }}
            >
              {saving ? 'Saving…' : 'Save Notifications'}
            </Button>
          </Box>
        )}

        {/* ── Tab 1: Appearance ── */}
        {activeTab === 1 && (
          <Box>
            <SettingsCard
              icon={<PaletteIcon sx={{ color: '#A78BFA', fontSize: 22 }} />}
              title="Theme & Colors"
              subtitle="Personalize the visual style"
              delay={0}
            >
              {/* Theme toggle */}
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', mb: 1.5, fontWeight: 600 }}>
                  Color Theme
                </Typography>
                <ToggleButtonGroup
                  value={appearance.theme}
                  exclusive
                  onChange={(_, v) => v && setAppearance({ ...appearance, theme: v })}
                  sx={{ gap: 1 }}
                >
                  {[
                    { value: 'dark', icon: <DarkModeIcon />, label: 'Dark' },
                    { value: 'light', icon: <LightModeIcon />, label: 'Light' },
                  ].map((opt) => (
                    <ToggleButton
                      key={opt.value}
                      value={opt.value}
                      sx={{
                        borderRadius: '10px !important',
                        border: '1px solid rgba(255,255,255,0.12) !important',
                        color: 'rgba(255,255,255,0.5)',
                        px: 3, py: 1.2, gap: 1,
                        fontWeight: 600, fontSize: '0.85rem',
                        '&.Mui-selected': {
                          background: 'rgba(139,92,246,0.25) !important',
                          color: '#A78BFA !important',
                          border: '1px solid rgba(139,92,246,0.5) !important',
                        },
                      }}
                    >
                      {opt.icon} {opt.label}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Box>

              {/* Accent colors */}
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', mb: 1.5, fontWeight: 600 }}>
                  Accent Color
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                  {accentColors.map((color) => (
                    <Box
                      key={color}
                      onClick={() => setAppearance({ ...appearance, accentColor: color })}
                      sx={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: color,
                        cursor: 'pointer',
                        border: appearance.accentColor === color
                          ? '3px solid white'
                          : '3px solid transparent',
                        boxShadow: appearance.accentColor === color
                          ? `0 0 0 2px ${color}, 0 4px 12px ${color}80`
                          : `0 2px 8px ${color}60`,
                        transition: 'all 0.2s ease',
                        transform: appearance.accentColor === color ? 'scale(1.15)' : 'scale(1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      {appearance.accentColor === color && (
                        <CheckCircleIcon sx={{ fontSize: 16, color: 'white' }} />
                      )}
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Font size */}
              <Box sx={{ mb: 2 }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', mb: 1.5, fontWeight: 600 }}>
                  Font Size — {appearance.fontSize}px
                </Typography>
                <Slider
                  value={appearance.fontSize}
                  min={12} max={20} step={1}
                  onChange={(_, v) => setAppearance({ ...appearance, fontSize: v })}
                  sx={{
                    color: '#8B5CF6',
                    '& .MuiSlider-thumb': {
                      background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                      boxShadow: '0 4px 12px rgba(139,92,246,0.5)',
                      '&:hover': { transform: 'scale(1.2)' },
                    },
                    '& .MuiSlider-track': {
                      background: 'linear-gradient(90deg, #8B5CF6, #EC4899)',
                      border: 'none',
                    },
                    '& .MuiSlider-rail': { background: 'rgba(255,255,255,0.15)' },
                  }}
                />
              </Box>
            </SettingsCard>

            <SettingsCard
              icon={<LanguageIcon sx={{ color: '#A78BFA', fontSize: 22 }} />}
              title="Language & Region"
              subtitle="Localization preferences"
              delay={0.1}
            >
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ color: 'rgba(255,255,255,0.5)' }}>Language</InputLabel>
                  <Select
                    value={appearance.language}
                    label="Language"
                    onChange={(e) => setAppearance({ ...appearance, language: e.target.value })}
                    sx={{
                      color: 'white', borderRadius: '10px',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.15)' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(139,92,246,0.5)' },
                      '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.5)' },
                    }}
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="hi">Hindi</MenuItem>
                    <MenuItem value="es">Spanish</MenuItem>
                    <MenuItem value="fr">French</MenuItem>
                    <MenuItem value="de">German</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth size="small">
                  <InputLabel sx={{ color: 'rgba(255,255,255,0.5)' }}>Date Format</InputLabel>
                  <Select
                    value={appearance.dateFormat}
                    label="Date Format"
                    onChange={(e) => setAppearance({ ...appearance, dateFormat: e.target.value })}
                    sx={{
                      color: 'white', borderRadius: '10px',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.15)' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(139,92,246,0.5)' },
                      '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.5)' },
                    }}
                  >
                    <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                    <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                    <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth size="small" sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                  <InputLabel sx={{ color: 'rgba(255,255,255,0.5)' }}>Timezone</InputLabel>
                  <Select
                    value={appearance.timezone}
                    label="Timezone"
                    onChange={(e) => setAppearance({ ...appearance, timezone: e.target.value })}
                    sx={{
                      color: 'white', borderRadius: '10px',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.15)' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(139,92,246,0.5)' },
                      '& .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.5)' },
                    }}
                  >
                    <MenuItem value="Asia/Kolkata">India Standard Time (IST)</MenuItem>
                    <MenuItem value="America/New_York">Eastern Time (ET)</MenuItem>
                    <MenuItem value="America/Los_Angeles">Pacific Time (PT)</MenuItem>
                    <MenuItem value="Europe/London">Greenwich Mean Time (GMT)</MenuItem>
                    <MenuItem value="Europe/Paris">Central European Time (CET)</MenuItem>
                    <MenuItem value="Asia/Dubai">Gulf Standard Time (GST)</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <ToggleRow
                label="Enable Animations"
                description="Smooth transitions and micro-animations"
                checked={appearance.animations}
                onChange={(e) => setAppearance({ ...appearance, animations: e.target.checked })}
              />
              <ToggleRow
                label="Compact Mode"
                description="Reduce spacing for denser layouts"
                checked={appearance.compactMode}
                onChange={(e) => setAppearance({ ...appearance, compactMode: e.target.checked })}
              />
            </SettingsCard>

            <Button
              onClick={() => handleSave('Appearance')}
              disabled={saving}
              startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
              sx={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                color: 'white', fontWeight: 700, px: 4, py: 1.5,
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(139,92,246,0.4)',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 28px rgba(139,92,246,0.5)' },
                transition: 'all 0.2s ease',
              }}
            >
              {saving ? 'Saving…' : 'Save Appearance'}
            </Button>
          </Box>
        )}

        {/* ── Tab 2: Security ── */}
        {activeTab === 2 && (
          <Box>
            <SettingsCard
              icon={<SecurityIcon sx={{ color: '#A78BFA', fontSize: 22 }} />}
              title="Change Password"
              subtitle="Update your account password"
              delay={0}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { label: 'Current Password', key: 'currentPassword' },
                  { label: 'New Password', key: 'newPassword' },
                  { label: 'Confirm New Password', key: 'confirmPassword' },
                ].map((field) => (
                  <TextField
                    key={field.key}
                    label={field.label}
                    type={security.showPassword ? 'text' : 'password'}
                    value={security[field.key]}
                    onChange={(e) => setSecurity({ ...security, [field.key]: e.target.value })}
                    size="small"
                    fullWidth
                    InputProps={{
                      endAdornment: field.key === 'confirmPassword' ? (
                        <Box
                          onClick={() => setSecurity({ ...security, showPassword: !security.showPassword })}
                          sx={{ cursor: 'pointer', color: 'rgba(255,255,255,0.5)', display: 'flex' }}
                        >
                          {security.showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                        </Box>
                      ) : null,
                    }}
                    sx={{
                      '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
                      '& .MuiOutlinedInput-root': {
                        color: 'white', borderRadius: '10px',
                        '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
                        '&:hover fieldset': { borderColor: 'rgba(139,92,246,0.5)' },
                        '&.Mui-focused fieldset': { borderColor: '#8B5CF6' },
                      },
                    }}
                  />
                ))}

                {security.newPassword && security.confirmPassword && security.newPassword !== security.confirmPassword && (
                  <Alert
                    severity="error"
                    sx={{ background: 'rgba(239,68,68,0.1)', color: '#FCA5A5', border: '1px solid rgba(239,68,68,0.2)' }}
                  >
                    Passwords do not match
                  </Alert>
                )}
              </Box>
            </SettingsCard>

            <SettingsCard
              icon={<ShieldIcon sx={{ color: '#A78BFA', fontSize: 22 }} />}
              title="Security Options"
              subtitle="Protect your account"
              delay={0.1}
            >
              <ToggleRow
                label="Two-Factor Authentication"
                description="Add an extra layer of security to your account"
                checked={security.twoFactor}
                onChange={(e) => setSecurity({ ...security, twoFactor: e.target.checked })}
              />
              <ToggleRow
                label="Login Notifications"
                description="Get notified of new sign-ins"
                checked={security.loginNotifications}
                onChange={(e) => setSecurity({ ...security, loginNotifications: e.target.checked })}
              />

              <Box sx={{ mt: 2 }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', mb: 1.5, fontWeight: 600 }}>
                  Session Timeout — {security.sessionTimeout} minutes
                </Typography>
                <Slider
                  value={security.sessionTimeout}
                  min={5} max={120} step={5}
                  marks={[{ value: 15, label: '15m' }, { value: 60, label: '1h' }, { value: 120, label: '2h' }]}
                  onChange={(_, v) => setSecurity({ ...security, sessionTimeout: v })}
                  sx={{
                    color: '#8B5CF6',
                    '& .MuiSlider-thumb': {
                      background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                      boxShadow: '0 4px 12px rgba(139,92,246,0.5)',
                    },
                    '& .MuiSlider-track': {
                      background: 'linear-gradient(90deg, #8B5CF6, #EC4899)', border: 'none',
                    },
                    '& .MuiSlider-markLabel': { color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' },
                    '& .MuiSlider-rail': { background: 'rgba(255,255,255,0.15)' },
                  }}
                />
              </Box>
            </SettingsCard>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                onClick={() => handleSave('Security')}
                disabled={saving}
                startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                sx={{
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                  color: 'white', fontWeight: 700, px: 4, py: 1.5, borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(139,92,246,0.4)',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 28px rgba(139,92,246,0.5)' },
                  transition: 'all 0.2s ease',
                }}
              >
                {saving ? 'Saving…' : 'Update Password'}
              </Button>
              <Button
                startIcon={<ResetIcon />}
                onClick={() => setSecurity({ ...security, currentPassword: '', newPassword: '', confirmPassword: '' })}
                sx={{
                  color: 'rgba(255,255,255,0.6)', fontWeight: 700, px: 3, py: 1.5, borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.12)',
                  '&:hover': { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)' },
                }}
              >
                Clear Fields
              </Button>
            </Box>
          </Box>
        )}

        {/* ── Tab 3: Privacy ── */}
        {activeTab === 3 && (
          <Box>
            <SettingsCard
              icon={<ShieldIcon sx={{ color: '#A78BFA', fontSize: 22 }} />}
              title="Profile Privacy"
              subtitle="Control who can see your information"
              delay={0}
            >
              <ToggleRow
                label="Public Profile"
                description="Allow others to view your profile"
                checked={privacy.profileVisible}
                onChange={(e) => setPrivacy({ ...privacy, profileVisible: e.target.checked })}
              />
              <ToggleRow
                label="Show Email Address"
                description="Display email on your public profile"
                checked={privacy.showEmail}
                onChange={(e) => setPrivacy({ ...privacy, showEmail: e.target.checked })}
              />
              <ToggleRow
                label="Show Phone Number"
                description="Display phone number on your public profile"
                checked={privacy.showPhone}
                onChange={(e) => setPrivacy({ ...privacy, showPhone: e.target.checked })}
              />
            </SettingsCard>

            <SettingsCard
              icon={<StorageIcon sx={{ color: '#A78BFA', fontSize: 22 }} />}
              title="Data & Analytics"
              subtitle="Control your data preferences"
              delay={0.1}
            >
              <ToggleRow
                label="Analytics Consent"
                description="Help us improve by sharing anonymous usage data"
                checked={privacy.analyticsConsent}
                onChange={(e) => setPrivacy({ ...privacy, analyticsConsent: e.target.checked })}
              />
              <ToggleRow
                label="Data Sharing with Vendors"
                description="Allow vendors to see your event preferences"
                checked={privacy.dataSharing}
                onChange={(e) => setPrivacy({ ...privacy, dataSharing: e.target.checked })}
              />

              <Divider sx={{ my: 2.5, borderColor: 'rgba(255,255,255,0.06)' }} />

              <Box sx={{
                p: 2.5, borderRadius: '12px',
                background: 'rgba(239,68,68,0.06)',
                border: '1px solid rgba(239,68,68,0.15)',
              }}>
                <Typography sx={{ color: '#FCA5A5', fontWeight: 700, fontSize: '0.9rem', mb: 0.5 }}>
                  Danger Zone
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', mb: 2 }}>
                  These actions are irreversible. Please be careful.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    size="small"
                    sx={{
                      color: '#FCA5A5', borderRadius: '8px',
                      border: '1px solid rgba(239,68,68,0.3)',
                      fontWeight: 600, px: 2.5,
                      '&:hover': { background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.5)' },
                    }}
                  >
                    Download My Data
                  </Button>
                  <Button
                    size="small"
                    sx={{
                      color: '#FCA5A5', borderRadius: '8px',
                      border: '1px solid rgba(239,68,68,0.3)',
                      fontWeight: 600, px: 2.5,
                      '&:hover': { background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.5)' },
                    }}
                  >
                    Delete Account
                  </Button>
                </Box>
              </Box>
            </SettingsCard>

            <Button
              onClick={() => handleSave('Privacy')}
              disabled={saving}
              startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
              sx={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                color: 'white', fontWeight: 700, px: 4, py: 1.5, borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(139,92,246,0.4)',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 28px rgba(139,92,246,0.5)' },
                transition: 'all 0.2s ease',
              }}
            >
              {saving ? 'Saving…' : 'Save Privacy Settings'}
            </Button>
          </Box>
        )}
      </Box>

      {/* ── Snackbar ── */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          icon={<CheckCircleIcon />}
          sx={{
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
            color: 'white',
            fontWeight: 600,
            boxShadow: '0 8px 24px rgba(139,92,246,0.4)',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SettingsPage;
