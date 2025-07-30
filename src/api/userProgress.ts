import apiRequest from './index';

export interface UserProgress {
  id: string;
  user_id: string;
  question_id: string;
  created_at: string;
  updated_at: string;
}

export interface createUserProgressDto {
  user_id: string;  
  question_id: string;
}

export const fetchAllUserProgress = async (): Promise<UserProgress[]> => {
  return apiRequest<UserProgress[]>('/user-progress', 'GET');
};

export const fetchUserProgressById = async (id: string): Promise<UserProgress> => {
  return apiRequest<UserProgress>(`/user-progress/${id}`, 'GET');
};

export const createUserProgress = async (userProgressData: createUserProgressDto): Promise<UserProgress> => {
  return apiRequest<UserProgress>('/user-progress', 'POST', userProgressData, true);
};

export const fetchUserProgressByUserId = async (userId: string): Promise<UserProgress[]> => {
  return apiRequest<UserProgress[]>(`/user-progress/user/${userId}`, 'GET');
}

export const getUserTopicsLevel = async (userId: string, topicId: string): Promise<number> => {
  return apiRequest<number>(`/user-progress//topics-level/${userId}/${topicId}`, 'GET');
} 
