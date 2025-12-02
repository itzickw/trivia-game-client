// src/components/dashboard/levelSelector/LevelEditorContainer.tsx

import { useEffect, useState, useCallback } from 'react';
import { fetchAllLevels, type Level } from '../../api/levels'; // 👈 ודא שיש לך את הפונקציה הזו
import { CircularProgress, Box, Alert } from '@mui/material';

// נשתמש בקומפוננטת התצוגה הקיימת (LevelSelector) אבל נצטרך להתאים את ה-Props
import LevelSelectorView from '../quiz/levelSelector/LevelSelectorView'; 

// מאחר ש-LevelSelectorView מצפה לממשק ספציפי (LevelWithQuestions), 
// // נייצר ממשק דמה שיכיל את כל השדות הדרושים לתצוגה, אבל ללא לוגיקת שאלות/נעילה.
// interface LevelForEditor extends Level {
//     // השדות הללו אינם רלוונטיים לעריכה, אבל LevelSelectorView מצפה להם במקור.
//     // אם LevelSelectorView דורש את השדה 'questions', נוכל להשמיט את הייבוא שלו.
// }

interface Props {
    onLevelSelect: (levelNumber: number) => void;
    selectedLevelNumber: number | null; // נוסיף את זה כדי שהרמה הנבחרת תודגש
}

export default function LevelEditorContainer({ onLevelSelect, selectedLevelNumber }: Props) {
    
    // נשתמש ב-Level במקום LevelWithQuestions
    const [levels, setLevels] = useState<Level[]>([]); 
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        const loadLevels = async () => {
            try {
                const fetchedLevels = await fetchAllLevels(); // 🚨 קורא את כל הרמות
                
                if (isMounted) {
                    // ממיין לפי מספר הרמה
                    const sortedLevels = fetchedLevels.sort((a, b) => a.level_number - b.level_number);
                    setLevels(sortedLevels);
                }
            } catch (err: any) {
                if (isMounted) {
                    console.error('Error fetching all levels:', err);
                    setError('שגיאה בטעינת הרמות לעריכה.');
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };
        
        loadLevels();
        return () => { isMounted = false; };
    }, []);

    const handleSelect = useCallback((levelNumber: string) => {
        const num = parseInt(levelNumber);
        onLevelSelect(num); // 👈 מודיע לדף הראשי
    }, [onLevelSelect]);


    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <CircularProgress size={24} />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }
    
    // 🚨 נקודה קריטית: אנו משתמשים כאן ב-LevelSelectorView המקורי.
    // מכיוון שהוא מצפה ל-maxUserLevel ולוגיקת נעילה/פתיחה, 
    // אנו נאלצים להעביר לו ערכים "דמה" שישביתו את לוגיקת הנעילה.
    
    // ניצור מערך LevelWithQuestions (כדי להתאים ל-View)
    const levelsForView = levels.map(level => ({
        ...level,
        // הוספת השדות החסרים כדי להתאים לממשק LevelWithQuestions של LevelSelectorView
        questions: [] as any, 
        is_completed: false, 
    }));


    return (
        <LevelSelectorView
            levels={levelsForView as any} // מעבירים את הרמות ה"משופרות"
            selectedLevel={selectedLevelNumber || 0}
            maxUserLevel={1000} // 👈 טריק: נותן ערך גבוה כדי לפתוח את כל הרמות
            onLevelSelect={handleSelect}
        />
    );
}