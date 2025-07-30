// src/components/dashboard/EditLevelDialog.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Box,
  Chip,
  Typography, // חדש: לייבוא Chip
} from '@mui/material';
import PaletteIcon from '@mui/icons-material/Palette'; // חדש: אייקון לבחירת צבע

import { type Level, type UpdateLevelDto } from '../../api/levels';
import ColorPickerPage from '../common/ColorPickerPage'; // חדש: ייבוא בורר הצבעים

interface EditLevelDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (levelId: string, updatedData: UpdateLevelDto) => Promise<void>;
  loading: boolean;
  error: string | null;
  levelToEdit: Level | null; // The level object currently being edited
}

const EditLevelDialog: React.FC<EditLevelDialogProps> = ({
  open,
  onClose,
  onSave,
  loading,
  error,
  levelToEdit,
}) => {
  const [levelNumber, setLevelNumber] = useState<number | ''>('');
  const [levelName, setLevelName] = useState('');
  const [selectedColors, setSelectedColors] = useState<string[]>([]); // *** שינוי: מערך של צבעים ***
  const [localError, setLocalError] = useState<string | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false); // חדש: סטייט לפתיחת בורר הצבעים

  // Populate form fields when levelToEdit changes
  useEffect(() => {
    if (levelToEdit) {
      setLevelNumber(levelToEdit.level_number);
      setLevelName(levelToEdit.name);
      setSelectedColors(levelToEdit.color ? levelToEdit.color.split(',') : []);
    } else {
      // Reset fields if no level is being edited (e.g., dialog is closed)
      setLevelNumber('');
      setLevelName('');
      setSelectedColors([]);
    }
  }, [levelToEdit]);

  const handleSaveClick = async () => {
    setLocalError(null);

    // Basic validation
    if (!levelToEdit) {
      setLocalError('No level selected for editing.');
      return;
    }
    if (levelName.trim() === '') {
      setLocalError('שם הרמה לא יכול להיות ריק.');
      return;
    }
    if (levelNumber === '' || isNaN(Number(levelNumber)) || Number(levelNumber) <= 0) {
      setLocalError('מספר הרמה חייב להיות מספר חיובי.');
      return;
    }

    // *** שינוי: איחוד מערך הצבעים לסטרינג מופרד בפסיקים ***
    const updatedData: UpdateLevelDto = {
      name: levelName.trim(),
      level_number: Number(levelNumber),
      color: selectedColors.length > 0 ? selectedColors.join(',') : undefined, // שלח undefined אם אין צבעים
    };

    await onSave(levelToEdit.id, updatedData); // onClose will be called by parent if save is successful
  };

  const handleClose = () => {
    setLocalError(null); // Clear local errors on close
    onClose();
  };

  const handleColorsSelected = (colors: string[]) => {
    setSelectedColors(colors);
    setShowColorPicker(false); // סגור את בורר הצבעים לאחר הבחירה
  };

  const getGradientStyle = (colors: string[]) => {
    if (colors.length === 0) return {};
    if (colors.length === 1) return { backgroundColor: colors[0] };
    return {
      background: `linear-gradient(to right, ${colors.join(', ')})`,
    };
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>ערוך רמה: {levelToEdit?.name}</DialogTitle>
        <DialogContent>
          {(error || localError) && <Alert severity="error" sx={{ mb: 2 }}>{error || localError}</Alert>}
          <TextField
            margin="dense"
            id="levelName"
            label="שם הרמה"
            type="text"
            fullWidth
            variant="outlined"
            value={levelName}
            onChange={(e) => setLevelName(e.target.value)}
            disabled={loading}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            id="levelNumber"
            label="מספר הרמה"
            type="number"
            fullWidth
            variant="outlined"
            value={levelNumber}
            onChange={(e) => setLevelNumber(Number(e.target.value))}
            disabled={loading}
            sx={{ mb: 2 }}
          />
          <Box sx={{ mb: 2 }}>
            <Button
              variant="outlined"
              startIcon={<PaletteIcon />}
              onClick={() => setShowColorPicker(true)}
              disabled={loading}
              fullWidth
            >
              בחר צבעים
            </Button>
            {selectedColors.length > 0 && (
              <Box
                sx={{
                  mt: 1,
                  p: 1,
                  border: '1px solid #ccc',
                  borderRadius: 1,
                  minHeight: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 1,
                  ...getGradientStyle(selectedColors), // תצוגת הגרדיאנט
                }}
              >
                {selectedColors.map((color, index) => (
                  <Chip
                    key={index}
                    label={color}
                    sx={{ backgroundColor: color, color: 'white', fontWeight: 'bold' }}
                    // ניתן להוסיף onDelete כדי להסיר צבע מכאן אם תרצה
                  />
                ))}
              </Box>
            )}
            {selectedColors.length === 0 && (
              <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                לא נבחרו צבעים.
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>ביטול</Button>
          <Button onClick={handleSaveClick} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'שמור שינויים'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Color Picker Dialog */}
      <ColorPickerPage
        open={showColorPicker}
        onClose={() => setShowColorPicker(false)}
        onSelectColors={handleColorsSelected}
        initialColors={selectedColors}
      />
    </>
  );
};

export default EditLevelDialog;