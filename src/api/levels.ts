// src/api/levels.ts
import apiRequest from './index';

export interface Level {
  id: string;
  level_number: number;
  name: string;
  color?: string;
  created_at?: string; // חדש: כפי שמופיע ב-GET של שאלה
  updated_at?: string; // חדש: כפי שמופיע ב-GET של שאלה
}

export interface CreateLevelDto {
  level_number: number;
  name: string;
  color?: string;
}

export interface UpdateLevelDto {
  level_number?: number;
  name?: string;
  color?: string;
}

export const fetchAllLevels = async (): Promise<Level[]> => {
  return apiRequest<Level[]>('/levels', 'GET');
};

export const fetchLevelById = async (id: string): Promise<Level> => {
  return apiRequest<Level>(`/levels/${id}`, 'GET');
};

export const fetchLevelByNumber = async (levelNumber: number): Promise<Level> => {
  return apiRequest<Level>(`/levels/level-number/${levelNumber}`, 'GET');
};

export const fetchLevelByName = async (name: string): Promise<Level> => {
  return apiRequest<Level>(`/levels/name/${name}`, 'GET');
};

export const createLevel = async (levelData: CreateLevelDto): Promise<Level> => {
  return apiRequest<Level>('/levels', 'POST', levelData, true);
};

export const updateLevel = async (id: string, levelData: UpdateLevelDto): Promise<Level> => {
  return apiRequest<Level>(`/levels/${id}`, 'PATCH', levelData, true);
};

export const deleteLevel = async (id: string): Promise<void> => {
  return apiRequest<void>(`/levels/${id}`, 'DELETE', undefined, true);
};