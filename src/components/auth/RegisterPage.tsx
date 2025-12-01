// src/RegisterPage.tsx
import React, { useState } from 'react';
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
import { useNavigate } from 'react-router-dom';

interface RegisterPageProps {
  // onLoginClick: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleRegister = async () => {
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError('הסיסמאות אינן תואמות.');
      return;
    }
    if (password.length < 6) {
      setError('הסיסמה חייבת להיות באורך 6 תווים לפחות.');
      return;
    }

    setLoading(true);
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (authError) {
        throw authError;
      }

      if (data && data.user) {
        setSuccess('ההרשמה בוצעה בהצלחה! אנא בדוק/י את המייל שלך לאימות.');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setError('שגיאה לא צפויה: נתונים חסרים לאחר ההרשמה.');
      }

    } catch (err: any) {
      if (err.message.includes('already registered')) {
        setError('משתמש עם אימייל זה כבר רשום.');
      } else {
        setError(err.message || 'שגיאה כללית בהרשמה. אנא נסה/י שוב.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (authError) {
        throw authError;
      }
      setSuccess('מפנה לגוגל...');

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
        {/* צד שמאל: טופס ההרשמה */}
        <Grid size={{ xs: 12, sm: 8, md: 6 }}> {/* שינוי: `size` אינו מאפיין תקף ב-MUI Grid, צריך להיות `xs, sm, md` */}
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: isSmallScreen ? 2 : 3,
            bgcolor: 'background.paper',
            height: '100%',
            maxHeight: '100%',
            overflowY: 'auto',
          }}>
            <Typography component="h1" variant="h4" sx={{ mb: 3, color: 'primary.main' }}>
              Share Trivia - הירשם/י ל
            </Typography>

            {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>{success}</Alert>}

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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              size="small" // *** שינוי כאן ***
              sx={{ mb: 1 }} // *** שינוי: הפחתת מרווח תחתון ***
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="אישור סיסמה"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              size="small" // *** שינוי כאן ***
              sx={{ mb: 2 }} // *** שינוי: הפחתת מרווח תחתון ***
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 1, mb: 1 }} // *** שינוי: הפחתת מרווחים ***
              onClick={handleRegister}
              disabled={loading}
              size="small" // *** שינוי כאן ***
            >
              {loading ? 'רושם...' : 'הירשם'}
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
              הירשם/התחבר עם גוגל
            </Button>

            <Link component="button" // Treat as a button for accessibility
              variant="body2"
              onClick={() => navigate('/login')} // NEW: Use navigate to go to /login
              disabled={loading}> {/* *** שינוי: הפחתת מרווח עליון *** */}
              {"כבר יש לך חשבון? התחבר/י כאן!"}
            </Link>
          </Box>
        </Grid>

        {/* צד ימין: לוגו וסלוגן */}
        <Grid size={{ xs: false, sm: 4, md: 6 }}
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

export default RegisterPage;