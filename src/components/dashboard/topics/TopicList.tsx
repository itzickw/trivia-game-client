// src/components/dashboard/TopicList.tsx
import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'; // ייבוא של אייקון חדש

import { type Topic } from '../../../api/topics';

interface TopicListProps {
  topics: Topic[];
  userId: string | null; // הוספה של מזהה המשתמש כדי לדעת אם הוא הבעלים
  loading: boolean;
  error: string | null;
  onDeleteTopic: (topic: Topic) => void;
  onEditTopic: (topic: Topic) => void;
  onStartQuiz: (topic: Topic) => void; // קולבק חדש להתחלת החידון
  deletingTopic: boolean;
}

const TopicList: React.FC<TopicListProps> = ({
  topics,
  userId,
  loading,
  error,
  onDeleteTopic,
  onEditTopic,
  onStartQuiz,
  deletingTopic,
}) => {
  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (topics.length === 0) {
    return <Alert severity="info">אין נושאי טריוויה זמינים.</Alert>;
  }

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {topics.map((topic) => (
        <ListItem key={topic.id} divider>
          <ListItemText primary={topic.name} />
          <ListItemSecondaryAction>
            {/* בדיקה האם המשתמש הוא הבעלים של הנושא */}
            {topic.owner_id === userId ? (
              <>
                {/* כפתור עריכה לבעלים */}
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => onEditTopic(topic)}
                  sx={{ mr: 1 }}
                >
                  <EditIcon />
                </IconButton>
                {/* כפתור מחיקה לבעלים */}
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => onDeleteTopic(topic)}
                  disabled={deletingTopic}
                >
                  <DeleteIcon />
                </IconButton>
              </>
            ) : (
              // כפתור התחלת חידון למי שאינו הבעלים
              <IconButton
                edge="end"
                aria-label="start quiz"
                onClick={() => onStartQuiz(topic)}
                sx={{ color: 'primary.main' }}
              >
                <PlayCircleOutlineIcon />
              </IconButton>
            )}
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

export default TopicList;