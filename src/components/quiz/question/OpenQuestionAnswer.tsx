// src/components/quiz/question/OpenQuestionAnswer.tsx
import { useEffect } from "react";
import { TextField } from "@mui/material";

interface OpenQuestionAnswerProps {
    answered: boolean;          // האם השאלה כבר נענתה נכון
    correctAnswer: string;      // התשובה הנכונה (אם כבר נענתה)
    selectedAnswer: string | null; // התשובה שהמשתמש הזין
    onSelectAnswer: (answer: string) => void;  // callback להחזרת התשובה
    feedback?: "correct" | "wrong" | null;
}

export default function OpenQuestionAnswer({
    answered,
    correctAnswer,
    selectedAnswer,
    onSelectAnswer,
    feedback
}: OpenQuestionAnswerProps) {

    useEffect(() => {
        onSelectAnswer(selectedAnswer || "");
    }, [selectedAnswer]);

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            backgroundColor:
                feedback === "correct"
                    ? "#4caf50"
                    : feedback === "wrong"
                        ? "#f44336"
                        : "#fff",
            color: feedback ? "#fff" : "#000",
        }}>
            <TextField
                label={!answered? "תשובתך" : "הסתיים"}
                variant="outlined"
                value={answered? "התשובה הנכונה: " + correctAnswer : selectedAnswer}
                onChange={(e) => onSelectAnswer(e.target.value)}
                disabled={answered}
            />
        </div>
    );
}
