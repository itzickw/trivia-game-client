import React, { useState, useCallback } from 'react';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { createTopic, type Topic } from '../../api/topics';
import AddTopicDialog from './AddTopicDialog';

interface AddTopicButtonProps {
  userId: string | null;
  onTopicAdded?: (newTopic: Topic) => void;
}

const AddTopicButton: React.FC<AddTopicButtonProps> = ({ userId, onTopicAdded }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddTopic = useCallback(async (topicName: string) => {
    if (!userId) {
      setError('שגיאה: ID משתמש לא זמין. אנא התחבר מחדש.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const newTopic = await createTopic({ name: topicName, owner_id: userId });
      if (onTopicAdded) onTopicAdded(newTopic);
      setOpen(false);
    } catch (err: any) {
      console.error('Error adding topic:', err);
      setError(err.message || 'שגיאה בהוספת נושא. אנא נסה שוב.');
    } finally {
      setLoading(false);
    }
  }, [userId, onTopicAdded]);

  return (
    <>
      <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
        הוסף נושא
      </Button>

      <AddTopicDialog
        open={open}
        onClose={() => setOpen(false)}
        onAddTopic={handleAddTopic}
        loading={loading}
        error={error}
      />
    </>
  );
};

export default AddTopicButton;
