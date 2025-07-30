// src/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Container,
  Grid,
  Paper,
  useMediaQuery,
  useTheme,
  Alert,
  Divider,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { supabase } from '../../supabaseClient';
import logo from '../../assets/share-trivia-logo.png';

interface LoginPageProps {
  // onRegisterClick: () => void;
}

const LoginPage: React.FC<LoginPageProps> = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (signInError) {
        throw signInError;
      }
      alert('התחברת בהצלחה!');
    } catch (err: any) {
      setError(err.message || 'שגיאה בהתחברות. אנא וודא/י אימייל וסיסמה.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const { data, error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (authError) {
        throw authError;
      }
    } catch (err: any) {
      setError(err.message || 'שגיאה בכניסה עם גוגל. אנא נסה/י שוב.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <Container component="main" maxWidth="lg" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Grid container component={Paper} elevation={6} sx={{
        height: isSmallScreen ? 'auto' : '80vh',
        borderRadius: 2,
        overflow: 'hidden',
      }}>
        {/* צד שמאל: טופס הכניסה */}
        <Grid size={{ xs: 12, sm: 8, md: 6 }}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: isSmallScreen ? 2 : 8,
            bgcolor: 'background.paper',
            height: '100%',
            maxHeight: '100%',
            overflowY: 'auto',
          }}>
            <Typography component="h1" variant="h4" sx={{ mb: 3, color: 'primary.main' }}>
              Share Trivia - התחבר/י ל
            </Typography>

            {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="אימייל"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="small" // *** שינוי כאן ***
              sx={{ mb: 1 }} // *** שינוי: הפחתת מרווח תחתון ***
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="סיסמה"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              size="small" // *** שינוי כאן ***
              sx={{ mb: 2 }} // *** שינוי: הפחתת מרווח תחתון ***
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 1, mb: 1 }} // *** שינוי: הפחתת מרווחים ***
              onClick={handleLogin}
              disabled={loading}
              size="small" // *** שינוי כאן ***
            >
              {loading ? 'מתחבר...' : 'התחבר'}
            </Button>

            <Divider sx={{ my: 1, width: '100%' }}>או</Divider> {/* *** שינוי: הפחתת מרווחים *** */}

            <Button
              fullWidth
              variant="outlined"
              sx={{ mt: 1, mb: 1, borderColor: 'text.primary', color: 'text.primary' }} // *** שינוי: הפחתת מרווחים ***
              onClick={handleGoogleSignIn}
              disabled={loading}
              startIcon={<GoogleIcon />}
              size="small" // *** שינוי כאן ***
            >
              התחבר עם גוגל
            </Button>

            <Link component="button" // Treat as a button for accessibility
              variant="body2"
              onClick={() => navigate('/register')} // NEW: Use navigate to go to /register
              disabled={loading}> {/* *** שינוי: הפחתת מרווח עליון *** */}
              {"אין לך חשבון? הירשם עכשיו!"}
            </Link>
          </Box>
        </Grid>

        {/* צד ימין: לוגו וסלוגן */}
        <Grid
          size={{ xs: false, sm: 4, md: 6 }} // *** שינוי: שימוש ב-size במקום xs, sm, md ***
          sx={{
            backgroundImage: 'linear-gradient(to bottom right, #303030, #000000)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
            minHeight: isSmallScreen ? '200px' : 'auto',
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="Share Trivia Logo"
            sx={{
              maxWidth: '80%',
              maxHeight: '80%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 10px rgba(255, 193, 7, 0.5))',
            }}
          />
          <Typography variant="h6" sx={{ mt: 2, color: 'primary.main' }}>
            Share your knowledge, win, and have fun!
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LoginPage;