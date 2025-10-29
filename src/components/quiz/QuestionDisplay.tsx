// src/components/quiz/QuestionDisplay.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Fade,
  LinearProgress,
} from '@mui/material';
import type { QuizQuestion } from '../../api/quiz';

interface QuestionDisplayProps {
  question: QuizQuestion;
  currentQuestionIndex: number;
  totalQuestions: number;
  onSubmitAnswer: (questionId: string, isCorrect: boolean) => void;
}

// פונקציית עזר לערבוב מערך
const shuffleArray = <T extends any[]>(array: T): T => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  currentQuestionIndex,
  totalQuestions,
  onSubmitAnswer,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [openAnswer, setOpenAnswer] = useState<string>('');
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [shuffledAnswers, setShuffledAnswers] = useState<typeof question.answers>([]);

  useEffect(() => {
    // מערבבים את התשובות רק כאשר השאלה משתנה
    if (question.question_type === 'multiple_choice' && question.answers) {
      setShuffledAnswers(shuffleArray([...question.answers]));
    }
  }, [question]);

  const handleSelectAnswer = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAnswer(event.target.value);
  };

  const handleOpenAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOpenAnswer(event.target.value);
  };

  const handleCheckAnswer = () => {
    let answerStatus: boolean;
    if (question.question_type === 'multiple_choice') {
      answerStatus = selectedAnswer === question.answer_text;
    } else {
      answerStatus = openAnswer.trim().toLowerCase() === question.answer_text.trim().toLowerCase();
    }
    setIsCorrect(answerStatus);
    setIsFeedbackVisible(true);

    setTimeout(() => {
      onSubmitAnswer(question.id, answerStatus);
      setSelectedAnswer(null);
      setOpenAnswer('');
      setIsFeedbackVisible(false);
      setIsCorrect(null);
    }, 1500); // 1.5 second delay
  };

  // אם השאלה כבר נענתה, נציג אותה באופן שונה
  if (question.answered) {
    return (
      <Box sx={{ width: '100%', maxWidth: '600px', mx: 'auto', mt: 4 }}>
        <LinearProgress
          variant="determinate"
          value={((currentQuestionIndex + 1) / totalQuestions) * 100}
          sx={{ height: 10, borderRadius: 5, mb: 3 }}
        />
        <Typography variant="h6" gutterBottom align="center">
          שאלה {currentQuestionIndex + 1} מתוך {totalQuestions}
        </Typography>
        <Box sx={{ p: 3, border: '1px solid', borderColor: 'success.main', borderRadius: 2, mb: 3 }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'success.main' }}>
            ✅ שאלה זו כבר נענתה בהצלחה!
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            {question.text}
          </Typography>
        </Box>

        {question.question_type === 'multiple_choice' ? (
          <RadioGroup value={question.answer_text}>
            {/* נציג את כל התשובות, נסמן את הנכונה */}
            {question.answers.map((answer) => (
              <FormControlLabel
                key={answer.id}
                value={answer.text}
                control={<Radio checked={answer.text === question.answer_text} />}
                label={answer.text}
                sx={{
                  color: answer.text === question.answer_text ? 'success.main' : 'inherit',
                  '& .Mui-checked': {
                    color: 'success.main !important',
                  },
                }}
              />
            ))}
          </RadioGroup>
        ) : (
          <TextField
            fullWidth
            label="תשובה נכונה"
            variant="outlined"
            value={question.answer_text}
            disabled
            sx={{ mt: 2 }}
          />
        )}
        <Button
          variant="contained"
          fullWidth
          onClick={() => onSubmitAnswer(question.id, true)}
          sx={{ mt: 3 }}
        >
          עבור לשאלה הבאה
        </Button>
      </Box>
    );
  }

  // הצגת שאלה שטרם נענתה
  return (
    <Box sx={{ width: '100%', maxWidth: '600px', mx: 'auto', mt: 4 }}>
      <LinearProgress
        variant="determinate"
        value={((currentQuestionIndex) / totalQuestions) * 100}
        sx={{ height: 10, borderRadius: 5, mb: 3 }}
      />
      <Typography variant="h6" gutterBottom align="center">
        שאלה {currentQuestionIndex + 1} מתוך {totalQuestions}
      </Typography>
      <Box sx={{ p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2, mb: 3 }}>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
          {question.text}
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        {question.question_type === 'multiple_choice' ? (
          <RadioGroup value={selectedAnswer} onChange={handleSelectAnswer}>
            {shuffledAnswers.map((answer) => (
              <FormControlLabel
                key={answer.id}
                value={answer.text}
                control={<Radio />}
                label={answer.text}
              />
            ))}
          </RadioGroup>
        ) : (
          <TextField
            fullWidth
            label="הקלד את תשובתך"
            variant="outlined"
            value={openAnswer}
            onChange={handleOpenAnswerChange}
            sx={{ mt: 2 }}
          />
        )}
      </Box>

      <Box sx={{ height: 50, mb: 2 }}>
        <Fade in={isFeedbackVisible}>
          <Typography
            variant="body1"
            align="center"
            sx={{ color: isCorrect ? 'success.main' : 'error.main' }}
          >
            {isCorrect ? '✅ נכון מאוד!' : '❌ תשובה שגויה. נסה שוב.'}
          </Typography>
        </Fade>
      </Box>
      
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleCheckAnswer}
        disabled={
          isFeedbackVisible ||
          (question.question_type === 'multiple_choice' && !selectedAnswer) ||
          (question.question_type === 'open' && !openAnswer.trim())
        }
      >
        שלח תשובה
      </Button>
    </Box>
  );
};

export default QuestionDisplay;