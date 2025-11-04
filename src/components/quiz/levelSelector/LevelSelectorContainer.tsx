import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import { fetchQuizDataForUser, type LevelWithQuestions } from '../../../api/quiz';
import LevelSelector from './LevelSelectorView';

interface Props {
  onLevelSelect: (levelNumber: number) => void;
}

export default function LevelSelectorContainer({ onLevelSelect }: Props) {
  const { user } = useAuth();
  const { topicId } = useParams<{ topicId: string }>();
  const [levels, setLevels] = useState<LevelWithQuestions[]>([]);
  const [maxUserLevel, setMaxUserLevel] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState<number>(0);

  useEffect(() => {
    if (!user?.id || !topicId) return;

    (async () => {
      try {
        const quizData = await fetchQuizDataForUser(user.id, topicId);
        const sortedLevels = Object.values(quizData.levels)
        .filter(level => level.questions && level.questions.length > 0)
        .sort(
          (a, b) => a.level_number - b.level_number
        );
        setLevels(sortedLevels);
        setMaxUserLevel(quizData.maxUserLevel);
      } catch (error) {
        console.error('Error fetching quiz data:', error);
      }
    })();
  }, [user?.id, topicId]);

  const handleLevelSelect = (levelNumber: string) => {
    const num = parseInt(levelNumber);
    setSelectedLevel(num);
    onLevelSelect(num); // 👈 מודיע לדף הראשי
  };

  return (
    <LevelSelector
      levels={levels}
      selectedLevel={selectedLevel}
      maxUserLevel={maxUserLevel}
      onLevelSelect={handleLevelSelect}
    />
  );
}
