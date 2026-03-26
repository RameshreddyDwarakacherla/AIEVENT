import { useState, useEffect, createContext, useContext } from 'react';
import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from './Header';
import Footer from './Footer';

const SIDEBAR_EXPANDED = 240;
const SIDEBAR_COLLAPSED = 72;

// Sidebar context so children can subscribe to collapse events without polling
export const SidebarContext = createContext({
  collapsed: false,
  sidebarWidth: SIDEBAR_EXPANDED,
  toggleCollapsed: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

const Layout = ({ children }) => {
  const location = useLocation();
  const { userRole } = useAuth();
  const [collapsed, setCollapsed] = useState(() => {
    try {
      const saved = localStorage.getItem('sidebarCollapsed');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const sidebarWidth = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('sidebarCollapsed', JSON.stringify(next));
      return next;
    });
  };

  // Check if current page is an admin page
  const isAdminPage = location.pathname.startsWith('/admin') || location.pathname.startsWith('/dashboard/admin');
  const isVendorPage = location.pathname.startsWith('/vendor') || location.pathname.startsWith('/dashboard/vendor');

  // Get background gradient based on user role and current page
  const getBackgroundGradient = () => {
    return 'linear-gradient(135deg, #ffffff 0%, #f8fafc 25%, #f1f5f9 50%, #e2e8f0 75%, #cbd5e1 100%)';
  };

  const getRadialGradients = () => {
    return `
      radial-gradient(circle at 20% 80%, rgba(0, 0, 0, 0.02) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(0, 0, 0, 0.02) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(0, 0, 0, 0.01) 0%, transparent 50%)
    `;
  };

  // Sync sidebarCollapsed changes from the Header component (it also writes to localStorage)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'sidebarCollapsed') {
        try {
          setCollapsed(JSON.parse(e.newValue));
        } catch { /* ignore */ }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <SidebarContext.Provider value={{ collapsed, sidebarWidth, toggleCollapsed }}>
      <Box sx={{ 
        display: 'flex', 
        minHeight: '100vh', 
        width: '100%', 
        overflow: 'hidden',
        background: getBackgroundGradient(),
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: getRadialGradients(),
          pointerEvents: 'none',
          zIndex: 0,
        },
      }}>
        {/* Sidebar */}
        <Header onToggleCollapsed={toggleCollapsed} collapsed={collapsed} />

        {/* Main content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            width: { xs: '100%', md: `calc(100% - ${sidebarWidth}px)` },
            maxWidth: { xs: '100%', md: `calc(100% - ${sidebarWidth}px)` },
            ml: { xs: 0, md: `${sidebarWidth}px` },
            mt: { xs: '64px', md: 0 },
            transition: 'margin-left 0.3s cubic-bezier(0.4,0,0.2,1), width 0.3s cubic-bezier(0.4,0,0.2,1)',
            overflow: 'hidden',
            position: 'relative',
            zIndex: 2,
            background: 'transparent',
          }}
        >
          <Box sx={{ flexGrow: 1, width: '100%', overflowX: 'hidden' }}>
            {children}
          </Box>
          <Footer />
        </Box>
      </Box>
    </SidebarContext.Provider>
  );
};

export default Layout;