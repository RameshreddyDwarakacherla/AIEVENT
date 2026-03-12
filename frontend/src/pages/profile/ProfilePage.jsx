import { useState } from 'react';
import {
  Box, Typography, Grid, TextField, Button, Avatar,
  IconButton, Switch, Divider, Chip, Tooltip, LinearProgress,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

// Icons
import PersonIcon        from '@mui/icons-material/Person';
import EmailIcon         from '@mui/icons-material/Email';
import PhoneIcon         from '@mui/icons-material/Phone';
import EditIcon          from '@mui/icons-material/Edit';
import SaveIcon          from '@mui/icons-material/Save';
import CloseIcon         from '@mui/icons-material/Close';
import CameraAltIcon     from '@mui/icons-material/CameraAlt';
import SecurityIcon      from '@mui/icons-material/Security';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EventIcon         from '@mui/icons-material/Event';
import BookOnlineIcon    from '@mui/icons-material/BookOnline';
import StarIcon          from '@mui/icons-material/Star';
import VerifiedIcon      from '@mui/icons-material/Verified';
import LockIcon          from '@mui/icons-material/Lock';
import DeleteIcon        from '@mui/icons-material/Delete';
import CheckCircleIcon   from '@mui/icons-material/CheckCircle';
import LinkIcon          from '@mui/icons-material/Link';
import LocationOnIcon    from '@mui/icons-material/LocationOn';

/* ── shared glass card style ── */
const glass = {
  background: 'rgba(255,255,255,0.04)',
  backdropFilter: 'blur(24px)',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: '20px',
};

/* ── reusable dark text field ── */
const DarkField = ({ label, value, onChange, disabled, type = 'text', icon, helper, placeholder }) => (
  <Box>
    <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', mb: 0.8 }}>
      {label}
    </Typography>
    <Box sx={{
      display: 'flex', alignItems: 'center', gap: 1.2,
      px: 2, py: 1.5,
      background: disabled ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.06)',
      border: `1px solid ${disabled ? 'rgba(255,255,255,0.06)' : 'rgba(139,92,246,0.3)'}`,
      borderRadius: '14px',
      transition: 'all 0.2s',
      '&:focus-within': { borderColor: '#8B5CF6', background: 'rgba(139,92,246,0.08)' },
    }}>
      {icon && <Box sx={{ color: 'rgba(255,255,255,0.3)', display: 'flex', flexShrink: 0 }}>{icon}</Box>}
      <TextField
        fullWidth type={type}
        placeholder={placeholder || label}
        value={value} onChange={onChange} disabled={disabled}
        variant="standard"
        InputProps={{ disableUnderline: true }}
        sx={{
          '& .MuiInputBase-root': { color: disabled ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.85)', fontSize: '0.9rem' },
          '& input::placeholder': { color: 'rgba(255,255,255,0.2)', opacity: 1 },
        }}
      />
    </Box>
    {helper && <Typography sx={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.72rem', mt: 0.5, pl: 0.5 }}>{helper}</Typography>}
  </Box>
);

/* ── toggle row ── */
const ToggleRow = ({ label, sub, checked, onChange, color = '#8B5CF6' }) => (
  <Box sx={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    py: 2, borderBottom: '1px solid rgba(255,255,255,0.05)',
    '&:last-child': { borderBottom: 'none' },
  }}>
    <Box>
      <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: '0.9rem' }}>{label}</Typography>
      {sub && <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', mt: 0.3 }}>{sub}</Typography>}
    </Box>
    <Switch
      checked={checked} onChange={onChange} size="small"
      sx={{
        '& .MuiSwitch-switchBase.Mui-checked': { color },
        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: color },
        '& .MuiSwitch-track': { backgroundColor: 'rgba(255,255,255,0.15)' },
      }}
    />
  </Box>
);

/* ── stat card ── */
const StatCard = ({ icon, value, label, color }) => (
  <Box sx={{
    ...glass,
    p: 2.5, textAlign: 'center',
    transition: 'transform 0.2s',
    '&:hover': { transform: 'translateY(-4px)' },
  }}>
    <Box sx={{ width: 44, height: 44, borderRadius: '14px', background: `${color}20`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5, color }}>
      {icon}
    </Box>
    <Typography sx={{ fontWeight: 800, fontSize: '1.6rem', color: 'white', lineHeight: 1 }}>{value}</Typography>
    <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontWeight: 600, mt: 0.5 }}>{label}</Typography>
  </Box>
);

/* ══════════════════════════════════════════════════════ */
const ProfilePage = () => {
  const { user, userRole } = useAuth();

  const [tab, setTab] = useState(0);
  const [editing, setEditing] = useState(false);
  const [notifs, setNotifs] = useState({ email: true, push: false, marketing: false, booking: true, events: true });
  const [passwords, setPasswords] = useState({ current: '', newPw: '', confirm: '' });

  const [profile, setProfile] = useState({
    email:     user?.email     || '',
    firstName: user?.firstName || '',
    lastName:  user?.lastName  || '',
    phone:     user?.phone     || '',
    location:  '',
    website:   '',
    bio:       '',
  });

  const getInitials = () => {
    if (profile.firstName && profile.lastName)
      return `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase();
    if (profile.email) return profile.email[0].toUpperCase();
    return 'U';
  };

  const displayName = profile.firstName || profile.lastName
    ? `${profile.firstName} ${profile.lastName}`.trim()
    : profile.email?.split('@')[0] || 'User';

  const roleGrad = userRole === 'vendor'
    ? 'linear-gradient(135deg,#6D28D9,#8B5CF6)'
    : userRole === 'admin'
      ? 'linear-gradient(135deg,#DC2626,#EC4899)'
      : 'linear-gradient(135deg,#8B5CF6,#EC4899)';

  const profileComplete = [
    profile.firstName, profile.lastName, profile.phone, profile.location, profile.website, profile.bio
  ].filter(Boolean).length;
  const completePct = Math.round((profileComplete / 6) * 100);

  const tabs = [
    { label: 'Profile',       icon: <PersonIcon sx={{ fontSize: 18 }} /> },
    { label: 'Security',      icon: <SecurityIcon sx={{ fontSize: 18 }} /> },
    { label: 'Notifications', icon: <NotificationsIcon sx={{ fontSize: 18 }} /> },
  ];

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #0d1117 0%, #1a0533 55%, #0d1117 100%)',
      fontFamily: '"Inter","Roboto",sans-serif',
      width: '100%', boxSizing: 'border-box',
    }}>
      {/* ── decorative orbs ── */}
      {[
        { w: 500, h: 500, top: -150, left: -100, c: 'rgba(139,92,246,0.10)' },
        { w: 350, h: 350, top: '50%', right: -80,  c: 'rgba(236,72,153,0.08)' },
        { w: 250, h: 250, bottom: 50, left: '40%', c: 'rgba(16,185,129,0.06)' },
      ].map((o, i) => (
        <Box key={i} sx={{
          position: 'fixed', borderRadius: '50%', background: o.c,
          width: o.w, height: o.h, top: o.top, left: o.left, right: o.right, bottom: o.bottom,
          filter: 'blur(70px)', pointerEvents: 'none', zIndex: 0,
        }} />
      ))}

      <Box sx={{ position: 'relative', zIndex: 1 }}>

        {/* ═══════ HERO COVER BANNER ═══════ */}
        <Box sx={{
          height: { xs: 180, md: 240 },
          background: 'linear-gradient(135deg,#1E0B3E 0%,#2D1458 40%,#1E0B3E 100%)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* mesh lines */}
          <Box sx={{
            position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(rgba(139,92,246,0.08) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,0.08) 1px,transparent 1px)',
            backgroundSize: '40px 40px',
          }} />
          {/* glows */}
          <Box sx={{ position: 'absolute', top: -60, left: '30%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(139,92,246,0.25)', filter: 'blur(60px)' }} />
          <Box sx={{ position: 'absolute', top: -40, right: '15%', width: 200, height: 200, borderRadius: '50%', background: 'rgba(236,72,153,0.18)', filter: 'blur(50px)' }} />

          {/* cover photo edit hint */}
          <Tooltip title="Change cover photo">
            <Box sx={{
              position: 'absolute', bottom: 12, right: 16,
              display: 'flex', alignItems: 'center', gap: 0.8,
              px: 1.5, py: 0.7, borderRadius: '10px', cursor: 'pointer',
              background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.12)',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s',
              '&:hover': { background: 'rgba(0,0,0,0.55)' },
            }}>
              <CameraAltIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }} />
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.72rem', fontWeight: 600 }}>Edit Cover</Typography>
            </Box>
          </Tooltip>
        </Box>

        {/* ═══════ PROFILE HEADER ═══════ */}
        <Box sx={{ px: { xs: 2, md: 4 }, pb: 3, position: 'relative' }}>
          <Box sx={{
            display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 2, mt: -5,
          }}>
            {/* avatar cluster */}
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2 }}>
              <Box sx={{ position: 'relative' }}>
                {/* ring */}
                <Box sx={{
                  width: 110, height: 110, borderRadius: '50%',
                  background: 'linear-gradient(135deg,#8B5CF6,#EC4899,#8B5CF6)',
                  backgroundSize: '200%',
                  p: '3px',
                  animation: 'spin 4s linear infinite',
                  '@keyframes spin': { from: { backgroundPosition: '0% 50%' }, to: { backgroundPosition: '200% 50%' } },
                }}>
                  <Avatar sx={{
                    width: '100%', height: '100%',
                    background: roleGrad,
                    fontSize: '2rem', fontWeight: 900,
                    border: '3px solid #0d1117',
                  }}>
                    {getInitials()}
                  </Avatar>
                </Box>
                <Tooltip title="Change photo">
                  <IconButton size="small" sx={{
                    position: 'absolute', bottom: 4, right: 4,
                    background: 'linear-gradient(135deg,#8B5CF6,#EC4899)',
                    color: 'white', width: 28, height: 28,
                    boxShadow: '0 4px 12px rgba(139,92,246,0.5)',
                    '&:hover': { transform: 'scale(1.15)' },
                    transition: 'transform 0.2s',
                  }}>
                    <CameraAltIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Tooltip>
              </Box>

              <Box sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.4 }}>
                  <Typography sx={{ fontWeight: 900, fontSize: { xs: '1.4rem', md: '1.8rem' }, color: 'white', letterSpacing: '-0.02em' }}>
                    {displayName}
                  </Typography>
                  <VerifiedIcon sx={{ color: '#8B5CF6', fontSize: 20 }} />
                </Box>
                <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', mb: 1 }}>
                  {profile.email}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label={`${userRole || 'User'} Account`}
                    size="small"
                    sx={{ background: roleGrad, color: 'white', fontWeight: 700, fontSize: '0.72rem', height: 22 }}
                  />
                  {profile.location && (
                    <Chip
                      icon={<LocationOnIcon sx={{ fontSize: '0.85rem !important', color: 'rgba(255,255,255,0.5) !important' }} />}
                      label={profile.location}
                      size="small"
                      sx={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.55)', fontSize: '0.72rem', height: 22, border: '1px solid rgba(255,255,255,0.1)' }}
                    />
                  )}
                </Box>
              </Box>
            </Box>

            {/* action buttons */}
            <Box sx={{ display: 'flex', gap: 1.5, pb: 1 }}>
              {editing ? (
                <>
                  <Button
                    variant="outlined" startIcon={<CloseIcon />}
                    onClick={() => setEditing(false)}
                    sx={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)', borderRadius: '12px', px: 2.5, textTransform: 'none', fontWeight: 600, '&:hover': { borderColor: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.05)' } }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained" startIcon={<SaveIcon />}
                    onClick={() => { toast.success('Profile saved!'); setEditing(false); }}
                    sx={{ background: 'linear-gradient(135deg,#8B5CF6,#EC4899)', borderRadius: '12px', px: 3, textTransform: 'none', fontWeight: 700, boxShadow: '0 4px 16px rgba(139,92,246,0.4)', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(139,92,246,0.5)' }, transition: 'all 0.2s' }}
                  >
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained" startIcon={<EditIcon />}
                  onClick={() => setEditing(true)}
                  sx={{ background: 'linear-gradient(135deg,#8B5CF6,#EC4899)', borderRadius: '12px', px: 3, textTransform: 'none', fontWeight: 700, boxShadow: '0 4px 16px rgba(139,92,246,0.4)', '&:hover': { transform: 'translateY(-2px)' }, transition: 'all 0.2s' }}
                >
                  Edit Profile
                </Button>
              )}
            </Box>
          </Box>

          {/* profile completion bar */}
          <Box sx={{ mt: 3, ...glass, p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', fontWeight: 700 }}>Profile Completion</Typography>
                <Typography sx={{ color: '#8B5CF6', fontSize: '0.78rem', fontWeight: 800 }}>{completePct}%</Typography>
              </Box>
              <LinearProgress
                variant="determinate" value={completePct}
                sx={{
                  height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.08)',
                  '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg,#8B5CF6,#EC4899)', borderRadius: 3 },
                }}
              />
            </Box>
            <Chip
              icon={<CheckCircleIcon sx={{ fontSize: '1rem !important', color: completePct === 100 ? '#10B981 !important' : '#8B5CF6 !important' }} />}
              label={completePct === 100 ? 'Complete!' : 'Add more info'}
              size="small"
              sx={{ background: completePct === 100 ? 'rgba(16,185,129,0.12)' : 'rgba(139,92,246,0.12)', color: completePct === 100 ? '#10B981' : '#A78BFA', border: `1px solid ${completePct === 100 ? 'rgba(16,185,129,0.25)' : 'rgba(139,92,246,0.25)'}`, fontWeight: 700, fontSize: '0.72rem' }}
            />
          </Box>
        </Box>

        {/* ═══════ BODY ═══════ */}
        <Box sx={{ px: { xs: 2, md: 4 }, pb: 6 }}>
          <Grid container spacing={3}>

            {/* ── LEFT: stats + quick links ── */}
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {/* stat cards */}
                <Grid container spacing={1.5}>
                  {[
                    { icon: <EventIcon sx={{ fontSize: 20 }} />,      value: 0,   label: 'Events',   color: '#8B5CF6' },
                    { icon: <BookOnlineIcon sx={{ fontSize: 20 }} />,  value: 0,   label: 'Bookings', color: '#EC4899' },
                    { icon: <StarIcon sx={{ fontSize: 20 }} />,        value: '—', label: 'Rating',   color: '#F59E0B' },
                    { icon: <VerifiedIcon sx={{ fontSize: 20 }} />,    value: '✓', label: 'Verified', color: '#10B981' },
                  ].map(s => (
                    <Grid item xs={6} key={s.label}>
                      <StatCard {...s} />
                    </Grid>
                  ))}
                </Grid>

                {/* quick links */}
                <Box sx={{ ...glass, p: 2.5 }}>
                  <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', mb: 2 }}>
                    Quick Links
                  </Typography>
                  {[
                    { label: 'My Events', icon: <EventIcon />, color: '#8B5CF6' },
                    { label: 'Bookings', icon: <BookOnlineIcon />, color: '#EC4899' },
                    { label: 'Settings', icon: <SecurityIcon />, color: '#10B981' },
                  ].map(l => (
                    <Box key={l.label} sx={{
                      display: 'flex', alignItems: 'center', gap: 1.5, py: 1.2, cursor: 'pointer',
                      borderRadius: '10px', px: 1, transition: 'all 0.18s',
                      '&:hover': { background: 'rgba(255,255,255,0.05)', pl: 2 },
                    }}>
                      <Box sx={{ color: l.color, display: 'flex', fontSize: 18 }}>{l.icon}</Box>
                      <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.87rem', fontWeight: 600 }}>{l.label}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>

            {/* ── RIGHT: tabs ── */}
            <Grid item xs={12} md={9}>
              {/* tab strip */}
              <Box sx={{
                display: 'flex', gap: 0.5, mb: 3,
                ...glass, p: 0.7, width: 'fit-content', borderRadius: '16px',
              }}>
                {tabs.map((t, i) => (
                  <Box
                    key={t.label}
                    onClick={() => setTab(i)}
                    sx={{
                      display: 'flex', alignItems: 'center', gap: 0.8,
                      px: { xs: 1.5, sm: 2.5 }, py: 1.1, borderRadius: '12px', cursor: 'pointer',
                      background: tab === i ? 'linear-gradient(135deg,#8B5CF6,#7C3AED)' : 'transparent',
                      boxShadow: tab === i ? '0 4px 14px rgba(139,92,246,0.4)' : 'none',
                      transition: 'all 0.22s ease',
                      '&:hover': tab !== i ? { background: 'rgba(255,255,255,0.05)' } : {},
                    }}
                  >
                    <Box sx={{ color: tab === i ? 'white' : 'rgba(255,255,255,0.4)', display: 'flex' }}>{t.icon}</Box>
                    <Typography sx={{ color: tab === i ? 'white' : 'rgba(255,255,255,0.45)', fontWeight: 700, fontSize: '0.85rem', display: { xs: 'none', sm: 'block' } }}>{t.label}</Typography>
                  </Box>
                ))}
              </Box>

              {/* ── TAB 0: Profile ── */}
              {tab === 0 && (
                <Box sx={{ ...glass, p: { xs: 2.5, md: 4 }, animation: 'fadeIn 0.25s ease', '@keyframes fadeIn': { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } } }}>
                  <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: 'white', mb: 0.5 }}>Personal Information</Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem', mb: 3.5 }}>
                    {editing ? 'Editing your public profile info.' : 'Your public profile information.'}
                  </Typography>

                  <Grid container spacing={2.5}>
                    <Grid item xs={12} sm={6}>
                      <DarkField label="First Name" value={profile.firstName} icon={<PersonIcon sx={{ fontSize: 18 }} />}
                        onChange={e => setProfile(p => ({ ...p, firstName: e.target.value }))} disabled={!editing} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <DarkField label="Last Name" value={profile.lastName} icon={<PersonIcon sx={{ fontSize: 18 }} />}
                        onChange={e => setProfile(p => ({ ...p, lastName: e.target.value }))} disabled={!editing} />
                    </Grid>
                    <Grid item xs={12}>
                      <DarkField label="Email Address" value={profile.email} icon={<EmailIcon sx={{ fontSize: 18 }} />}
                        disabled helper="Email address cannot be changed" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <DarkField label="Phone Number" value={profile.phone} icon={<PhoneIcon sx={{ fontSize: 18 }} />}
                        placeholder="+1 (555) 000-0000"
                        onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} disabled={!editing} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <DarkField label="Location" value={profile.location} icon={<LocationOnIcon sx={{ fontSize: 18 }} />}
                        placeholder="City, Country"
                        onChange={e => setProfile(p => ({ ...p, location: e.target.value }))} disabled={!editing} />
                    </Grid>
                    <Grid item xs={12}>
                      <DarkField label="Website / Social Link" value={profile.website} icon={<LinkIcon sx={{ fontSize: 18 }} />}
                        placeholder="https://"
                        onChange={e => setProfile(p => ({ ...p, website: e.target.value }))} disabled={!editing} />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', mb: 0.8 }}>Bio</Typography>
                      <Box sx={{
                        background: editing ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${editing ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.06)'}`,
                        borderRadius: '14px', px: 2, py: 1.5,
                        '&:focus-within': { borderColor: '#8B5CF6' },
                      }}>
                        <TextField
                          fullWidth multiline minRows={3} maxRows={5}
                          placeholder="Tell others a bit about yourself…"
                          value={profile.bio} disabled={!editing}
                          onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                          variant="standard" InputProps={{ disableUnderline: true }}
                          sx={{
                            '& .MuiInputBase-root': { color: editing ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.35)', fontSize: '0.9rem' },
                            '& textarea::placeholder': { color: 'rgba(255,255,255,0.2)', opacity: 1 },
                          }}
                        />
                      </Box>
                    </Grid>
                  </Grid>

                  {editing && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 3 }}>
                      <Button onClick={() => setEditing(false)} sx={{ color: 'rgba(255,255,255,0.5)', textTransform: 'none', borderRadius: '12px', px: 2.5 }}>Cancel</Button>
                      <Button variant="contained" startIcon={<SaveIcon />}
                        onClick={() => { toast.success('Profile updated!'); setEditing(false); }}
                        sx={{ background: 'linear-gradient(135deg,#8B5CF6,#EC4899)', borderRadius: '12px', px: 3, textTransform: 'none', fontWeight: 700, boxShadow: '0 4px 16px rgba(139,92,246,0.4)' }}
                      >Save Changes</Button>
                    </Box>
                  )}
                </Box>
              )}

              {/* ── TAB 1: Security ── */}
              {tab === 1 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, animation: 'fadeIn 0.25s ease', '@keyframes fadeIn': { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } } }}>
                  {/* change password */}
                  <Box sx={{ ...glass, p: { xs: 2.5, md: 4 } }}>
                    <Box sx={{ display: 'flex', gap: 1.5, mb: 3, alignItems: 'center' }}>
                      <Box sx={{ width: 40, height: 40, borderRadius: '12px', background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B5CF6' }}>
                        <LockIcon sx={{ fontSize: 20 }} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 800, color: 'white', fontSize: '1rem' }}>Change Password</Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem' }}>Use a strong, unique password</Typography>
                      </Box>
                    </Box>
                    <Grid container spacing={2.5}>
                      <Grid item xs={12}>
                        <DarkField label="Current Password" type="password" value={passwords.current} icon={<LockIcon sx={{ fontSize: 18 }} />}
                          onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))} placeholder="••••••••" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <DarkField label="New Password" type="password" value={passwords.newPw} icon={<LockIcon sx={{ fontSize: 18 }} />}
                          onChange={e => setPasswords(p => ({ ...p, newPw: e.target.value }))} placeholder="min. 8 characters" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <DarkField label="Confirm Password" type="password" value={passwords.confirm} icon={<LockIcon sx={{ fontSize: 18 }} />}
                          onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))} placeholder="repeat new password" />
                      </Grid>
                    </Grid>
                    <Button
                      variant="contained"
                      onClick={() => { toast.success('Password updated!'); setPasswords({ current: '', newPw: '', confirm: '' }); }}
                      sx={{ mt: 3, background: 'linear-gradient(135deg,#8B5CF6,#7C3AED)', borderRadius: '12px', px: 3, textTransform: 'none', fontWeight: 700, boxShadow: '0 4px 16px rgba(139,92,246,0.35)' }}
                    >Update Password</Button>
                  </Box>

                  {/* active sessions */}
                  <Box sx={{ ...glass, p: { xs: 2.5, md: 4 } }}>
                    <Typography sx={{ fontWeight: 800, color: 'white', mb: 0.5, fontSize: '1rem' }}>Active Sessions</Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', mb: 2.5 }}>Devices currently signed into your account</Typography>
                    {[
                      { device: 'Chrome on Windows', location: 'India', time: 'Active now', current: true },
                      { device: 'Safari on iPhone',   location: 'India', time: '2 hours ago', current: false },
                    ].map((s, i) => (
                      <Box key={i} sx={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        py: 1.8, borderBottom: i === 0 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                      }}>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem', fontWeight: 600 }}>{s.device}</Typography>
                            {s.current && <Chip label="Current" size="small" sx={{ height: 18, fontSize: '0.65rem', background: 'rgba(16,185,129,0.12)', color: '#10B981', border: '1px solid rgba(16,185,129,0.25)', fontWeight: 700 }} />}
                          </Box>
                          <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>{s.location} · {s.time}</Typography>
                        </Box>
                        {!s.current && (
                          <Button size="small" sx={{ color: '#EF4444', textTransform: 'none', fontWeight: 700, fontSize: '0.78rem', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px', px: 1.5, '&:hover': { background: 'rgba(239,68,68,0.08)' } }}>Revoke</Button>
                        )}
                      </Box>
                    ))}
                  </Box>

                  {/* danger zone */}
                  <Box sx={{ ...glass, p: { xs: 2.5, md: 4 }, borderColor: 'rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.04)' }}>
                    <Box sx={{ display: 'flex', gap: 1.5, mb: 2, alignItems: 'center' }}>
                      <Box sx={{ width: 40, height: 40, borderRadius: '12px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}>
                        <DeleteIcon sx={{ fontSize: 20 }} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 800, color: '#EF4444', fontSize: '1rem' }}>Danger Zone</Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem' }}>Permanent, irreversible actions</Typography>
                      </Box>
                    </Box>
                    <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', mb: 2.5, lineHeight: 1.6 }}>
                      Deleting your account will permanently remove all your data, events, and bookings. This action cannot be undone.
                    </Typography>
                    <Button
                      variant="outlined" startIcon={<DeleteIcon />}
                      sx={{ borderColor: 'rgba(239,68,68,0.4)', color: '#EF4444', borderRadius: '12px', px: 2.5, textTransform: 'none', fontWeight: 700, '&:hover': { background: 'rgba(239,68,68,0.08)', borderColor: '#EF4444' } }}
                    >Delete My Account</Button>
                  </Box>
                </Box>
              )}

              {/* ── TAB 2: Notifications ── */}
              {tab === 2 && (
                <Box sx={{ ...glass, p: { xs: 2.5, md: 4 }, animation: 'fadeIn 0.25s ease', '@keyframes fadeIn': { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } } }}>
                  <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: 'white', mb: 0.5 }}>Notification Preferences</Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem', mb: 3 }}>Choose what you want to be notified about</Typography>

                  {[
                    { key: 'email',     label: 'Email Notifications',  sub: 'Receive email updates about your events and bookings', color: '#8B5CF6' },
                    { key: 'push',      label: 'Push Notifications',   sub: 'Browser push notifications for real-time alerts',      color: '#EC4899' },
                    { key: 'booking',   label: 'Booking Updates',      sub: 'Get notified when vendors respond to your requests',    color: '#10B981' },
                    { key: 'events',    label: 'Event Reminders',      sub: 'Reminders 24h and 1h before your events',              color: '#F59E0B' },
                    { key: 'marketing', label: 'Marketing & Offers',   sub: 'Promotional emails and exclusive vendor deals',         color: '#6D28D9' },
                  ].map(n => (
                    <ToggleRow key={n.key} label={n.label} sub={n.sub} color={n.color}
                      checked={notifs[n.key]}
                      onChange={e => setNotifs(prev => ({ ...prev, [n.key]: e.target.checked }))}
                    />
                  ))}

                  <Button
                    variant="contained"
                    onClick={() => toast.success('Notification preferences saved!')}
                    sx={{ mt: 3, background: 'linear-gradient(135deg,#8B5CF6,#EC4899)', borderRadius: '12px', px: 3, textTransform: 'none', fontWeight: 700, boxShadow: '0 4px 16px rgba(139,92,246,0.4)' }}
                  >Save Preferences</Button>
                </Box>
              )}
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
