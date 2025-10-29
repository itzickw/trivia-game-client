import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";

const DashboardButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate('/dashboard')}
      startIcon={<DashboardIcon />}
      sx={{
        color: 'primary.main',
        textTransform: 'none',
        border: '1px solid rgba(255, 193, 7, 0.4)',
        borderRadius: '12px',
        backdropFilter: 'blur(4px)',
        px: 2.5,
        py: 1,
        '&:hover': {
          backgroundColor: 'rgba(255, 193, 7, 0.1)',
          borderColor: 'primary.main',
        },
        transition: 'all 0.2s ease',
      }}
    >
        תפריט ראשי
    </Button>
  );
};

export default DashboardButton;
