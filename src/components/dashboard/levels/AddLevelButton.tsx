import React, { useState, useCallback } from 'react';
import { Button } from '@mui/material';
import { createLevel, type CreateLevelDto, type Level } from '../../../api/levels';
import AddLevelDialog from './AddLevelDialog';

interface AddLevelButtonProps {
  onLevelAdded?: (newLevel: Level) => void;
}

const AddLevelButton: React.FC<AddLevelButtonProps> = ({ onLevelAdded }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddLevel = useCallback(async (levelData: CreateLevelDto) => {
    setLoading(true);
    setError(null);

    try {
      const newLevel = await createLevel(levelData);
      if (onLevelAdded) onLevelAdded(newLevel);
      setOpen(false);
    } catch (err: any) {
      console.error('Error adding level:', err);
      setError(err.message || 'שגיאה בהוספת רמה. אנא נסה שוב.');
    } finally {
      setLoading(false);
    }
  }, [onLevelAdded]);

  return (
    <>
        <Button variant="text" onClick={() => setOpen(true)}>
          הוסף רמה
        </Button>
      <AddLevelDialog
        open={open}
        onClose={() => setOpen(false)}
        onAddLevel={handleAddLevel}
        loading={loading}
        error={error}
      />
    </>
  );
};

export default AddLevelButton;
