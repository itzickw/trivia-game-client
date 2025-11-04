import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchQuizDataForUser } from "../api/quiz";
import QuizPage from "./QuizPage";
import { supabase } from "../supabaseClient";
import type { QuizData } from "../api/quiz";

export default function QuizLoader() {
  const { topicId } = useParams<{ topicId: string }>();
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQuiz() {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) return;

      const data = await fetchQuizDataForUser(user.user.id, topicId!);
      setQuizData(data);
      setLoading(false);
    }

    loadQuiz();
  }, [topicId]);

  if (loading) return <div style={{ padding: 20 }}>טוען חידון...</div>;

  if (!quizData) return <div>לא נמצאו נתונים עבור נושא זה.</div>;

  return <QuizPage initialQuizData={quizData} />;
}
