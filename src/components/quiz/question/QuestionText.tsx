// src/components/quiz/question/QuestionText.tsx
import { Typography, Box } from "@mui/material";

interface QuestionTextProps {
  text: string;
}

export default function QuestionText({ text }: QuestionTextProps) {
  return (
    <Box mb={2}>
      <Typography
        variant="h4"
        component="h2"
        sx={{
          fontWeight: 800,
          color: "text.dark",
          lineHeight: 1.4,
        }}
      >
        {text}
      </Typography>
    </Box>
  );
}
