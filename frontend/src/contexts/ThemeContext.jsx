import { createContext, useContext, useState, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const ThemeContext = createContext();

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#1976d2', // Professional blue as primary color
            light: '#42a5f5',
            dark: '#1565c0',
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#2196f3', // Lighter blue as secondary color
            light: '#64b5f6',
            dark: '#1976d2',
            contrastText: '#ffffff',
          },
          background: {
            default: mode === 'light'
              ? 'linear-gradient(135deg, #e3f2fd 0%, #f5f5f5 100%)'
              : 'linear-gradient(135deg, #0d47a1 0%, #121212 100%)',
            paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
          },
          info: {
            main: '#0288d1',
            light: '#03a9f4',
            dark: '#01579b',
          },
          success: {
            main: '#2e7d32',
            light: '#4caf50',
            dark: '#1b5e20',
          },
          warning: {
            main: '#ed6c02',
            light: '#ff9800',
            dark: '#e65100',
          },
          error: {
            main: '#d32f2f',
            light: '#f44336',
            dark: '#c62828',
          },
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          h1: {
            fontWeight: 800,
            fontSize: '3.5rem',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            background: mode === 'light'
              ? 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)'
              : 'linear-gradient(135deg, #42a5f5 0%, #64b5f6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          },
          h2: {
            fontWeight: 700,
            fontSize: '2.75rem',
            lineHeight: 1.3,
            letterSpacing: '-0.01em',
          },
          h3: {
            fontWeight: 600,
            fontSize: '2.25rem',
            lineHeight: 1.4,
          },
          h4: {
            fontWeight: 600,
            fontSize: '1.75rem',
            lineHeight: 1.4,
          },
          h5: {
            fontWeight: 500,
            fontSize: '1.5rem',
            lineHeight: 1.5,
          },
          h6: {
            fontWeight: 500,
            fontSize: '1.25rem',
            lineHeight: 1.5,
          },
          body1: {
            fontSize: '1rem',
            lineHeight: 1.6,
          },
          body2: {
            fontSize: '0.875rem',
            lineHeight: 1.6,
          },
          button: {
            fontWeight: 600,
            textTransform: 'none',
            letterSpacing: '0.02em',
          },
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                background: mode === 'light'
                  ? 'linear-gradient(135deg, #e3f2fd 0%, #f5f5f5 100%)'
                  : 'linear-gradient(135deg, #0d47a1 0%, #121212 100%)',
                minHeight: '100vh',
                backgroundAttachment: 'fixed',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                textTransform: 'none',
                fontWeight: 600,
                padding: '12px 24px',
                fontSize: '1rem',
                boxShadow: 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(25, 118, 210, 0.3)',
                },
              },
              containedPrimary: {
                background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                },
              },
              containedSecondary: {
                background: 'linear-gradient(135deg, #2196f3 0%, #42a5f5 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
                },
              },
              outlined: {
                borderWidth: 2,
                borderColor: '#1976d2',
                color: '#1976d2',
                '&:hover': {
                  borderWidth: 2,
                  backgroundColor: 'rgba(25, 118, 210, 0.04)',
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 16,
                boxShadow: mode === 'light'
                  ? '0 8px 32px rgba(25, 118, 210, 0.08)'
                  : '0 8px 32px rgba(0, 0, 0, 0.3)',
                border: mode === 'light' ? '1px solid rgba(25, 118, 210, 0.08)' : 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: mode === 'light'
                    ? '0 16px 48px rgba(25, 118, 210, 0.12)'
                    : '0 16px 48px rgba(0, 0, 0, 0.4)',
                },
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: 16,
                boxShadow: mode === 'light'
                  ? '0 4px 20px rgba(25, 118, 210, 0.06)'
                  : '0 4px 20px rgba(0, 0, 0, 0.25)',
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                background: mode === 'light'
                  ? 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)'
                  : 'linear-gradient(135deg, #0d47a1 0%, #1976d2 100%)',
                boxShadow: '0 4px 20px rgba(25, 118, 210, 0.15)',
                backdropFilter: 'blur(10px)',
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                fontWeight: 500,
              },
              colorPrimary: {
                background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
                color: '#ffffff',
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: 12,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1976d2',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1976d2',
                    borderWidth: 2,
                  },
                },
              },
            },
          },
        },
      }),
    [mode]
  );

  const value = {
    mode,
    toggleColorMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};