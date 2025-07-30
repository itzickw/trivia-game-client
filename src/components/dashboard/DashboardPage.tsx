import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

import { supabase } from '../../supabaseClient';
import { fetchAllTopics, createTopic, deleteTopic, type Topic } from '../../api/topics';
import { fetchAllLevels, updateLevel, createLevel, type Level, type CreateLevelDto, type UpdateLevelDto } from '../../api/levels'; // NEW: Import createLevel and CreateLevelDto

import AddTopicDialog from './AddTopicDialog';
import TopicList from './TopicList';
import ConfirmationDialog from '../common/ConfirmationDialog';
import EditLevelDialog from './EditLevelDialog';
import LevelList from './LevelList';
import AddLevelDialog from './AddLevelDialog'; // NEW: Import AddLevelDialog

interface DashboardPageProps {
  onLogout: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onLogout }) => {
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);

  // Topics states
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [topicsError, setTopicsError] = useState<string | null>(null);
  const [showAddTopicDialog, setShowAddTopicDialog] = useState(false);
  const [addingTopic, setAddingTopic] = useState(false);
  const [addTopicError, setAddTopicError] = useState<string | null>(null);
  const [showConfirmDeleteTopicDialog, setShowConfirmDeleteTopicDialog] = useState(false);
  const [topicToDelete, setTopicToDelete] = useState<Topic | null>(null);
  const [deletingTopic, setDeletingTopic] = useState(false);
  const [deleteTopicError, setDeleteTopicError] = useState<string | null>(null);

  // Levels states
  const [levels, setLevels] = useState<Level[]>([]);
  const [loadingLevels, setLoadingLevels] = useState(false);
  const [levelsError, setLevelsError] = useState<string | null>(null);
  const [showEditLevelDialog, setShowEditLevelDialog] = useState(false);
  const [levelToEdit, setLevelToEdit] = useState<Level | null>(null);
  const [editingLevel, setEditingLevel] = useState(false);
  const [editLevelError, setEditLevelError] = useState<string | null>(null);
  // NEW: Add Level states
  const [showAddLevelDialog, setShowAddLevelDialog] = useState(false); // For add level dialog
  const [addingLevel, setAddingLevel] = useState(false);           // Loading state for adding
  const [addLevelError, setAddLevelError] = useState<string | null>(null); // Error for adding
 
  const navigate = useNavigate();
  // Load User Data
  useEffect(() => {
    const getUserData = async () => {
      try {
        setLoadingUser(true);
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
          throw error;
        }

        if (user) {
          setUserName(user.user_metadata?.full_name || user.email);
          setUserId(user.id);
        } else {
          setUserError('לא נמצאו פרטי משתמש.');
        }
      } catch (err: any) {
        setUserError('שגיאה בטעינת פרטי משתמש: ' + err.message);
        console.error('Error fetching user data:', err);
      } finally {
        setLoadingUser(false);
      }
    };
    getUserData();
  }, []);

  // Load Topics Data
  const loadTopics = useCallback(async () => {
    try {
      setLoadingTopics(true);
      setTopicsError(null);
      const fetchedTopics = await fetchAllTopics();
      setTopics(fetchedTopics);
    } catch (err: any) {
      setTopicsError('שגיאה בטעינת נושאים: ' + err.message);
      console.error('Error fetching topics:', err);
    } finally {
      setLoadingTopics(false);
    }
  }, []);

  // Load Levels Data
  const loadLevels = useCallback(async () => {
    try {
      setLoadingLevels(true);
      setLevelsError(null);
      const fetchedLevels = await fetchAllLevels();
      setLevels(fetchedLevels);
    } catch (err: any) {
      setLevelsError('שגיאה בטעינת רמות: ' + err.message);
      console.error('Error fetching levels:', err);
    } finally {
      setLoadingLevels(false);
    }
  }, []);

  // Initial data load on component mount
  useEffect(() => {
    loadTopics();
    loadLevels();
  }, [loadTopics, loadLevels]);

  // Topic Management Callbacks
  const handleAddTopic = useCallback(async (topicName: string) => {
    setAddTopicError(null);
    if (!userId) {
      setAddTopicError('שגיאה: ID משתמש לא זמין. אנא התחבר מחדש.');
      return;
    }
    setAddingTopic(true);
    try {
      const newTopic = await createTopic({
        name: topicName,
        owner_id: userId,
      });
      setTopics((prevTopics) => [...prevTopics, newTopic]);
      setShowAddTopicDialog(false);
    } catch (err: any) {
      console.error('Error adding topic:', err);
      setAddTopicError(err.message || 'שגיאה בהוספת נושא. אנא נסה שוב.');
    } finally {
      setAddingTopic(false);
    }
  }, [userId]);

  const handleDeleteTopicClick = useCallback((topic: Topic) => {
    setTopicToDelete(topic);
    setShowConfirmDeleteTopicDialog(true);
    setDeleteTopicError(null);
  }, []);

  const handleConfirmDeleteTopic = async () => {
    if (!topicToDelete) return;
    setDeletingTopic(true);
    try {
      await deleteTopic(topicToDelete.id);
      setTopics((prevTopics) => prevTopics.filter((t) => t.id !== topicToDelete.id));
      setShowConfirmDeleteTopicDialog(false);
      setTopicToDelete(null);
    } catch (err: any) {
      console.error('Error deleting topic:', err);
      setDeleteTopicError(err.message || 'שגיאה במחיקת נושא. אנא נסה שוב.');
    } finally {
      setDeletingTopic(false);
    }
  };

  const handleCancelDeleteTopic = useCallback(() => {
    setShowConfirmDeleteTopicDialog(false);
    setTopicToDelete(null);
    setDeleteTopicError(null);
  }, []);

  const handleEditTopicClick = useCallback((topic: Topic) => {
    // For future implementation: open a dialog to edit topic details
    console.log('Edit topic:', topic.name);
    alert(`עריכת נושא: ${topic.name}`);
    navigate(`/dashboard/topics/${topic.id}/questions`);
  }, []);

  // Level Management Callbacks
  const handleEditLevelClick = useCallback((level: Level) => {
    setLevelToEdit(level);
    setShowEditLevelDialog(true);
    setEditLevelError(null);
  }, []);

  const handleSaveLevel = useCallback(async (levelId: string, updatedData: UpdateLevelDto) => {
    setEditingLevel(true);
    setEditLevelError(null);
    try {
      const updatedLevel = await updateLevel(levelId, updatedData);
      setLevels((prevLevels) =>
        prevLevels.map((lvl) => (lvl.id === updatedLevel.id ? updatedLevel : lvl))
      );
      setShowEditLevelDialog(false);
      setLevelToEdit(null);
    } catch (err: any) {
      console.error('Error updating level:', err);
      setEditLevelError(err.message || 'שגיאה בעדכון רמה. אנא נסה שוב.');
    } finally {
      setEditingLevel(false);
    }
  }, []);

  const handleCloseEditLevelDialog = useCallback(() => {
    setShowEditLevelDialog(false);
    setLevelToEdit(null);
    setEditLevelError(null);
  }, []);

  // NEW: Add Level Callback
  const handleAddLevel = useCallback(async (levelData: CreateLevelDto) => {
    setAddLevelError(null);
    setAddingLevel(true);
    try {
      const newLevel = await createLevel(levelData);
      setLevels((prevLevels) => [...prevLevels, newLevel]);
      setShowAddLevelDialog(false); // Close the dialog on success
    } catch (err: any) {
      console.error('Error adding level:', err);
      setAddLevelError(err.message || 'שגיאה בהוספת רמה. אנא נסה שוב.');
    } finally {
      setAddingLevel(false);
    }
  }, []);

  if (loadingUser) {
    return (
      <Container component="main" maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>טוען נתונים...</Typography>
      </Container>
    );
  }

  if (userError) {
    return (
      <Container component="main" maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <Alert severity="error">{userError}</Alert>
        <Button variant="contained" sx={{ mt: 2 }} onClick={onLogout}>חזור לדף התחברות</Button>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, textAlign: 'center', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
        <Typography component="h1" variant="h4" sx={{ mb: 2, color: 'primary.main' }}>
          ברוך הבא לדשבורד, {userName}!
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          כאן תוכל לנהל את נושאי הטריוויה והשאלות שלך.
        </Typography>

        {/* Topics Section */}
        <Box sx={{ mt: 4, width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">נושאי טריוויה</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowAddTopicDialog(true)}
            >
              הוסף נושא
            </Button>
          </Box>
          <TopicList
            topics={topics}
            userId={userId}
            loading={loadingTopics}
            error={topicsError}
            onDeleteTopic={handleDeleteTopicClick}
            onEditTopic={handleEditTopicClick}
            deletingTopic={deletingTopic}
          />
        </Box>

        {/* Levels Section */}
        <Box sx={{ mt: 4, width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">רמות</Typography>
            {/* NEW: Add Level Button */}
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowAddLevelDialog(true)}
            >
              הוסף רמה
            </Button>
          </Box>
          <LevelList
            levels={levels}
            loading={loadingLevels}
            error={levelsError}
            onEditLevel={handleEditLevelClick}
            onDeleteLevel={() => { /* Implement if needed */ }} // Placeholder for future delete
          />
        </Box>

        <Button
          variant="contained"
          color="error"
          onClick={onLogout}
          sx={{ mt: 3 }}
        >
          התנתק
        </Button>
      </Paper>

      {/* Dialog for adding new Topic */}
      <AddTopicDialog
        open={showAddTopicDialog}
        onClose={() => setShowAddTopicDialog(false)}
        onAddTopic={handleAddTopic}
        loading={addingTopic}
        error={addTopicError}
      />

      {/* Dialog for confirming Topic deletion */}
      <ConfirmationDialog
        open={showConfirmDeleteTopicDialog}
        onClose={handleCancelDeleteTopic}
        onConfirm={handleConfirmDeleteTopic}
        title="אישור מחיקת נושא"
        message={`האם אתה בטוח שברצונך למחוק את הנושא "${topicToDelete?.name}"? פעולה זו בלתי הפיכה.`}
        confirmButtonText="מחק"
        cancelButtonText="ביטול"
        loading={deletingTopic}
        error={deleteTopicError}
      />

      {/* Dialog for editing Level */}
      <EditLevelDialog
        open={showEditLevelDialog}
        onClose={handleCloseEditLevelDialog}
        onSave={handleSaveLevel}
        loading={editingLevel}
        error={editLevelError}
        levelToEdit={levelToEdit}
      />

      {/* NEW: Dialog for adding new Level */}
      <AddLevelDialog
        open={showAddLevelDialog}
        onClose={() => setShowAddLevelDialog(false)}
        onAddLevel={handleAddLevel}
        loading={addingLevel}
        error={addLevelError}
      />
    </Container>
  );
};

export default DashboardPage;