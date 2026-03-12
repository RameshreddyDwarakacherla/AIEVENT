import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';
import { useState, useEffect } from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

// Public Pages
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import EventsPage from '../pages/events/EventsPage';
import VendorsPage from '../pages/vendors/VendorsPage';
import VendorDetailsPage from '../pages/vendors/VendorDetailsPage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import FaqPage from '../pages/FaqPage';
import PrivacyPage from '../pages/PrivacyPage';
import TermsPage from '../pages/TermsPage';
import NotFoundPage from '../pages/NotFoundPage';

// User (Event Organizer) Pages
import UserDashboard from '../pages/user/UserDashboard';
import CreateEventPage from '../pages/user/CreateEventPage';
import ManageEventPage from '../pages/user/ManageEventPage';
import EventDetailsPage from '../pages/user/EventDetailsPage';
import BudgetPlannerPage from '../pages/user/BudgetPlannerPage';
import GuestManagementPage from '../pages/user/GuestManagementPage';
import VendorSearchPage from '../pages/user/VendorSearchPage';
import MyBookingsPage from '../pages/user/MyBookingsPage';

// Vendor Pages
import VendorDashboard from '../pages/vendor/VendorDashboard';
import VendorProfilePage from '../pages/vendor/VendorProfilePage';
import VendorServicesPage from '../pages/vendor/VendorServicesPage';
import AddServicePage from '../pages/vendor/AddServicePage';
import VendorBookingsPage from '../pages/vendor/VendorBookingsPage';
import VendorReviewsPage from '../pages/vendor/VendorReviewsPage';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageUsersPage from '../pages/admin/ManageUsersPage';
import ManageVendorsPage from '../pages/admin/ManageVendorsPage';
import ManageEventsPage from '../pages/admin/ManageEventsPage';
import AnalyticsPage from '../pages/admin/AnalyticsPage';
import SystemSettingsPage from '../pages/admin/SystemSettingsPage';
import DatabaseSetupPage from '../pages/admin/DatabaseSetupPage';

// Shared Pages
import ProfilePage from '../pages/profile/ProfilePage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import NotificationsPage from '../pages/notifications/NotificationsPage';
import MessagesPage from '../pages/messages/MessagesPage';
import SettingsPage from '../pages/user/SettingsPage';

// ─── Loading Spinner ──────────────────────────────────────────────────────────
const LoadingScreen = ({ message = 'Loading...' }) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column',
      gap: 2,
      background: 'linear-gradient(135deg, #0F0C29 0%, #302b63 50%, #24243e 100%)',
    }}
  >
    <CircularProgress sx={{ color: '#A78BFA' }} size={48} />
    <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
      {message}
    </Typography>
  </Box>
);

// ─── Dashboard Redirect ───────────────────────────────────────────────────────
const DashboardRedirect = () => {
  const { user, userRole, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;

  const role = userRole || localStorage.getItem('userRole') || 'user';
  const path =
    role === 'vendor' ? '/dashboard/vendor' :
    role === 'admin'  ? '/dashboard/admin'  :
    '/dashboard/user';

  return <Navigate to={path} replace />;
};

// ─── Protected Route ──────────────────────────────────────────────────────────
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, userRole, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;

  const effectiveRole = userRole || localStorage.getItem('userRole') || 'user';

  if (allowedRoles && !allowedRoles.includes(effectiveRole)) {
    const path =
      effectiveRole === 'vendor' ? '/dashboard/vendor' :
      effectiveRole === 'admin'  ? '/dashboard/admin'  :
      '/dashboard/user';
    return <Navigate to={path} replace />;
  }

  return children;
};

// ─── App Router ───────────────────────────────────────────────────────────────
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/login" element={<Layout><LoginPage /></Layout>} />
        <Route path="/register" element={<Layout><RegisterPage /></Layout>} />
        <Route path="/reset-password" element={<Layout><ResetPasswordPage /></Layout>} />
        <Route path="/events" element={<Layout><EventsPage /></Layout>} />
        <Route path="/vendors" element={<Layout><VendorsPage /></Layout>} />
        <Route path="/vendors/:vendorId" element={<Layout><VendorDetailsPage /></Layout>} />
        <Route path="/about" element={<Layout><AboutPage /></Layout>} />
        <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
        <Route path="/faq" element={<Layout><FaqPage /></Layout>} />
        <Route path="/privacy" element={<Layout><PrivacyPage /></Layout>} />
        <Route path="/terms" element={<Layout><TermsPage /></Layout>} />

        {/* Dashboard Redirect */}
        <Route path="/dashboard" element={<DashboardRedirect />} />

        {/* User Routes */}
        <Route path="/dashboard/user" element={
          <ProtectedRoute allowedRoles={['user']}>
            <Layout><UserDashboard /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/events/create" element={
          <ProtectedRoute allowedRoles={['user']}>
            <Layout><CreateEventPage /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/events/:eventId" element={
          <ProtectedRoute allowedRoles={['user']}>
            <Layout><EventDetailsPage /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/events/:eventId/manage" element={
          <ProtectedRoute allowedRoles={['user']}>
            <Layout><ManageEventPage /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/events/:eventId/budget" element={
          <ProtectedRoute allowedRoles={['user']}>
            <Layout><BudgetPlannerPage /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/events/:eventId/guests" element={
          <ProtectedRoute allowedRoles={['user']}>
            <Layout><GuestManagementPage /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/vendors/search" element={
          <ProtectedRoute allowedRoles={['user']}>
            <Layout><VendorSearchPage /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/user/bookings" element={
          <ProtectedRoute allowedRoles={['user']}>
            <Layout><MyBookingsPage /></Layout>
          </ProtectedRoute>
        } />

        {/* Vendor Routes */}
        <Route path="/dashboard/vendor" element={
          <ProtectedRoute allowedRoles={['vendor']}>
            <Layout><VendorDashboard /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/vendor/profile" element={
          <ProtectedRoute allowedRoles={['vendor']}>
            <Layout><VendorProfilePage /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/vendor/services" element={
          <ProtectedRoute allowedRoles={['vendor']}>
            <Layout><VendorServicesPage /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/vendor/services/add" element={
          <ProtectedRoute allowedRoles={['vendor']}>
            <Layout><AddServicePage /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/vendor/bookings" element={
          <ProtectedRoute allowedRoles={['vendor']}>
            <Layout><VendorBookingsPage /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/vendor/reviews" element={
          <ProtectedRoute allowedRoles={['vendor']}>
            <Layout><VendorReviewsPage /></Layout>
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/dashboard/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout><AdminDashboard /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout><ManageUsersPage /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/admin/database-setup" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout><DatabaseSetupPage /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/admin/vendors" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout><ManageVendorsPage /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/admin/events" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout><ManageEventsPage /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/admin/analytics" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout><AnalyticsPage /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/admin/settings" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout><SystemSettingsPage /></Layout>
          </ProtectedRoute>
        } />

        {/* Shared Routes */}
        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={['user', 'vendor', 'admin']}>
            <Layout><ProfilePage /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/notifications" element={
          <ProtectedRoute allowedRoles={['user', 'vendor', 'admin']}>
            <Layout><NotificationsPage /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/messages" element={
          <ProtectedRoute allowedRoles={['user', 'vendor', 'admin']}>
            <Layout><MessagesPage /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute allowedRoles={['user', 'vendor', 'admin']}>
            <Layout><SettingsPage /></Layout>
          </ProtectedRoute>
        } />

        {/* 404 */}
        <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;