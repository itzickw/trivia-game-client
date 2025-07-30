import React from 'react';
import {
  Box,
//   Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { type Topic } from '../../api/topics'; // ייבוא טיפוס בלבד

interface TopicListProps {
  topics: Topic[];
  userId: string | null; // ID של המשתמש המחובר לבדיקת בעלות
  loading: boolean;
  error: string | null;
  onDeleteTopic: (topic: Topic) => void; // פונקציה לקריאה כשלוחצים על מחיקה
  onEditTopic: (topic: Topic) => void; // פונקציה לקריאה כשלוחצים על עריכה (נממש בהמשך)
  deletingTopic?: boolean; // חדש: להשבית את כפתור המחיקה בזמן שפעולה מתבצעת
}

const TopicList: React.FC<TopicListProps> = ({
  topics,
  userId,
  loading,
  error,
  onDeleteTopic,
  onEditTopic,
  deletingTopic = false, // ברירת מחדל false
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

  if (topics.length === 0) {
    return <Alert severity="info" sx={{ mt: 4 }}>אין נושאים זמינים כרגע. התחל/י בהוספת אחד!</Alert>;
  }

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {topics.map((topic) => (
        <ListItem
          key={topic.id}
          secondaryAction={
            topic.owner_id === userId && (
              <Box>
                <IconButton edge="end" aria-label="edit" sx={{ mr: 1 }} onClick={() => onEditTopic(topic)}>
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => onDeleteTopic(topic)}
                  disabled={deletingTopic} // השבתה בזמן מחיקה
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            )
          }
        >
          <ListItemText primary={topic.name} />
        </ListItem>
      ))}
    </List>
  );
};

export default TopicList;