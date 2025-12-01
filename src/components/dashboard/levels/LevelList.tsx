// src/components/dashboard/LevelList.tsx
import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
  Alert,
  // For displaying the color chips
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { type Level } from '../../../api/levels';

interface LevelListProps {
  levels: Level[];
  loading: boolean;
  error: string | null;
  onEditLevel: (level: Level) => void;
  onDeleteLevel: (level: Level) => void;
  deletingLevel?: boolean;
}

const LevelList: React.FC<LevelListProps> = ({
  levels,
  loading,
  error,
  onEditLevel,
}) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;
  }

  if (levels.length === 0) {
    return <Alert severity="info" sx={{ mt: 4 }}>אין רמות זמינות כרגע.</Alert>;
  }

  // פונקציית עזר ליצירת סגנון גרדיאנט
  const getGradientStyle = (colorsString?: string) => {
    if (!colorsString) return {};
    const colors = colorsString.split(',');
    if (colors.length === 0) return {};
    if (colors.length === 1) return { backgroundColor: colors[0] };
    return {
      background: `linear-gradient(to right, ${colors.join(', ')})`,
    };
  };

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {levels.map((level) => (
        <ListItem
          key={level.id}
          secondaryAction={
            <Box>
              <IconButton edge="end" aria-label="edit" sx={{ mr: 1 }} onClick={() => onEditLevel(level)}>
                <EditIcon />
              </IconButton>
            </Box>
          }
        >
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography component="span" variant="body1" sx={{ fontWeight: 'bold', mr: 1 }}>
                  רמה {level.level_number}:
                </Typography>
                {/* <Typography component="span" variant="body1">
                  {level.name}
                </Typography> */}
                {level.color && level.color.split(',').length > 0 && (
                  <Box
                    sx={{
                      ml: 2,
                      height: 24, // גובה הצ'יפ
                      borderRadius: '12px', // פינות מעוגלות של צ'יפ
                      minWidth: 50,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 8px',
                      border: '1px solid #ccc',
                      ...getGradientStyle(level.color), // הרקע יהיה גרדיאנט
                      color: 'white', // צבע טקסט לבן לניגודיות
                      fontWeight: 'bold',
                      fontSize: '0.75rem',
                    }}
                  >
                    {/* ניתן להציג כאן את הצבעים או פשוט להשאיר את זה כתיבת גרדיאנט ריקה */}
                    <Typography component="span" variant="subtitle1" sx={{fontWeight: 'bold', color: 'text.dark' }}>
                      {level.name}
                    </Typography>
                    {/* {level.color.split(',').length > 1 ? 'Gradient' : level.color.split(',')[0]} */}
                  </Box>
                )}
              </Box>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default LevelList;