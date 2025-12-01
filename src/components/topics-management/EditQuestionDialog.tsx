// src/components/dashboard/EditQuestionDialog.tsx
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
  Typography
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

import { type UpdateQuestionDto, type QuestionType, updateQuestion, type Question } from '../../api/questions';
import { type Topic } from '../../api/topics';
import { type Level } from '../../api/levels';

interface EditQuestionDialogProps {
  open: boolean;
  onClose: () => void;
  onSaveQuestion: (updatedQuestion: Question) => void;
  loading: boolean;
  error: string | null;
  questionToEdit: Question | null;
  topic: Topic | null;
  levels: Level[];
  ownerId: string;
}

const EditQuestionDialog: React.FC<EditQuestionDialogProps> = ({
  open,
  onClose,
  onSaveQuestion,
  loading,
  error,
  questionToEdit,
  levels,
}) => {
  const [questionText, setQuestionText] = useState('');
  const [selectedLevelId, setSelectedLevelId] = useState<string>('');
  const [questionType, setQuestionType] = useState<QuestionType>('multiple_choice');
  const [correctAnswerText, setCorrectAnswerText] = useState('');
  const [additionalAnswers, setAdditionalAnswers] = useState<{ text: string }[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (questionToEdit) {
      console.log('Editing question:', questionToEdit);
      setQuestionText(questionToEdit.text);
      setSelectedLevelId(questionToEdit.level.id);
      setQuestionType(questionToEdit.question_type);
      setCorrectAnswerText(questionToEdit.answer_text);

      // Convert to lowercase and trim for robust comparison
      const trimmedLowercaseCorrectAnswer = questionToEdit.answer_text.trim().toLowerCase();

      const incorrectAnswers = questionToEdit.answers
        .filter(answer => answer.text.trim().toLowerCase() !== trimmedLowercaseCorrectAnswer)
        .map(answer => ({ text: answer.text })); // Keep original casing for display

      if (questionToEdit.question_type === 'multiple_choice' && incorrectAnswers.length === 0) {
        setAdditionalAnswers([{ text: '' }]);
      } else {
        setAdditionalAnswers(incorrectAnswers);
      }
      setLocalError(null);
    } else if (!open) {
      setQuestionText('');
      setSelectedLevelId('');
      setQuestionType('multiple_choice');
      setCorrectAnswerText('');
      setAdditionalAnswers([]);
      setLocalError(null);
    }
  }, [questionToEdit, open]);

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
    console.log('Updated answer at index', index, 'to:', value);
    setAdditionalAnswers(newAnswers);
  };

  const handleSaveQuestionClick = async () => {
    setLocalError(null);
    console.log('Saving question with data: ', questionText);

    if (!questionToEdit || !questionToEdit.id) {
      setLocalError('Question to edit is missing.');
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

    let answersForDto: { text: string }[] = [];

    if (questionType === 'multiple_choice') {
      const uniqueAdditionalAnswersTextsLowercase = new Set<string>(); // Store lowercase for comparison

      additionalAnswers.forEach(ans => {
        if (ans.text.trim() !== '') {
          uniqueAdditionalAnswersTextsLowercase.add(ans.text.trim().toLowerCase()); // Add lowercase for set
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

      // When converting Set back to array, use the original (untrimmed) text from additionalAnswers
      // However, ensure only unique (case-insensitive) answers are picked.
      // We'll map from the original additionalAnswers but filter by our lowercase set to avoid duplicates.
      // const finalAdditionalAnswersForDto = additionalAnswers
      //   .filter(ans => ans.text.trim() !== '' && uniqueAdditionalAnswersTextsLowercase.has(ans.text.trim().toLowerCase()))
      //   .map(ans => ({ text: ans.text.trim() })); // Trim for sending to server

      // To ensure truly unique answers in the sent DTO, it's better to build from the Set of original texts
      // (if preserving case is important for the API). If API is case-insensitive, then previous approach is fine.
      // Assuming API is case-insensitive in validation but preserves casing on save:
      const uniqueTextsSeen = new Set<string>();
      answersForDto = [];
      for (const ans of additionalAnswers) {
        const trimmedAnsText = ans.text.trim();
        if (trimmedAnsText !== '' && !uniqueTextsSeen.has(trimmedAnsText.toLowerCase())) {
          answersForDto.push({ text: trimmedAnsText });
          uniqueTextsSeen.add(trimmedAnsText.toLowerCase());
        }
      }

    } else { // For 'open' type
      answersForDto = [];
    }

    const updatedQuestionData: UpdateQuestionDto = {
      text: questionText.trim(),
      level_id: selectedLevelId,
      question_type: questionType,
      answer_text: trimmedCorrectAnswerText,
      answers: answersForDto, // This now contains only truly unique (case-insensitive) incorrect answers
    };

    console.log('Question data being sent for update:', updatedQuestionData);

    try {
      const updatedQuestion = await updateQuestion(questionToEdit.id, updatedQuestionData);
      onSaveQuestion(updatedQuestion);
    } catch (err: any) {
      console.log('Error data sent:', updatedQuestionData);
      setLocalError(err.message || 'שגיאה בעדכון שאלה. אנא נסה שוב.');
      console.error('Error updating question:', err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>ערוך שאלה: {questionToEdit?.text}</DialogTitle>
      <DialogContent dividers>
        {(error || localError) && <Alert severity="error" sx={{ mb: 2 }}>{error || localError}</Alert>}
        <TextField
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
              if (e.target.value === 'open') {
                setAdditionalAnswers([]);
              } else if (additionalAnswers.length === 0) {
                setAdditionalAnswers([{ text: '' }]);
              }
            }}
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
                  disabled={loading || (additionalAnswers.length <= 1 && additionalAnswers[0]?.text.trim() === '')}
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
        <Button onClick={handleSaveQuestionClick} disabled={loading} variant="contained" color="primary">
          {loading ? <CircularProgress size={24} /> : 'שמור שינויים'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditQuestionDialog;