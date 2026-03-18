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
    if (isAdminPage && userRole === 'admin') {
      return `
        linear-gradient(135deg, rgba(135, 206, 250, 0.3) 0%, rgba(173, 216, 230, 0.3) 25%, rgba(176, 224, 230, 0.3) 50%, rgba(135, 206, 250, 0.2) 75%, rgba(173, 216, 230, 0.2) 100%),
        linear-gradient(45deg, #E0F7FF 0%, #B3E5FC 100%)
      `;
    }
    if (isVendorPage && userRole === 'vendor') {
      return `
        linear-gradient(135deg, rgba(22, 101, 52, 0.05) 0%, rgba(34, 197, 94, 0.05) 25%, rgba(74, 222, 128, 0.05) 50%, rgba(134, 239, 172, 0.05) 75%, rgba(187, 247, 208, 0.03) 100%),
        linear-gradient(45deg, #F0FDF4 0%, #DCFCE7 100%)
      `;
    }
    return `
      linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(59, 130, 246, 0.05) 25%, rgba(16, 185, 129, 0.05) 50%, rgba(245, 158, 11, 0.05) 75%, rgba(236, 72, 153, 0.05) 100%),
      linear-gradient(45deg, #f8fafc 0%, #f1f5f9 100%)
    `;
  };

  const getRadialGradients = () => {
    if (isAdminPage && userRole === 'admin') {
      return `
        radial-gradient(circle at 20% 80%, rgba(30, 144, 255, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(65, 105, 225, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(135, 206, 250, 0.12) 0%, transparent 50%)
      `;
    }
    if (isVendorPage && userRole === 'vendor') {
      return `
        radial-gradient(circle at 20% 80%, rgba(34, 197, 94, 0.12) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(74, 222, 128, 0.12) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(134, 239, 172, 0.08) 0%, transparent 50%)
      `;
    }
    return `
      radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.06) 0%, transparent 50%)
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