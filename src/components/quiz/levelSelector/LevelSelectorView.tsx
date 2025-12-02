// src/components/quiz/LevelSelector.tsx
import React from 'react';
import { Box, Typography, Button, Grid, Chip, Tooltip } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { type LevelWithQuestions } from '../../../api/quiz';

interface LevelSelectorProps {
  levels: LevelWithQuestions[];
  selectedLevel: number;
  maxUserLevel: number;
  onLevelSelect: (levelNumber: string) => void;
}

const LevelSelector: React.FC<LevelSelectorProps> = ({
  levels,
  selectedLevel,
  maxUserLevel,
  onLevelSelect,
}) => {
  const isEditorMode = maxUserLevel > 500;
  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      <Grid container spacing={2} justifyContent="center">
        {levels.map((level) => {
          const isUnlocked = isEditorMode || level.level_number <= maxUserLevel;
          const isActive = level.level_number === selectedLevel;

          // צבעי רקע מהרמה עצמה (לדוגמה "red,orange")
          const levelColors = level.color?.split(',') ?? ['#888', '#444'];
          const levelStyle = isUnlocked
            ? {
                background: `linear-gradient(45deg, ${levelColors[0]}, ${levelColors[1]})`,
                color: 'white',
              }
            : {
                background: `linear-gradient(45deg, #777, #333)`,
                color: '#ccc',
              };

          const tooltipTitle = isUnlocked
            ? `רמה ${level.level_number}: ${level.name}`
            : `רמה זו נעולה. השלם את רמה ${level.level_number - 1} כדי לפתוח אותה.`;

          return (
            <Grid container key={level.id}>
              <Tooltip title={tooltipTitle}>
                <Button
                  variant="contained"
                  sx={{
                    width: 90,
                    height: 90,
                    borderRadius: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    boxShadow: isActive
                      ? '0 0 10px 5px rgba(0, 255, 255, 0.6)'
                      : 'none',
                    ...levelStyle,
                    '&:hover': {
                      boxShadow: isUnlocked
                        ? '0 0 15px 7px rgba(0, 255, 255, 0.7)'
                        : 'none',
                    },
                    cursor: isUnlocked ? 'pointer' : 'not-allowed',
                    opacity: isUnlocked ? 1 : 0.6,
                    transition: 'all 0.2s ease',
                  }}
                  onClick={() =>
                    isUnlocked && onLevelSelect(level.level_number.toString())
                  }
                  disabled={!isUnlocked}
                >
                  <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 'bold', color: 'text.dark' }}>
                    {level.name}
                  </Typography>
                  <Chip
                    label={isUnlocked ? 'פתוחה' : 'נעולה'}
                    color={isUnlocked ? 'success' : 'error'}
                    size="small"
                    icon={isUnlocked ? <LockOpenIcon /> : <LockIcon />}
                    sx={{
                      position: 'absolute',
                      top: 75,                  
                      fontSize: '0.6rem',
                    }}
                  />
                </Button>
              </Tooltip>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default LevelSelector;
