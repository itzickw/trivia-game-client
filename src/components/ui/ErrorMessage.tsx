// src/components/ui/ErrorMessage.tsx
import React from 'react';
import { Box, Typography, Alert } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        textAlign: 'center',
        p: 2,
      }}
    >
      <Alert severity="error" icon={<WarningIcon fontSize="inherit" />} sx={{ maxWidth: '400px' }}>
        <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
          אירעה שגיאה!
        </Typography>
        <Typography variant="body1">
          {message}
        </Typography>
      </Alert>
    </Box>
  );
};

export default ErrorMessage;