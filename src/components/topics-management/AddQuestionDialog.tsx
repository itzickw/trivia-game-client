// src/components/dashboard/AddQuestionDialog.tsx
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Typography,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

import { type CreateQuestionDto, type QuestionType, createQuestion, type Question } from '../../api/questions';
import { type Topic } from '../../api/topics';
import { type Level } from '../../api/levels';
// import { type Answer } from '../../api/answers'; // אין צורך לייבא אם אנחנו בונים { text: string }

interface AddQuestionDialogProps {
  open: boolean;
  onClose: () => void;
  onAddQuestion: (newQuestion: Question) => void; // Call with the full created question
  loading: boolean;
  error: string | null;
  topic: Topic | null; // The current topic being managed
  levels: Level[]; // All available levels
  ownerId: string; // The owner ID from the current user
}

const AddQuestionDialog: React.FC<AddQuestionDialogProps> = ({
  open,
  onClose,
  onAddQuestion,
  loading,
  error,
  topic,
  levels,
  ownerId,
}) => {
  const [questionText, setQuestionText] = useState('');
  const [selectedLevelId, setSelectedLevelId] = useState<string>('');
  const [questionType, setQuestionType] = useState<QuestionType>('multiple_choice'); // Default to multiple choice
  const [correctAnswerText, setCorrectAnswerText] = useState('');
  // additionalAnswers יכיל רק את התשובות הלא נכונות
  const [additionalAnswers, setAdditionalAnswers] = useState<{ text: string }[]>([{ text: '' }]); // Initial empty answer field for MC
  const [localError, setLocalError] = useState<string | null>(null);

  // Reset form when dialog opens/closes
  useEffect(() => {
    console.log("AddQuestionDialog useEffect triggered. Open:", open); // לוג לבדיקה
    if (open) {
      setQuestionText('');
      setSelectedLevelId('');
      setQuestionType('multiple_choice');
      setCorrectAnswerText('');
      setAdditionalAnswers([{ text: '' }]); // Reset to one empty field for multiple choice
      setLocalError(null);
    }
  }, [open]);

  const handleAddAnswerField = () => {
    setAdditionalAnswers([...additionalAnswers, { text: '' }]);
  };

  const handleRemoveAnswerField = (index: number) => {
    const newAnswers = [...additionalAnswers];
    newAnswers.splice(index, 1);
    setAdditionalAnswers(newAnswers);
  };

  const handleAnswerTextChange = (index: number, value: string) => {
    const newAnswers = [...additionalAnswers];
    newAnswers[index].text = value;
    setAdditionalAnswers(newAnswers);
  };

  const handleAddQuestionClick = async () => {
    setLocalError(null);

    if (!topic || !topic.id) {
      setLocalError('Topic information is missing.');
      return;
    }
    if (!ownerId) {
      setLocalError('Owner ID is missing. Please log in again.');
      return;
    }
    if (questionText.trim() === '') {
      setLocalError('טקסט השאלה לא יכול להיות ריק.');
      return;
    }
    if (selectedLevelId === '') {
      setLocalError('יש לבחור רמה עבור השאלה.');
      return;
    }
    const trimmedCorrectAnswerText = correctAnswerText.trim();
    if (trimmedCorrectAnswerText === '') {
      setLocalError('יש לספק תשובה נכונה.');
      return;
    }

    let answersForDto: { text: string }[] = []; // זה המערך שיישלח ב-DTO

    if (questionType === 'multiple_choice') {
      const uniqueAdditionalAnswersTextsLowercase = new Set<string>();
      
      additionalAnswers.forEach(ans => {
        if (ans.text.trim() !== '') {
          uniqueAdditionalAnswersTextsLowercase.add(ans.text.trim().toLowerCase());
        }
      });

      const trimmedLowercaseCorrectAnswerText = trimmedCorrectAnswerText.toLowerCase();

      // Validation 1: Check if correct answer (lowercase) is present in unique additional answers (lowercase)
      if (uniqueAdditionalAnswersTextsLowercase.has(trimmedLowercaseCorrectAnswerText)) {
        setLocalError('התשובה הנכונה לא יכולה להיות גם בין התשובות הנוספות (הלא נכונות).');
        return;
      }

      // Validation 2: For multiple choice, ensure there's at least one unique incorrect answer
      if (uniqueAdditionalAnswersTextsLowercase.size === 0) {
        setLocalError('לשאלת בחירה מרובה נדרשת לפחות תשובה לא נכונה אחת.');
        return;
      }

      // Build answersForDto, ensuring uniqueness and preserving original casing (trimmed)
      const uniqueTextsSeen = new Set<string>();
      for (const ans of additionalAnswers) {
          const trimmedAnsText = ans.text.trim();
          if (trimmedAnsText !== '' && !uniqueTextsSeen.has(trimmedAnsText.toLowerCase())) {
              answersForDto.push({ text: trimmedAnsText });
              uniqueTextsSeen.add(trimmedAnsText.toLowerCase());
          }
      }

    } else { // For 'open' type, answers array should be empty
      answersForDto = []; // Correct: for 'open' type, the answers array on DTO should be empty
    }

    const newQuestionData: CreateQuestionDto = {
      topic_id: topic.id,
      level_id: selectedLevelId,
      text: questionText.trim(),
      question_type: questionType,
      answer_text: trimmedCorrectAnswerText, // The correct answer text is sent separately
      owner_id: ownerId,
      answers: answersForDto, // This now contains ONLY the unique incorrect answers, or is empty for 'open' type
    };

    console.log('Question data being sent for creation:', newQuestionData); // לוג חשוב לבדיקה
    
    try {
      const createdQuestion = await createQuestion(newQuestionData);
      onAddQuestion(createdQuestion); // Pass the full created question
    } catch (err: any) {
      console.log('Error data sent:', newQuestionData); // לוג גם במקרה של שגיאה
      setLocalError(err.message || 'שגיאה בהוספת שאלה. אנא נסה שוב.');
      console.error('Error creating question:', err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>הוסף שאלה חדשה לנושא: {topic?.name}</DialogTitle>
      <DialogContent dividers>
        {(error || localError) && <Alert severity="error" sx={{ mb: 2 }}>{error || localError}</Alert>}
        <TextField
          autoFocus
          margin="dense"
          id="questionText"
          label="טקסט השאלה"
          type="text"
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          disabled={loading}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
          <InputLabel id="level-select-label">בחר רמה</InputLabel>
          <Select
            labelId="level-select-label"
            id="level-select"
            value={selectedLevelId}
            label="בחר רמה"
            onChange={(e) => setSelectedLevelId(e.target.value as string)}
            disabled={loading}
          >
            {levels.map((level) => (
              <MenuItem key={level.id} value={level.id}>
                רמה {level.level_number}: {level.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl component="fieldset" margin="dense" fullWidth sx={{ mb: 2 }}>
          <FormLabel component="legend">סוג שאלה</FormLabel>
          <RadioGroup
            row
            aria-label="question-type"
            name="question-type"
            value={questionType}
            onChange={(e) => {
              setQuestionType(e.target.value as QuestionType);
              // When changing to 'open', clear additional answers (or set to empty array)
              if (e.target.value === 'open') {
                setAdditionalAnswers([]); // Important: empty array for open questions
              } else if (additionalAnswers.length === 0) {
                // When changing to 'multiple_choice' and no additional answers, add an empty field
                setAdditionalAnswers([{ text: '' }]);
              }
            }}
            // REMOVED: disabled={loading} from RadioGroup directly
          >
            <FormControlLabel value="multiple_choice" control={<Radio disabled={loading} />} label="בחירה מרובה" disabled={loading} />
            <FormControlLabel value="open" control={<Radio disabled={loading} />} label="שאלה פתוחה" disabled={loading} />
          </RadioGroup>
        </FormControl>

        <TextField
            margin="dense"
            id="correctAnswerText"
            label="תשובה נכונה"
            type="text"
            fullWidth
            variant="outlined"
            value={correctAnswerText}
            onChange={(e) => setCorrectAnswerText(e.target.value)}
            disabled={loading}
            sx={{ mb: 2 }}
        />

        {questionType === 'multiple_choice' && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>תשובות נוספות (לא נכונות):</Typography>
            {additionalAnswers.map((answer, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  label={`תשובה ${index + 1}`}
                  value={answer.text}
                  onChange={(e) => handleAnswerTextChange(index, e.target.value)}
                  disabled={loading}
                />
                <IconButton
                  onClick={() => handleRemoveAnswerField(index)}
                  disabled={loading || (additionalAnswers.length <= 1 && additionalAnswers[0]?.text.trim() === '')} // Don't allow removing last one if it's the only one and empty
                  color="error"
                  sx={{ ml: 1 }}
                >
                  <RemoveCircleOutlineIcon />
                </IconButton>
              </Box>
            ))}
            <Button
              variant="outlined"
              startIcon={<AddCircleOutlineIcon />}
              onClick={handleAddAnswerField}
              disabled={loading}
              fullWidth
              sx={{ mt: 1 }}
            >
              הוסף שדה תשובה
            </Button>
          </Box>
        )}

      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>ביטול</Button>
        <Button onClick={handleAddQuestionClick} disabled={loading} variant="contained" color="primary">
          {loading ? <CircularProgress size={24} /> : 'הוסף שאלה'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddQuestionDialog;