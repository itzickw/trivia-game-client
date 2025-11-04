// src/components/quiz/question/SubmitButton.tsx
import { Button } from "@mui/material";

interface SubmitButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export default function SubmitButton({ onClick, disabled = false }: SubmitButtonProps) {
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={onClick}
      disabled={disabled}
      sx={{
        textTransform: "none",
        marginTop: 2,
      }}
    >
      הגש תשובה
    </Button>
  );
}
