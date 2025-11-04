// src/utils/quizLogic.ts
import { createUserProgress } from "../../api/userProgress";
import type { QuizData } from "../../api/quiz";

interface HandleAnswerCorrectParams {
  quizData: QuizData;
  userId: string;
  selectedLevel: number;
  questionId: string;
}

/**
 * מעדכן את מצב השאלות ברמה הנוכחית (מסמן שנענתה)
 */
function updateQuestionAnswered(
  quizData: QuizData,
  selectedLevel: number,
  questionId: string
): QuizData {
  const newLevels = { ...quizData.levels };
  const currentLevel = newLevels[selectedLevel];

  const newQuestions = currentLevel.questions.map((q) =>
    q.id === questionId ? { ...q, answered: true } : q
  );

  const newLevel = { ...currentLevel, questions: newQuestions };
  newLevels[selectedLevel] = newLevel;

  return { ...quizData, levels: newLevels };
}

/**
 * בודק האם המשתמש סיים את הרמה הנוכחית,
 * ואם כן – מעלה אותו לרמה הבאה (אם קיימת).
 */
function updateUserLevelIfNeeded(quizData: QuizData, selectedLevel: number): QuizData {
  const currentLevel = quizData.levels[selectedLevel];
  if (!currentLevel) return quizData;

  const allAnswered = currentLevel.questions.every((q) => q.answered);

  // אם כל השאלות נענו ויש רמה הבאה – נעלה אותה
  if (allAnswered && selectedLevel < Object.keys(quizData.levels).length) {
    const newMaxLevel = Math.max(quizData.maxUserLevel, selectedLevel + 1);
    return { ...quizData, maxUserLevel: newMaxLevel };
  }

  // אחרת – לא משנים כלום
  return quizData;
}

/**
 * הפונקציה הראשית שמטפלת בתשובה נכונה של המשתמש:
 * 1. מסמנת את השאלה שנענתה.
 * 2. בודקת אם יש צורך להעלות רמה.
 * 3. שולחת עדכון לשרת.
 */
export function handleAnswerCorrect({
  quizData,
  userId,
  selectedLevel,
  questionId,
}: HandleAnswerCorrectParams): QuizData {
  // עדכון בזיכרון בלבד
  let updatedQuiz = updateQuestionAnswered(quizData, selectedLevel, questionId);

  // בדיקה אם נפתח שלב חדש
  updatedQuiz = updateUserLevelIfNeeded(updatedQuiz, selectedLevel);

  // קריאה אחת בלבד לשרת
  createUserProgress({
    user_id: userId,
    question_id: questionId,
  });

  return updatedQuiz;
}
