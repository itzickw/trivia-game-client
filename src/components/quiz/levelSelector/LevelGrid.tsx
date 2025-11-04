import React from 'react';
import { Grid } from '@mui/material';
import { motion } from 'framer-motion';
import type { LevelWithQuestions } from '../../../api/quiz';
import LevelButton from './LevelButton';

interface LevelGridProps {
  levels: LevelWithQuestions[];
  selectedLevel: number;
  maxUserLevel: number;
  onLevelSelect: (levelNumber: string) => void;
}

const LevelGrid: React.FC<LevelGridProps> = ({
  levels,
  selectedLevel,
  maxUserLevel,
  onLevelSelect,
}) => {
  return (
    <Grid container spacing={2} justifyContent="center">
      {levels.map((level, index) => (
        <Grid item key={level.id}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1, // stagger effect
              ease: 'easeOut',
            }}
          >
            <LevelButton
              level={level}
              isActive={level.level_number === selectedLevel}
              isUnlocked={level.level_number <= maxUserLevel + 1}
              onClick={() => onLevelSelect(level.level_number.toString())}
              justUnlocked={level.level_number === maxUserLevel + 1} // חדש
            />
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );
};

export default LevelGrid;
