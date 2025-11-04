import { useState, useEffect } from "react";
import type { QuizQuestion } from "../../../api/quiz";
import QuestionText from "./QuestionText";
import MultipleChoiceQuestionAnswers from "./MultipleChoiceQuestionAnswers";
import OpenQuestionAnswer from "./OpenQuestionAnswer";
import SubmitButton from "./SubmitButton";
import { shuffleAnswers } from "./shuffleAnswers";
import { Snackbar, Alert } from "@mui/material";

interface QuestionContainerProps {
    question: QuizQuestion;
    levlColor?: string;
    onCorrectAnswer: (questionId: string) => void;
}

export default function QuestionContainer({
    question,
    levlColor,
    onCorrectAnswer,
}: QuestionContainerProps) {
    const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);
    const [userAnswer, setUserAnswer] = useState<string | null>(null);
    const [isAnsweredCorrectly, setIsAnsweredCorrectly] = useState<boolean>(
        question.answered
    );
    const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
    const [showMessage, setShowMessage] = useState<boolean>(false);

    useEffect(() => {
        if (question.question_type === "multiple_choice") {
            const allAnswers = [
                question.answer_text,
                ...question.answers.map((a) => a.text),
            ];
            setShuffledAnswers(shuffleAnswers(allAnswers));
        }
    }, [question]);

    const handleSubmitAnswer = () => {
        if (!userAnswer || question.answered) return;

        if (userAnswer === question.answer_text) {
            setIsAnsweredCorrectly(true);
            setFeedback("correct");
            onCorrectAnswer(question.id);
        } else {
            setFeedback("wrong");
        }
        setUserAnswer(null);

        setShowMessage(true); // הצגת Snackbar
    };

    return (
        <div
            style={{
                padding: 20,
                borderRadius: 8,
                minHeight: 200,
                width: "auto",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                background: levlColor
                    ? `linear-gradient(90deg, ${levlColor})`
                    : "#f9f9f9",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                margin: "20px auto",
            }}
        >
            <QuestionText text={question.text} />

            {question.question_type === "multiple_choice" ? (
                <MultipleChoiceQuestionAnswers
                    answers={shuffledAnswers}
                    selectedAnswer={userAnswer}
                    onSelectAnswer={setUserAnswer}
                />
            ) : (
                <OpenQuestionAnswer
                    answered={question.answered}
                    correctAnswer={question.answer_text}
                    selectedAnswer={userAnswer}
                    onSelectAnswer={setUserAnswer}
                    feedback={feedback}
                />
            )}

            <SubmitButton
                onClick={handleSubmitAnswer}
                disabled={!userAnswer || question.answered}
            />

            <Snackbar
                open={showMessage}
                autoHideDuration={1500}
                onClose={() => setShowMessage(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    severity={feedback === "correct" ? "success" : "error"}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {feedback === "correct"
                        ? "תשובה נכונה! 🎉"
                        : "תשובה שגויה. נסה שוב ❌"}
                </Alert>
            </Snackbar>
        </div>
    );
}
