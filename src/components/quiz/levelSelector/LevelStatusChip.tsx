import React from 'react';
import { Chip } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';

const LevelStatusChip: React.FC<{ isUnlocked: boolean }> = ({ isUnlocked }) => (
  <Chip
    label={isUnlocked ? 'פתוחה' : 'נעולה'}
    color={isUnlocked ? 'success' : 'error'}
    size="small"
    icon={isUnlocked ? <LockOpenIcon /> : <LockIcon />}
    sx={{
      position: 'absolute',
      top: 5,
      right: 5,
      fontSize: '0.6rem',
    }}
  />
);

export default LevelStatusChip;
