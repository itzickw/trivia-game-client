import React from 'react';
import { Button, Tooltip, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import type { LevelWithQuestions } from '../../../api/quiz';
import LevelStatusChip from './LevelStatusChip';

interface LevelButtonProps {
  level: LevelWithQuestions;
  isUnlocked: boolean;
  isActive: boolean;
  onClick: () => void;
  justUnlocked?: boolean; // חדש
}

const LevelButton: React.FC<LevelButtonProps> = ({
  level,
  isUnlocked,
  isActive,
  onClick,
  justUnlocked = false,
}) => {
  const [color1, color2] = level.color ? level.color.split(',') : ['#1976d2', '#42a5f5'];
  const levelStyle = isUnlocked
    ? {
        background: `linear-gradient(45deg, ${color1}, ${color2})`,
        color: 'white',
      }
    : {};

  const tooltip = isUnlocked
    ? `רמה ${level.level_number}: ${level.name}`
    : `רמה זו נעולה. השלם את רמה ${level.level_number - 1} כדי לפתוח אותה.`;

  return (
    <Tooltip title={tooltip}>
      <motion.div
        animate={
          justUnlocked
            ? { scale: [1, 1.1, 0.95, 1] } // bounce effect
            : { scale: 1 }
        }
        transition={{
          duration: justUnlocked ? 0.8 : 0,
          ease: 'easeInOut',
        }}
      >
        <Button
          variant="contained"
          onClick={isUnlocked ? onClick : undefined}
          disabled={!isUnlocked}
          sx={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            boxShadow: isActive ? '0 0 10px 5px rgba(0, 255, 255, 0.5)' : 'none',
            cursor: isUnlocked ? 'pointer' : 'not-allowed',
            opacity: isUnlocked ? 1 : 0.5,
            '&:hover': {
              boxShadow: isUnlocked ? '0 0 15px 7px rgba(0, 255, 255, 0.7)' : 'none',
            },
            ...levelStyle,
          }}
        >
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            {level.name}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {level.level_number}
          </Typography>
          <LevelStatusChip isUnlocked={isUnlocked} />
        </Button>
      </motion.div>
    </Tooltip>
  );
};

export default LevelButton;
