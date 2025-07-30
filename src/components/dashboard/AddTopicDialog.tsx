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
} from '@mui/material';

interface AddTopicDialogProps {
  open: boolean;
  onClose: () => void;
  onAddTopic: (topicName: string) => Promise<void>; // פונקציה שתקבל את שם הנושא החדש
  loading: boolean;
  error: string | null;
}

const AddTopicDialog: React.FC<AddTopicDialogProps> = ({
  open,
  onClose,
  onAddTopic,
  loading,
  error,
}) => {
  const [newTopicName, setNewTopicName] = useState(''); // סטייט הקלט בתוך הקומפוננטה
  const [localError, setLocalError] = useState<string | null>(null); // שגיאות ולידציה מקומיות

  const handleAddClick = async () => {
    setLocalError(null); // נקה שגיאות קודמות
    if (!newTopicName.trim()) {
      setLocalError('שם הנושא לא יכול להיות ריק.');
      return;
    }
    await onAddTopic(newTopicName.trim());
    setNewTopicName(''); // אאפס את השדה לאחר הוספה מוצלחת
  };

  const handleClose = () => {
    setNewTopicName(''); // נקה את השדה גם בסגירה
    setLocalError(null); // נקה שגיאות
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>הוסף נושא טריוויה חדש</DialogTitle>
      <DialogContent>
        {(error || localError) && <Alert severity="error" sx={{ mb: 2 }}>{error || localError}</Alert>}
        <TextField
          autoFocus
          margin="dense"
          id="topicName"
          label="שם הנושא"
          type="text"
          fullWidth
          variant="outlined"
          value={newTopicName}
          onChange={(e) => setNewTopicName(e.target.value)}
          disabled={loading}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>ביטול</Button>
        <Button onClick={handleAddClick} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'הוסף'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTopicDialog;