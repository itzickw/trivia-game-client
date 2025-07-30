// src/components/dashboard/TopicQuestionsPage.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Paper,
  CircularProgress,
  Alert,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Grid,
  List, ListItem, ListItemText
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

import { fetchTopicById, type Topic } from '../../api/topics';
import { fetchAllLevels, type Level } from '../../api/levels';
import { fetchQuizQuestions, deleteQuestion, fetchQuestionsByTopicId, type Question, type CreateQuestionDto, type UpdateQuestionDto } from '../../api/questions';
import ConfirmationDialog from '../common/ConfirmationDialog';
import AddQuestionDialog from './AddQuestionDialog';
import EditQuestionDialog from './EditQuestionDialog';
import { supabase } from '../../supabaseClient';


interface TopicQuestionsPageProps {
  // Add any global props if needed, e.g., onLogout
}

const TopicQuestionsPage: React.FC<TopicQuestionsPageProps> = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();

  const [topic, setTopic] = useState<Topic | null>(null);
  const [loadingTopic, setLoadingTopic] = useState(true);
  const [topicError, setTopicError] = useState<string | null>(null);

  const [levels, setLevels] = useState<Level[]>([]);
  const [loadingLevels, setLoadingLevels] = useState(true);
  const [levelsError, setLevelsError] = useState<string | null>(null);
  const [selectedLevelId, setSelectedLevelId] = useState<string | 'all'>('all');

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [questionsError, setQuestionsError] = useState<string | null>(null);

  const [showConfirmDeleteQuestionDialog, setShowConfirmDeleteQuestionDialog] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null);
  const [deletingQuestion, setDeletingQuestion] = useState(false);
  const [deleteQuestionError, setDeleteQuestionError] = useState<string | null>(null);

  const [showAddQuestionDialog, setShowAddQuestionDialog] = useState(false);
  const [addingQuestion, setAddingQuestion] = useState(false);
  const [addQuestionError, setAddQuestionError] = useState<string | null>(null);

  const [showEditQuestionDialog, setShowEditQuestionDialog] = useState(false);
  const [questionToEdit, setQuestionToEdit] = useState<Question | null>(null);
  const [editingQuestion, setEditingQuestion] = useState(false);
  const [editQuestionError, setEditQuestionError] = useState<string | null>(null);

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Get current user ID
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    };
    fetchUser();
  }, []);

  // Fetch topic details
  useEffect(() => {
    const getTopicDetails = async () => {
      if (!topicId) {
        setTopicError('Topic ID is missing.');
        setLoadingTopic(false);
        return;
      }
      try {
        setLoadingTopic(true);
        const fetchedTopic = await fetchTopicById(topicId);
        setTopic(fetchedTopic);
      } catch (err: any) {
        setTopicError('שגיאה בטעינת פרטי נושא: ' + err.message);
        console.error('Error fetching topic:', err);
      } finally {
        setLoadingTopic(false);
      }
    };
    getTopicDetails();
  }, [topicId]);

  // Fetch all levels
  useEffect(() => {
    const getLevels = async () => {
      try {
        setLoadingLevels(true);
        const fetchedLevels = await fetchAllLevels();
        setLevels(fetchedLevels.sort((a, b) => a.level_number - b.level_number));
      } catch (err: any) {
        setLevelsError('שגיאה בטעינת רמות: ' + err.message);
        console.error('Error fetching levels:', err);
      } finally {
        setLoadingLevels(false);
      }
    };
    getLevels();
  }, []);

  // Fetch questions based on selected topic and level using fetchQuizQuestions
  const loadQuestions = useCallback(async () => {
    if (!topic || !topic.name || !topic.id) { // Added topic.id check
      setQuestionsError('Topic information is missing to fetch questions.');
      return;
    }

    try {
      setLoadingQuestions(true);
      setQuestionsError(null);

      let fetchedQuestions: Question[] = [];

      if (selectedLevelId === 'all') {
        fetchedQuestions = await fetchQuestionsByTopicId(topic.id); // This fetches all questions for the topic
      } else {
        const selectedLevel = levels.find(lvl => lvl.id === selectedLevelId);
        if (selectedLevel) {
          // Note: fetchQuizQuestions is likely intended for quizzes, not for full topic management lists.
          // It might return a random subset or be optimized differently.
          // If you need *all* questions for a specific level within a topic,
          // you might need a different API endpoint or to filter fetchQuestionsByTopicId results.
          // For now, let's assume fetchQuizQuestions is sufficient or you have a backend adjustment.
          fetchedQuestions = await fetchQuizQuestions(topic.name, selectedLevel.level_number);
        } else {
          setQuestionsError('Selected level not found.');
          return;
        }
      }
      setQuestions(fetchedQuestions); // Update the questions state directly
    } catch (err: any) {
      setQuestionsError('שגיאה בטעינת שאלות: ' + err.message);
      console.error('Error fetching questions:', err);
    } finally {
      setLoadingQuestions(false);
    }
  }, [topic, selectedLevelId, levels]); // Dependencies: topic (for name and id), selectedLevelId, levels (for level_number)


  // Trigger question loading when relevant dependencies change
  useEffect(() => {
    if (topic && levels.length > 0) { // Ensure topic and levels are loaded before trying to fetch questions
      loadQuestions();
    }
  }, [topic, selectedLevelId, levels, loadQuestions]);


  const handleLevelChange = (event: { target: { value: string } }) => {
    setSelectedLevelId(event.target.value);
  };

  const getGradientStyle = (colorsString?: string) => {
    if (!colorsString) return {};
    const colors = colorsString.split(',');
    if (colors.length === 0) return {};
    if (colors.length === 1) return { backgroundColor: colors[0] };
    return {
      background: `linear-gradient(to right, ${colors.join(', ')})`,
    };
  };

  const handleDeleteQuestionClick = useCallback((question: Question) => {
    setQuestionToDelete(question);
    setShowConfirmDeleteQuestionDialog(true);
    setDeleteQuestionError(null);
  }, []);

  const handleConfirmDeleteQuestion = async () => {
    if (!questionToDelete) return;

    setDeletingQuestion(true);
    try {
      await deleteQuestion(questionToDelete.id);
      // Remove from the current questions state (which is already filtered)
      setQuestions((prevQuestions) => prevQuestions.filter((q) => q.id !== questionToDelete.id));
      setShowConfirmDeleteQuestionDialog(false);
      setQuestionToDelete(null);
    } catch (err: any) {
      console.error('Error deleting question:', err);
      setDeleteQuestionError(err.message || 'שגיאה במחיקת שאלה. אנא נסה שוב.');
    } finally {
      setDeletingQuestion(false);
    }
  };

  const handleCancelDeleteQuestion = useCallback(() => {
    setShowConfirmDeleteQuestionDialog(false);
    setQuestionToDelete(null);
    setDeleteQuestionError(null);
  }, []);

  const handleAddQuestionClick = () => {
    setShowAddQuestionDialog(true);
  };

  const handleEditQuestionClick = (question: Question) => {
    setQuestionToEdit(question);
    setShowEditQuestionDialog(true);
  };

  // Function to handle successful addition of a new question
  const handleQuestionAdded = (newQuestion: Question) => {
    // Re-fetch questions to ensure the list is up-to-date and correctly filtered
    loadQuestions();
    setShowAddQuestionDialog(false);
    setAddingQuestion(false);
  };

  // Function to handle successful update of an existing question
  const handleQuestionUpdated = (updatedQuestion: Question) => {
    // Re-fetch questions to ensure the list is up-to-date and correctly filtered
    loadQuestions();
    setShowEditQuestionDialog(false);
    setQuestionToEdit(null);
    setEditingQuestion(false);
  };

  if (loadingTopic || loadingLevels) {
    return (
      <Container component="main" maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>טוען פרטי נושא ורמות...</Typography>
      </Container>
    );
  }

  if (topicError || levelsError) {
    return (
      <Container component="main" maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <Alert severity="error">{topicError || levelsError}</Alert>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/dashboard')}>חזור לדשבורד</Button>
      </Container>
    );
  }

  if (!topic) {
    return (
      <Container component="main" maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <Alert severity="warning">הנושא לא נמצא.</Alert>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/dashboard')}>חזור לדשבורד</Button>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, textAlign: 'center', width: '100%' }}>
        <Typography component="h1" variant="h4" sx={{ mb: 2, color: 'primary.main' }}>
          ניהול שאלות עבור נושא: {topic.name}
        </Typography>

        <Button
          variant="outlined"
          onClick={() => navigate('/dashboard')}
          sx={{ mb: 3 }}
        >
          חזור לדשבורד
        </Button>

        <Box sx={{ mt: 4, width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">שאלות</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel id="level-select-label">בחר רמה</InputLabel>
                <Select
                  labelId="level-select-label"
                  id="level-select"
                  value={selectedLevelId}
                  label="בחר רמה"
                  onChange={handleLevelChange}
                >
                  <MenuItem value="all">כל הרמות</MenuItem>
                  {levels.map((level) => (
                    <MenuItem key={level.id} value={level.id}>
                      רמה {level.level_number}: {level.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddQuestionClick}
              >
                הוסף שאלה חדשה
              </Button>
            </Box>
          </Box>

          {loadingQuestions ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress size={24} />
            </Box>
          ) : questionsError ? (
            <Alert severity="error" sx={{ mt: 4 }}>{questionsError}</Alert>
          ) : questions.length === 0 ? (
            <Alert severity="info" sx={{ mt: 4 }}>
              לא נמצאו שאלות לנושא זה
              {selectedLevelId !== 'all' ? ` ולרמה זו (${levels.find(l => l.id === selectedLevelId)?.name}).` : '.'}
            </Alert>
          ) : (
            <Grid container spacing={2}>
              {questions.map((question) => {
                const levelColor = question.level ? question.level.color : undefined;
                return (
                  // Changed size from 'size' to 'item xs={12} sm={6} md={4}' as per MUI Grid usage
                  <Grid size={{xs:12, sm:6, md:4}} key={question.id}> 
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        ...getGradientStyle(levelColor),
                        color: 'white',
                        position: 'relative',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 'auto',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: 'auto',
                          backgroundColor: 'rgba(0, 0, 0, 0.3)',
                          zIndex: 1,
                        },
                      }}
                    >
                      <CardContent sx={{ zIndex: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                          רמה: {question.level.name} (מספר {question.level.level_number})
                        </Typography>
                        
                        {/* הוסף כאן את סוג השאלה */}
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                          סוג שאלה: {question.question_type === 'multiple_choice' ? 'בחירה מרובה' : 'פתוחה'}
                        </Typography>

                        <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                          {question.text}
                        </Typography>
                        
                        {/* הוסף כאן את התשובה הנכונה */}
                        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, color: '#DCEDC8', textAlign: 'left' }}>
                          תשובה נכונה: <span style={{ fontWeight: 'bold' }}>{question.answer_text}</span>
                        </Typography>

                        {/* הצג תשובות נוספות רק אם סוג השאלה הוא multiple_choice ויש תשובות */}
                        {question.question_type === 'multiple_choice' && question.answers && question.answers.length > 0 && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, color: 'inherit', textAlign: 'left' }}>תשובות נוספות:</Typography>
                            <List sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}>
                              {question.answers.map((answer, index) => (
                                <ListItem key={index} dense sx={{ py: 0.5 }}>
                                  <ListItemText
                                    primary={
                                      <Box sx={{ display: 'flex', alignItems: 'center', color: 'inherit' }}>
                                        {/* הסימון V או X לתשובה נכונה/לא נכונה
                                           Note: In 'answers' array for MC, we typically only store *incorrect* answers.
                                           The correct answer is in `answer_text`.
                                           So, remove the `answer.text === question.answer_text` check here
                                           as it should *never* be true for an 'incorrect answers' list.
                                           If it's true, it means your API is sending correct answers in `answers` array.
                                           If `answers` can contain correct answers as well, we need to adjust
                                           the logic of `AddQuestionDialog` and `EditQuestionDialog` to match.
                                           For now, I'll assume `answers` only contains incorrect answers.
                                        */}
                                        <RadioButtonUncheckedIcon sx={{ mr: 1, color: 'inherit' }} /> {/* Always unchecked for incorrect answers */}
                                        <Typography sx={{ color: 'inherit' }}>{answer.text}</Typography>
                                      </Box>
                                    }
                                  />
                                </ListItem>
                              ))}
                            </List>
                          </Box>
                        )}
                        {/* אם סוג השאלה פתוחה, אין צורך להציג "תשובות נוספות" */}
                        {question.question_type === 'open' && question.answers && question.answers.length > 0 && (
                            <Alert severity="warning" sx={{mt:2}}>
                                אזהרה: לשאלה פתוחה לא אמורות להיות "תשובות נוספות" במערך ה-answers.
                            </Alert>
                        )}
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0, zIndex: 2 }}>
                        <IconButton
                          aria-label="edit question"
                          onClick={() => handleEditQuestionClick(question)}
                          sx={{ color: 'inherit' }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          aria-label="delete question"
                          onClick={() => handleDeleteQuestionClick(question)}
                          disabled={deletingQuestion}
                          sx={{ color: 'inherit' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>
      </Paper>

      <ConfirmationDialog
        open={showConfirmDeleteQuestionDialog}
        onClose={handleCancelDeleteQuestion}
        onConfirm={handleConfirmDeleteQuestion}
        title="אישור מחיקת שאלה"
        message={`האם אתה בטוח שברצונך למחוק את השאלה: "${questionToDelete?.text}"? פעולה זו בלתי הפיכה.`}
        confirmButtonText="מחק"
        cancelButtonText="ביטול"
        loading={deletingQuestion}
        error={deleteQuestionError}
      />

      <AddQuestionDialog
        open={showAddQuestionDialog}
        onClose={() => setShowAddQuestionDialog(false)}
        onAddQuestion={handleQuestionAdded}
        loading={addingQuestion}
        error={addQuestionError}
        topic={topic}
        levels={levels}
        ownerId={currentUserId || ''}
      />

      <EditQuestionDialog
        open={showEditQuestionDialog}
        onClose={() => setShowEditQuestionDialog(false)}
        onSaveQuestion={handleQuestionUpdated}
        loading={editingQuestion}
        error={editQuestionError}
        questionToEdit={questionToEdit}
        topic={topic}
        levels={levels}
        ownerId={currentUserId || ''}
      />

    </Container>
  );
};

export default TopicQuestionsPage;