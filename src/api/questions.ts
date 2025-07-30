// src/api/questions.ts
import apiRequest from './index';
import { type Answer } from './answers'; // חדש: ייבוא Answer
import { type Topic } from './topics'; // חדש: ייבוא Topic (כ-type)
import { type Level } from './levels'; // חדש: ייבוא Level (כ-type)

export type QuestionType = "open" | "multiple_choice";

export interface Question {
  id: string;
  topic: Topic; // *** שינוי: Object של Topic ***
  level: Level; // *** שינוי: Object של Level ***
  text: string;
  question_type: QuestionType;
  answer_text: string; // This seems to be the correct answer text
  owner_id: string;
  answers: Answer[]; // *** שינוי: מערך של Answer Objects ***
  created_at: string; // חדש: כפי שמופיע בדוגמה
  updated_at: string; // חדש: כפי שמופיע בדוגמה
}

// CreateQuestionDto and UpdateQuestionDto will still use IDs
// as the server likely expects IDs for creation/update
export interface CreateQuestionDto {
  topic_id: string;
  level_id: string;
  text: string;
  question_type: QuestionType;
  answer_text: string;
  owner_id?: string;
  answers?: { text: string }[]; 
}

export interface UpdateQuestionDto {
  topic_id?: string;
  level_id?: string;
  text?: string;
  question_type?: QuestionType;
  answer_text?: string;
  owner_id?: string;
  answers?: { text: string }[]; // לדוגמה
}

// API Functions for Questions (ללא שינוי בפונקציות עצמן, כי הן כבר משתמשות בטיפוסים המעודכנים)
export const fetchAllQuestions = async (): Promise<Question[]> => {
  return apiRequest<Question[]>('/questions', 'GET');
};

export const fetchQuestionById = async (id: string): Promise<Question> => {
  return apiRequest<Question>(`/questions/id/${id}`, 'GET');
};

export const createQuestion = async (questionData: CreateQuestionDto): Promise<Question> => {
  return apiRequest<Question>('/questions', 'POST', questionData, true);
};

export const updateQuestion = async (id: string, questionData: UpdateQuestionDto): Promise<Question> => {
  return apiRequest<Question>(`/questions/${id}`, 'PATCH', questionData, true);
};

export const deleteQuestion = async (id: string): Promise<void> => {
  return apiRequest<void>(`/questions/${id}`, 'DELETE', undefined, true);
};

export const fetchQuizQuestions = async (topicName: string, levelNumber: number): Promise<Question[]> => {
  return apiRequest<Question[]>(`/questions/quiz/${topicName}/${levelNumber}`, 'GET');
};

export const fetchQuestionsByLevelId = async (levelId: string): Promise<Question[]> => {
  return apiRequest<Question[]>(`/questions/level-id/${levelId}`, 'GET');
};

export const fetchQuestionsByTopicId = async (topicId: string): Promise<Question[]> => {
  return apiRequest<Question[]>(`/questions/topic-id/${topicId}`, 'GET');
};

export const fetchQuestionsByTopicName = async (topicName: string): Promise<Question[]> => {
  return apiRequest<Question[]>(`/questions/topic-name/${topicName}`, 'GET');
};