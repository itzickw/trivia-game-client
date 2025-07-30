// src/components/dashboard/AddLevelDialog.tsx
import React, { useState } from 'react';
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
  Typography
} from '@mui/material';
import PaletteIcon from '@mui/icons-material/Palette';

import { type CreateLevelDto } from '../../api/levels';
import ColorPickerPage from '../common/ColorPickerPage';

interface AddLevelDialogProps {
  open: boolean;
  onClose: () => void;
  onAddLevel: (levelData: CreateLevelDto) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AddLevelDialog: React.FC<AddLevelDialogProps> = ({
  open,
  onClose,
  onAddLevel,
  loading,
  error,
}) => {
  const [levelNumber, setLevelNumber] = useState<number | ''>('');
  const [levelName, setLevelName] = useState('');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Reset form fields on dialog open/close
  React.useEffect(() => {
    if (!open) {
      setLevelNumber('');
      setLevelName('');
      setSelectedColors([]);
      setLocalError(null);
    }
  }, [open]);

  const handleAddClick = async () => {
    setLocalError(null);

    // Validation
    if (levelName.trim() === '') {
      setLocalError('שם הרמה לא יכול להיות ריק.');
      return;
    }
    if (levelNumber === '' || isNaN(Number(levelNumber)) || Number(levelNumber) <= 0) {
      setLocalError('מספר הרמה חייב להיות מספר חיובי.');
      return;
    }

    // Join colors into a comma-separated string
    const levelData: CreateLevelDto = {
      name: levelName.trim(),
      level_number: Number(levelNumber),
      color: selectedColors.length > 0 ? selectedColors.join(',') : undefined,
    };

    await onAddLevel(levelData);
    // Parent will close dialog on success
  };

  const handleColorsSelected = (colors: string[]) => {
    setSelectedColors(colors);
    setShowColorPicker(false);
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
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>הוסף רמה חדשה</DialogTitle>
        <DialogContent>
          {(error || localError) && <Alert severity="error" sx={{ mb: 2 }}>{error || localError}</Alert>}
          <TextField
            autoFocus
            margin="dense"
            id="newLevelName"
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
            id="newLevelNumber"
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
                  ...getGradientStyle(selectedColors),
                }}
              >
                {selectedColors.map((color, index) => (
                  <Chip
                    key={index}
                    label={color}
                    sx={{ backgroundColor: color, color: 'white', fontWeight: 'bold' }}
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
          <Button onClick={onClose} disabled={loading}>ביטול</Button>
          <Button onClick={handleAddClick} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'הוסף'}
          </Button>
        </DialogActions>
      </Dialog>

      <ColorPickerPage
        open={showColorPicker}
        onClose={() => setShowColorPicker(false)}
        onSelectColors={handleColorsSelected}
        initialColors={selectedColors}
      />
    </>
  );
};

export default AddLevelDialog;