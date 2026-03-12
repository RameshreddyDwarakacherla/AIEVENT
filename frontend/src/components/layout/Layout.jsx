import { useState, useEffect, createContext, useContext } from 'react';
import { Box } from '@mui/material';
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
        background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
        position: 'relative',
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
            zIndex: 1,
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