// src/components/dashboard/DashboardPage.tsx
import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  CircularProgress,
  Alert,
} from '@mui/material';

import MenuBar from '../components/common/menuBar/MenuBar'; 
import LevelSection from '../components/dashboard/levels/LevelSection';
import TopicSection from '../components/dashboard/topics/TopicSection';
import useAuth from '../hooks/useAuth';


interface DashboardPageProps {
  onLogout: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onLogout }) => {
  const { user, loading } = useAuth();
  const userName = user?.user_metadata?.full_name || user?.email || '';
  const userId = user ? user.id : null;

  if (loading) {
    return (
      <Container component="main" maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>טוען נתונים...</Typography>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container component="main" maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <Alert severity="error">לא נמצאו פרטי משתמש.</Alert>
        <Button variant="contained" sx={{ mt: 2 }} onClick={onLogout}>חזור לדף התחברות</Button>
      </Container>
    );
  }

  return (
    <Container
      component="main"
      maxWidth="lg"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        height: '100vh',
        gap: 2,
      }}>
      <MenuBar userName={userName} />
      <Box sx={{
        display: 'flex',
        flexDirection: 'row-reverse', // 👈 flips order to match Hebrew layout if needed
        justifyContent: 'space-between',
        gap: 5,
        flexGrow: 1,
        width: '100%',
        marginBottom: 4,              
      }}>

        <Box  sx={{
            flex: '1 1 50%',
            backgroundColor: 'background.surface',
            borderRadius: 2,
            p: 2,
            boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
          }}>
          <TopicSection userId={userId} />
        </Box>
        <Box sx={{
            flex: '1 1 50%',
            backgroundColor: 'background.surface',
            borderRadius: 2,
            p: 2,
            boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
          }}>
          <LevelSection />
        </Box>
      </Box>
    </Container>
  );
};

export default DashboardPage;