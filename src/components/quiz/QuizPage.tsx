// src/components/quiz/QuizPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  fetchQuizDataForUser,
  type QuizData,
  type LevelWithQuestions,
} from '../../api/quiz';
import { createUserProgress } from '../../api/userProgress';
import useAuth from '../../hooks/useAuth';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';
import QuestionDisplay from './QuestionDisplay';
import MenuBar from '../common/menuBar/MenuBar';
import LevelSelectorContainer from './levelSelector/LevelSelectorContainer';

// Define the component's state to hold all quiz data, loading status, and errors
interface QuizState {
  quizData: QuizData | null;
  selectedLevel: LevelWithQuestions | null;
  currentQuestionIndex: number;
  loading: boolean;
  error: string | null;
}

const QuizPage: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const { user } = useAuth();
  const userName = user?.user_metadata?.full_name || user?.email || '';
  // const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [state, setState] = useState<QuizState>({
    quizData: null,
    selectedLevel: null,
    currentQuestionIndex: 0,
    loading: true,
    error: null,
  });

  // Effect to fetch all quiz data when the component mounts
  useEffect(() => {
    const loadQuizData = async () => {
      if (!user?.id || !topicId) {
        setState((prevState) => ({ ...prevState, error: 'User not authenticated or topic ID missing.', loading: false }));
        return;
      }

      try {
        const data = await fetchQuizDataForUser(user.id, topicId);
        setState({
          quizData: data,
          // Set the initial selected level to the user's highest achieved level
          selectedLevel: data.levels[data.maxUserLevel],
          currentQuestionIndex: 0,
          loading: false,
          error: null,
        });
      } catch (err) {
        console.error('Failed to fetch quiz data:', err);
        setState((prevState) => ({
          ...prevState,
          error: 'Failed to load quiz data. Please try again later.',
          loading: false,
        }));
      }
    };

    loadQuizData();
  }, [user, topicId]);

  // Handler for when a user submits an answer
  const handleSubmitAnswer = async (questionId: string, isCorrect: boolean) => {
    if (!user?.id || !state.quizData) {
      // Should not happen if the component is in a valid state
      return;
    }

    // If the answer is correct, update the progress on the server and locally
    if (isCorrect) {
      try {
        await createUserProgress({ user_id: user.id, question_id: questionId });

        // Update the local state to reflect the change
        setState(prevState => {
          if (!prevState.quizData || !prevState.selectedLevel) {
            return prevState;
          }

          const updatedLevels = { ...prevState.quizData.levels };
          const updatedQuestions = prevState.selectedLevel.questions.map(q =>
            q.id === questionId ? { ...q, answered: true } : q
          );
          updatedLevels[prevState.selectedLevel.level_number] = {
            ...prevState.selectedLevel,
            questions: updatedQuestions,
          };

          const allQuestionsAnsweredInLevel = updatedQuestions.every(q => q.answered);
          const newMaxUserLevel = allQuestionsAnsweredInLevel
            ? prevState.quizData.maxUserLevel + 1
            : prevState.quizData.maxUserLevel;

          return {
            ...prevState,
            quizData: {
              ...prevState.quizData,
              levels: updatedLevels,
              maxUserLevel: newMaxUserLevel,
            },
            selectedLevel: {
              ...prevState.selectedLevel,
              questions: updatedQuestions,
            },
          };
        });

      } catch (err) {
        console.error('Failed to submit user progress:', err);
        setState((prevState) => ({
          ...prevState,
          error: 'Failed to submit answer. Please try again.',
        }));
      }
    }

    // Move to the next question regardless of correctness
    setState((prevState) => ({
      ...prevState,
      currentQuestionIndex: prevState.currentQuestionIndex + 1,
    }));
  };

  // Render logic
  if (state.loading) {
    return <LoadingSpinner />;
  }

  if (state.error) {
    return <ErrorMessage message={state.error} />;
  }

  if (!state.quizData || !state.selectedLevel) {
    return <ErrorMessage message="No quiz data available." />;
  }

  const currentQuestion = state.selectedLevel.questions[state.currentQuestionIndex];
  const totalQuestions = state.selectedLevel.questions.length;

  return (
    <div className="quiz-page-container">
      <MenuBar userName={userName} />
      <h1>Quiz: {state.quizData.topic.name}</h1>
      <LevelSelectorContainer
        onLevelSelect={(levelNumber) => {selectedLevel =levelNumber}}
      />

      <div className="quiz-content">
        {currentQuestion && (
          <QuestionDisplay
            question={currentQuestion}
            onSubmitAnswer={handleSubmitAnswer}
            currentQuestionIndex={state.currentQuestionIndex}
            totalQuestions={totalQuestions}
          />
        )}
        {!currentQuestion && (
          <div className="quiz-finished">
            <h2>Level {state.selectedLevel.level_number} Completed! 🎉</h2>
            <p>You have answered all the questions in this level.</p>
            {state.selectedLevel.level_number === state.quizData.maxUserLevel && (
              <p>You have unlocked a new level!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;