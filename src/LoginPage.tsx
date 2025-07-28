import React from 'react';
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
} from '@mui/material';

import logo from './assets/share-trivia-logo.png'; // וודא שהנתיב נכון!

const LoginPage: React.FC = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleLogin = () => {
    alert('כפתור התחברות נלחץ!');
  };

  const handleRegister = () => {
    alert('כפתור הרשמה נלחץ!');
  };

  return (
    <Container component="main" maxWidth="lg" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Grid container component={Paper} elevation={6} sx={{ // ה-Grid container הוא Paper
        height: isSmallScreen ? 'auto' : '80vh',
        borderRadius: 2,
        overflow: 'hidden',
      }}>
        {/* צד שמאל: טופס הכניסה */}
        <Grid size={{ xs: 12, sm: 8, md: 6 }}>
          <Box sx={{ // Box לרכיבים הפנימיים ולסטיילינג
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: isSmallScreen ? 2 : 8,
            bgcolor: 'background.paper',
            height: '100%',
          }}>
            <Typography component="h1" variant="h4" sx={{ mb: 3 }}>
              התחבר/י ל-Share Trivia
            </Typography>

            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="שם משתמש או אימייל"
              name="username"
              autoComplete="username"
              autoFocus
              sx={{ mb: 2 }}
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
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 1, mb: 2 }}
              onClick={handleLogin}
            >
              התחבר
            </Button>

            <Link href="#" variant="body2" onClick={handleRegister}>
              {"אין לך חשבון? הירשם עכשיו!"}
            </Link>
          </Box>
        </Grid>

        {/* צד ימין: לוגו ותמונת רקע */}
        <Grid
          size={{ xs: false, sm: 4, md: 6 }}
        >
          <Box sx={{ // Box לרכיבים הפנימיים ולסטיילינג
            backgroundImage: 'linear-gradient(to bottom right, #303030, #000000)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
            minHeight: isSmallScreen ? '200px' : 'auto',
            height: '100%',
          }}>
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
            <Typography variant="h6" sx={{ mt: 2, color: 'text.primary' }}>
              Share your knowledge, win, and have fun!
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LoginPage;