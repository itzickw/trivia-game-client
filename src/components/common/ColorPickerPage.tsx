import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Chip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import { cssColors } from '../../utils/colors'; // ייבוא רשימת הצבעים

interface ColorPickerPageProps {
  open: boolean;
  onClose: () => void;
  onSelectColors: (selectedColors: string[]) => void;
  initialColors?: string[]; // צבעים שנבחרו בעבר
}

const ColorPickerPage: React.FC<ColorPickerPageProps> = ({
  open,
  onClose,
  onSelectColors,
  initialColors = [],
}) => {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  // עדכן את הצבעים הנבחרים כשהדיאלוג נפתח או כש-initialColors משתנים
  useEffect(() => {
    setSelectedColors(initialColors);
  }, [initialColors, open]); // הוספתי open כתלות כדי לאפס כשנפתח מחדש

  const handleColorClick = (color: string) => {
    setSelectedColors((prevColors) => {
      if (prevColors.includes(color)) {
        // אם הצבע כבר נבחר, הסר אותו
        return prevColors.filter((c) => c !== color);
      } else {
        // אחרת, הוסף אותו
        return [...prevColors, color];
      }
    });
  };

  const handleSave = () => {
    onSelectColors(selectedColors);
    onClose();
  };

  const getGradientStyle = (colors: string[]) => {
    if (colors.length === 0) return {};
    if (colors.length === 1) return { backgroundColor: colors[0] };
    return {
      background: `linear-gradient(to right, ${colors.join(', ')})`,
    };
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>בחר צבעים לרמה</DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle1" gutterBottom>
          צבעים נבחרים:
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            mb: 2,
            p: 1,
            border: '1px solid #ccc',
            borderRadius: 1,
            minHeight: '50px',
            alignItems: 'center',
            ...getGradientStyle(selectedColors), // תצוגת הגרדיאנט
          }}
        >
          {selectedColors.length > 0 ? (
            selectedColors.map((color, index) => (
              <Chip
                key={index}
                label={color}
                sx={{ backgroundColor: color, color: 'white', fontWeight: 'bold' }}
                onDelete={() => handleColorClick(color)}
              />
            ))
          ) : (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              לא נבחרו צבעים.
            </Typography>
          )}
        </Box>

        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
          בחר מתוך הצבעים הזמינים:
        </Typography>
        <Grid container spacing={1}>
          {cssColors.map((color) => (
            <Grid size={{xs:2, sm:1.5, md:1}} key={color}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%', // עיגולים במקום ריבועים
                  backgroundColor: color,
                  border: selectedColors.includes(color) ? '3px solid #1976d2' : '1px solid #ccc',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  '&:hover': {
                    opacity: 0.8,
                  },
                }}
                onClick={() => handleColorClick(color)}
              >
                {selectedColors.includes(color) && (
                  <CheckCircleIcon
                    sx={{
                      color: 'white',
                      fontSize: 24,
                      position: 'absolute',
                      pointerEvents: 'none', // למנוע לחיצה על האייקון עצמו
                      filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.7))', // צל כדי לראות טוב יותר על רקעים בהירים
                    }}
                  />
                )}
              </Box>
              <Typography variant="caption" sx={{ fontSize: '0.6rem', textAlign: 'center', mt: 0.5, display: 'block' }}>
                {color}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>ביטול</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          שמור
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ColorPickerPage;