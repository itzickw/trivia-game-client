// src/components/quiz/question/MultipleChoiceQuestionAnswers.tsx
import { RadioGroup, FormControlLabel, Radio, FormControl } from "@mui/material";

interface MultipleChoiceQuestionAnswersProps {
  answers: string[];
  selectedAnswer: string | null;
  onSelectAnswer: (answer: string) => void;
}

export default function MultipleChoiceQuestionAnswers({
  answers,
  selectedAnswer,
  onSelectAnswer,
}: MultipleChoiceQuestionAnswersProps) {
  return (
    <FormControl component="fieldset">
      <RadioGroup
        value={selectedAnswer || ""}
        onChange={(e) => onSelectAnswer(e.target.value)}
      >
        {answers.map((ans) => (
          <FormControlLabel
            key={ans}
            value={ans}
            control={<Radio />}
            label={ans}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
