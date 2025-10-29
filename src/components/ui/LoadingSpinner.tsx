// src/components/ui/LoadingSpinner.tsx
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
      }}
    >
      <CircularProgress />
      <Typography variant="h6" sx={{ mt: 2 }}>
        טוען נתונים...
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;