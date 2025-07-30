export interface Answer {
  id: string;
  text: string;
  created_at: string; // Assuming ISO date string
  updated_at: string; // Assuming ISO date string
  // question_id לא נראה באובייקט ה-Answer שחוזר מה-GET של שאלה
  // אבל אם הוא קיים ב-DTOs, נוכל להוסיף אותו כאן
}