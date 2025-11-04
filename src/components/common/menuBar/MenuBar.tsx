import React from 'react';
import { Box, Typography } from '@mui/material';
import LogoutButton from './LogoutButton';
import logo from '../../../assets/share-trivia-logo.png';
import DashboardButton from './DashboardButton';

interface MenuBarProps {
  userName: string | null;
}

const MenuBar: React.FC<MenuBarProps> = ({ userName }) => {
  return (
    <Box
      sx={{
        marginTop: 2,
        position: 'telative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '95%',
        height: 64,
        px: 3,
        py: 1.5,
        borderRadius: 2,
        mb: 2,
        backgroundColor: 'background.header',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        color: '#fff',
      }}
    >
      {/* Left: Logo */}
      <Box
        component="img"
        src={logo}
        alt="Share Trivia Logo"
        sx={{
          height: '55px',
          width: 'auto',
          objectFit: 'contain',
          filter: 'drop-shadow(0 0 10px rgba(255, 193, 7, 0.5))',
        }}
      />

      {/* Center: Username */}
      <Typography
        component="h1"
        variant="h5"
        sx={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'primary.main',
          fontWeight: 'bold',
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        שלום {userName}
      </Typography>

      {/* Right side: Buttons */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <DashboardButton />
        <LogoutButton />
      </Box>
    </Box>
  );
};

export default MenuBar;
