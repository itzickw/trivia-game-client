// src/components/quiz/question/utils/shuffleAnswers.ts

/**
 * מערבב מערך בצורה אקראית ומחזיר עותק חדש.
 * האלגוריתם: Fisher–Yates shuffle
 * @param array מערך המקורי
 * @returns מערך חדש בערבוב אקראי
 */
export function shuffleAnswers<T>(array: T[]): T[] {
  const result = [...array]; // יוצרים עותק חדש כדי לא לשנות את המקורי
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
