// src/api/index.ts
import { supabase } from '../supabaseClient'; // מייבאים את הקליינט של Supabase

const API_BASE_URL = 'https://share-trivia-backend.onrender.com'; // ה-URL הבסיסי של השרת הלוקאלי שלך

// פונקציה כללית לביצוע בקשות API
async function apiRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  data?: any, // נתונים עבור POST/PUT/PATCH
  requiresAuth: boolean = false // האם הבקשה דורשת אימות JWT
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (requiresAuth) {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.access_token) {
      // אם אין סשן או טוקן, זרוק שגיאה
      throw new Error('Authentication required: No valid session token found.');
    }
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }

  const config: RequestInit = {
    method: method,
    headers: headers,
  };

  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, config);

    if (response.status === 204) { // No Content for DELETE
      return {} as T; // Return empty object for 204 responses
    }

    const responseData = await response.json();

    if (!response.ok) {
      // אם התשובה היא לא 2xx, זרוק שגיאה עם הודעת השרת
      const errorMessage = responseData.message || `HTTP error! status: ${response.status}`;
      throw new Error(errorMessage);
    }

    return responseData as T;
  } catch (error) {
    console.error(`API Request failed (${method} ${endpoint}):`, error);
    throw error;
  }
}

export default apiRequest;