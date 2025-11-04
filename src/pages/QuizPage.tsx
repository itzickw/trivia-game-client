// src/pages/QuizPage.tsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import MenuBar from "../components/common/menuBar/MenuBar";
import LevelSelectorContainer from "../components/quiz/levelSelector/LevelSelectorContainer";
import QuestionProgressBar from "../components/quiz/questionProgressBar/QuestionProgressBar";
import { handleAnswerCorrect } from "../components/quiz/quizLogic";
import type { QuizData } from "../api/quiz";
import QuestionContainer from "../components/quiz/question/QuestionContainer";
import { Box, Container } from "@mui/material";

interface QuizPageProps {
  initialQuizData: QuizData;
}

const QuizPage: React.FC<QuizPageProps> = ({ initialQuizData }) => {
  const { user } = useAuth();
  const [quizData, setQuizData] = useState<QuizData>(initialQuizData);
  const [selectedLevel, setSelectedLevel] = useState<number>(quizData.maxUserLevel);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  // שאלות הרמה הנוכחית
  const questions = quizData.levels[selectedLevel]?.questions ?? [];

  const handleCorrectAnswer = (questionId: string) => {
    const newData = handleAnswerCorrect({
      quizData,
      userId: user!.id,
      selectedLevel,
      questionId,
    });
    setQuizData(newData);
  };

  // נשתמש ב-useEffect כדי לבדוק אם המשתמש סיים רמה ולפתוח את הבאה
  useEffect(() => {
    const currentLevel = quizData.levels[selectedLevel];
    const allAnswered = currentLevel?.questions.every((q) => q.answered);

    if (allAnswered && selectedLevel < quizData.maxUserLevel) {
      setSelectedLevel(selectedLevel + 1);
    }
  }, [quizData, selectedLevel]);

  return (
    <Box sx={{
      minHeight: "100vh",  // גובה מלא של המסך
      backgroundColor: "background.default",
      display: "flex",
      alignItems: 'center',
      flexDirection: "column",
      gap: 1,
    }}>
      <MenuBar userName={user?.user_metadata?.full_name || user?.email || ''} />
      <LevelSelectorContainer onLevelSelect={setSelectedLevel} />
      <QuestionProgressBar
        questions={questions}
        selectedQuestionId={selectedQuestionId}
        onSelectQuestion={setSelectedQuestionId}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <QuestionContainer
          question={questions.find(q => q.id === selectedQuestionId) || questions[0]}
          levlColor={quizData.levels[selectedLevel]?.color}
          onCorrectAnswer={handleCorrectAnswer}
        />
      </div>
    </Box>
  );
};

export default QuizPage;
