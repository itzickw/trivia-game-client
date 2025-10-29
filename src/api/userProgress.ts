// src/api/userProgress.ts
import apiRequest from './index';

// Your existing UserProgress interface - represents a single correctly answered question
export interface UserProgress {
  id: string;
  user_id: string;
  question_id: string;
  created_at: string;
  updated_at: string;
  // Potentially include relations if your backend automatically joins them
  // question?: Question; // If question data is joined
  // topic_id?: string; // If topic_id is stored directly on user_progress or joined via question
  // level_id?: string; // If level_id is stored directly on user_progress or joined via question
}

export interface CreateUserProgressDto {
  user_id: string;
  question_id: string;
}

export const fetchAllUserProgress = async (): Promise<UserProgress[]> => {
  return apiRequest<UserProgress[]>('/user-progress', 'GET');
};

export const fetchUserProgressById = async (id: string): Promise<UserProgress> => {
  return apiRequest<UserProgress>(`/user-progress/${id}`, 'GET');
};

export const createUserProgress = async (userProgressData: CreateUserProgressDto): Promise<UserProgress> => {
  return apiRequest<UserProgress>('/user-progress', 'POST', userProgressData, true);
};

export const fetchUserProgressByUserId = async (userId: string): Promise<UserProgress[]> => {
  return apiRequest<UserProgress[]>(`/user-progress/user/${userId}`, 'GET');
}

export const fetchTopicLevelUserProgress = async (userId: string, topicId: string, levelNumber: number): Promise<UserProgress[]> => {
  return apiRequest<UserProgress[]>(`/user-progress/topic/level/${userId}/${topicId}/${levelNumber}`, 'GET');
}

export const getUserLevelInTopic = async (userId: string, topicId: string): Promise<number> => {
  return apiRequest<number>(`/user-progress/topics-level/${userId}/${topicId}`, 'GET');
}


// This function will be called when a user submits an answer.
// If the answer is correct, it creates a new user progress entry.
export const submitQuizAnswer = async (
  userId: string,
  questionId: string,
  isCorrect: boolean
): Promise<UserProgress | null> => {
  if (isCorrect) {
    // Only create a progress entry if the answer is correct
    const progressData: CreateUserProgressDto = {
      user_id: userId,
      question_id: questionId,
    };
    try {
      const newProgress = await createUserProgress(progressData);
      return newProgress;
    } catch (error) {
      console.error('Error creating user progress after correct answer:', error);
      throw error; // Re-throw to be caught by UI
    }
  }
  // If not correct, no progress entry is created/updated for this specific answer
  return null;
};

// Helper function to get all questions the user has answered correctly for a given topic/level.
// This will be crucial for marking questions as "already answered correctly" in the UI.
export const getAnsweredQuestionIdsForTopicLevel = async (
  userId: string,
  topicId: string,
  levelNumber: number
): Promise<string[]> => {
  try {
    const progressEntries = await fetchTopicLevelUserProgress(userId, topicId, levelNumber);
    // Extract only the question_ids from the progress entries
    const answeredIds = progressEntries.map(entry => entry.question_id);
    return answeredIds;
  } catch (error) {
    console.error(`Error fetching answered question IDs for topic ${topicId}, level ${levelNumber}:`, error);
    // Depending on your error handling strategy, you might return an empty array or re-throw
    return [];
  }
};

// Helper function to get the user's highest achieved level for a topic.
// This directly uses your existing `getUserLevelInTopic` endpoint.
export const getHighestUserLevelForTopic = async (userId: string, topicId: string): Promise<number> => {
    try {
        const levelNumber = await getUserLevelInTopic(userId, topicId);
        return levelNumber;
    } catch (error) {
        console.error(`Error fetching highest level for user ${userId} in topic ${topicId}:`, error);
        // If the user has no progress, assume level 0 or 1, depending on your level numbering scheme.
        // Returning 0 might indicate no levels completed.
        return 0; // Or 1 if level numbering starts from 1 and first level is always accessible
    }
};

// --- IMPORTANT NOTE ON USER PROGRESS MODEL ---
/*
Based on your `UserProgress` interface and endpoints:
- Your backend seems to store *individual correct answers* as `UserProgress` records.
- The `getUserLevelInTopic` endpoint is critical for determining the user's current highest achieved level.
- `fetchTopicLevelUserProgress` will give us a list of *all* questions answered correctly for a given topic and level.

This means in the `QuizPage.tsx`, we will:
1. Fetch `getHighestUserLevelForTopic` to determine which levels are accessible to the user.
2. When displaying a quiz for a specific level, fetch `fetchQuizQuestions` for that level.
3. Simultaneously fetch `getAnsweredQuestionIdsForTopicLevel` for the *same* topic and level to know which questions are already completed.
4. When a user answers a question correctly, call `submitQuizAnswer` (which internally calls `createUserProgress`).
*/