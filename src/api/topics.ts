// src/api/topics.ts
import apiRequest from './index';

export interface Topic {
  id: string;
  name: string;
  owner_id: string;
  created_at?: string; // חדש: כפי שמופיע ב-GET של שאלה
  updated_at?: string; // חדש: כפי שמופיע ב-GET של שאלה
}

export interface CreateTopicDto {
  name: string;
  owner_id: string;
}

export interface UpdateTopicDto {
  name?: string;
  owner_id?: string;
  description?: string;
}

export const fetchAllTopics = async (): Promise<Topic[]> => {
  return apiRequest<Topic[]>('/topics', 'GET');
};

export const fetchTopicById = async (id: string): Promise<Topic> => {
  return apiRequest<Topic>(`/topics/${id}`, 'GET');
};

export const fetchTopicByName = async (topicName: string): Promise<Topic> => {
  return apiRequest<Topic>(`/topics/topic-name/${topicName}`, 'GET');
};

export const createTopic = async (topicData: CreateTopicDto): Promise<Topic> => {
  return apiRequest<Topic>('/topics', 'POST', topicData, true);
};

export const updateTopic = async (id: string, topicData: UpdateTopicDto): Promise<Topic> => {
  return apiRequest<Topic>(`/topics/${id}`, 'PATCH', topicData, true);
};

export const deleteTopic = async (id: string): Promise<void> => {
  return apiRequest<void>(`/topics/${id}`, 'DELETE', undefined, true);
};