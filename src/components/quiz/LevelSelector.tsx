// src/components/quiz/LevelSelector.tsx
import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Chip,
  Tooltip,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { type LevelWithQuestions } from '../../api/quiz'; // שינוי חשוב: שימוש בממשק המלא

interface LevelSelectorProps {
  levels: LevelWithQuestions[]; // עדכון הממשק למערך של LevelWithQuestions
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
  // נסנן רמות ללא שאלות לפני המיון
  const availableLevels = levels.filter(level => level.questions && level.questions.length > 0);
  
  // Sort available levels by level_number
  const sortedLevels = [...availableLevels].sort((a, b) => a.level_number - b.level_number);

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h5" gutterBottom align="center">
        בחר רמה
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {sortedLevels.map((level) => {
          const isUnlocked = level.level_number <= maxUserLevel + 1;
          const isActive = level.level_number === selectedLevel;

          const levelColors = level.color.split(',');
          const levelStyle = isUnlocked
            ? {
                background: `linear-gradient(45deg, ${levelColors[0]}, ${levelColors[1]})`,
                color: 'white',
              }
            : {};
          
          const tooltipTitle = isUnlocked
            ? `רמה ${level.level_number}: ${level.name}`
            : `רמה זו נעולה. השלם את רמה ${level.level_number - 1} כדי לפתוח אותה.`;

          return (
            <Grid item key={level.id}>
              <Tooltip title={tooltipTitle}>
                <Button
                  variant="contained"
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
                    ...levelStyle,
                    '&:hover': {
                      boxShadow: isUnlocked ? '0 0 15px 7px rgba(0, 255, 255, 0.7)' : 'none',
                    },
                    cursor: isUnlocked ? 'pointer' : 'not-allowed',
                    opacity: isUnlocked ? 1 : 0.5,
                  }}
                  onClick={() => isUnlocked && onLevelSelect(level.level_number.toString())}
                  disabled={!isUnlocked}
                >
                  <Typography variant="h6" sx={{ mb: 0.5 }}>
                    {level.name}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {level.level_number}
                  </Typography>
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