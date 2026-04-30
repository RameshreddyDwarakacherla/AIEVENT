import { useState } from 'react';
import { Box, Container, Paper, Typography, Button, Alert } from '@mui/material';
import { useGoogleLogin } from '@react-oauth/google';

const TestGoogleAuth = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const testGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log('✅ Success! Token Response:', tokenResponse);
      setResult(tokenResponse);
      setError(null);

      // Test the token with Google API
      try {
        const response = await fetch(
          `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenResponse.access_token}`
        );
        const userInfo = await response.json();
        console.log('✅ User Info:', userInfo);
        setResult({ ...tokenResponse, userInfo });
      } catch (err) {
        console.error('❌ Error fetching user info:', err);
      }
    },
    onError: (error) => {
      console.error('❌ Error:', error);
      setError(error);
      setResult(null);
    },
  });

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Google OAuth Test Page
        </Typography>
        
        <Typography variant="body1" paragraph>
          This page tests the Google OAuth configuration.
        </Typography>

        <Box sx={{ my: 3 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => testGoogleLogin()}
            sx={{ mr: 2 }}
          >
            Test Google Login
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            onClick={() => {
              setResult(null);
              setError(null);
            }}
          >
            Clear Results
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ my: 2 }}>
            <Typography variant="h6">Error:</Typography>
            <pre>{JSON.stringify(error, null, 2)}</pre>
          </Alert>
        )}

        {result && (
          <Alert severity="success" sx={{ my: 2 }}>
            <Typography variant="h6">Success!</Typography>
            <pre style={{ overflow: 'auto', maxHeight: '400px' }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </Alert>
        )}

        <Box sx={{ mt: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            Configuration:
          </Typography>
          <Typography variant="body2" component="pre">
            Client ID: {import.meta.env.VITE_GOOGLE_CLIENT_ID}
            {'\n'}
            Current Origin: {window.location.origin}
            {'\n'}
            Current URL: {window.location.href}
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Instructions:
          </Typography>
          <Typography variant="body2" component="div">
            <ol>
              <li>Click "Test Google Login"</li>
              <li>Select your Google account</li>
              <li>If successful, you'll see the token and user info above</li>
              <li>If you get an error, check the console (F12)</li>
            </ol>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default TestGoogleAuth;
