// src/components/quiz/questionProgressBar/QuestionProgressBar.tsx
import { Box, Tooltip } from "@mui/material";
import { motion } from "framer-motion";

interface QuestionProgressBarProps {
  questions: { id: string; answered: boolean }[];
  selectedQuestionId: string | null;
  onSelectQuestion: (questionId: string) => void;
}

export default function QuestionProgressBar({
  questions,
  selectedQuestionId,
  onSelectQuestion,
}: QuestionProgressBarProps) {
  return (
    <Box
      display="flex"
      justifyContent="center"
      sx={{
        mt: 1,
        mb: 2,
        width: "100%",
      }}
    >
      <Box
        display="flex"
        width="60%"
        bgcolor="#e0e0e0"
        borderRadius="10px"
        overflow="hidden"
        boxShadow="inset 0 0 5px rgba(0,0,0,0.2)"
      >
        {questions.map((q) => {
          const isSelected = q.id === selectedQuestionId;
          const backgroundColor = q.answered
            ? "#4caf50" // ירוק - נענה
            : isSelected
            ? "#FFC107" // צהוב - שאלה נבחרת
            : "#f5f5f5"; // אפור בהיר - לא נענה

          return (
            <Tooltip
              key={q.id}
              title={q.answered ? "נענה ✅" : "לא נענה ❌"}
              arrow
            >
              <motion.div
                whileHover={{ scaleY: 1.2 }}
                whileTap={{ scaleY: 0.9 }}
                style={{
                  flex: 1,
                  height: "10px",
                  backgroundColor,
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                  borderRight:
                    q.id !== questions[questions.length - 1].id
                      ? "1.5px solid #151313ff"
                      : "none",
                }}
                onClick={() => onSelectQuestion(q.id)}
              />
            </Tooltip>
          );
        })}
      </Box>
    </Box>
  );
}
