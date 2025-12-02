// src/components/dashboard/EditTopicPage.tsx

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { fetchQuestionsByTopicId, type Question } from "../../api/questions";
import { CircularProgress, Container, Typography, Box, Alert } from '@mui/material'; 

// ייבוא הקומפוננטה של בחירת השלב
import LevelEditorContainer from "./LevelEditorContainer";
import MenuBar from "../common/menuBar/MenuBar";
import useAuth from "../../hooks/useAuth";

const EditTopicPage: React.FC = () => {
    const { user } = useAuth();
    const userName = user?.user_metadata?.full_name || user?.email || '';
    const { topicId } = useParams<{ topicId: string }>();
    
    // 1. מצב (State) לטעינת נתונים
    // כל השאלות של הנושא נשמרות כאן
    const [allQuestions, setAllQuestions] = useState<Question[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 2. מצב (State) לרמה הנבחרת
    // הערך Null מציין שעדיין לא נבחרה רמה (או 'כל הרמות')
    const [selectedLevelNumber, setSelectedLevelNumber] = useState<number | null>(null);


    // 3. לוגיקה לטעינת כל שאלות הנושא (אסינכרוני + טיפול ב-301)
    useEffect(() => {
        let isMounted = true; 
        
        const loadAllTopicQuestions = async () => {
            if (!topicId) {
                setError("Topic ID is missing.");
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                // 🚨 קריאה ל-API
                const fetchedQuestions = await fetchQuestionsByTopicId(topicId);
                
                // ✅ בדיקה לפני עדכון המצב
                if (isMounted) {
                    setAllQuestions(fetchedQuestions as Question[]);
                }
            } catch (err: any) {
                if (isMounted) {
                    setError("שגיאה בטעינת שאלות הנושא: " + err.message);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadAllTopicQuestions();

        return () => {
            isMounted = false; // ניקוי (Cleanup)
        };
    }, [topicId]);

    // 4. Handler: פונקציה המועברת לקומפוננטת הבת כדי שתחזיר את הרמה הנבחרת
    const handleLevelSelect = useCallback((levelNumber: number) => {
        // המשתמש בחר רמה - מעדכנים את המצב
        setSelectedLevelNumber(levelNumber);
        console.log(`Level selected: ${levelNumber}`); 
    }, []);
    
    // הצגת טעינה או שגיאה
    if (isLoading) {
        return (
            <Container component="main" maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>טוען את כל שאלות הנושא...</Typography>
            </Container>
        );
    }

    if (error) {
         return <Alert severity="error">{error}</Alert>;
    }


    // 5. רנדור הקומפוננטה
    return (
        <Container component="main" maxWidth="lg">
            <MenuBar userName={userName} />
            <Typography variant="h3" sx={{ my: 4 }}>עריכת נושא</Typography>
            
            {/* רכיב 1: בחירת רמה */}
            <LevelEditorContainer 
                onLevelSelect={handleLevelSelect} 
                selectedLevelNumber={selectedLevelNumber}
                // הערה: נצטרך לוודא ש-LevelSelectorContainer יודע להציג את הרמה הנבחרת הנוכחית (selectedLevelNumber)
                // ו/או להתחיל בטעינת הרמות כפי שנדרש.
            />

            <Box sx={{ mt: 4 }}>
                <Typography variant="body1">
                    **מצב נוכחי:**
                </Typography>
                <Typography variant="body2">
                    שאלות שנטענו סך הכל: **{allQuestions.length}**
                </Typography>
                <Typography variant="body2">
                    רמה נבחרה: **{selectedLevelNumber === null ? 'טרם נבחרה' : selectedLevelNumber}**
                </Typography>
                
                {/* 🚨 כאן יגיעו הקומפוננטות הבאות (כמו QuestionsDisplayComponent) */}
            </Box>
        </Container>
    );
}

export default EditTopicPage;