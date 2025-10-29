// src/api/quiz.ts
import apiRequest from './index';
import { type Topic } from './topics';
import { type Level } from './levels';
import { type Question } from './questions';
import { type Answer } from './answers';

// נגדיר מחדש את הממשק של שאלה עם התקדמות, כפי שמופיע ב-JSON.
// זה מבטיח התאמה מדויקת של הטיפוסים.
export interface QuizQuestionWithProgress extends Question {
  answered: boolean;
}

// נגדיר מחדש את הממשק של רמה עם השאלות שלה.
export interface LevelWithQuestions extends Level {
  questions: QuizQuestion[];
}

// נגדיר מחדש את הממשק של הנתונים המלאים של החידון.
// זה כולל את הנושא, את כל הרמות הזמינות ואת הרמה המקסימלית של המשתמש.
export interface QuizData {
  topic: Topic;
  maxUserLevel: number; // השדה החדש שהוספת, המציין את רמת המשתמש המקסימלית.
  levels: {
    [levelNumber: string]: LevelWithQuestions;
  };
}

export interface QuizQuestion {
  id: string;
  text: string;
  question_type: 'multiple_choice' | 'open';
  answer_text: string;
  owner_id: string;
  answers: Answer[];
  created_at: string;
  updated_at: string;
  answered: boolean; // השדה החשוב להתקדמות המשתמש
}
/**
 * פונקציה לטעינת כל הנתונים הדרושים לחידון עבור משתמש ונושא ספציפי.
 * @param userId - מזהה המשתמש.
 * @param topicId - מזהה הנושא.
 * @returns אובייקט QuizData המכיל את כל המידע.
 */
export const fetchQuizDataForUser = async (userId: string, topicId: string): Promise<QuizData> => {
  // נשתמש ב-endpoint החדש שמוגדר בצד השרת.
  return apiRequest<QuizData>(`/quiz/user/${userId}/${topicId}`, 'GET');
};