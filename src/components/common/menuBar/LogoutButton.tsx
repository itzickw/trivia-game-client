import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../supabaseClient";
import { IconButton, Tooltip } from "@mui/material";

const  LogoutButton = () => {
    const navigate = useNavigate();
    
    const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/'); // redirect to login
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

    return (
        <Tooltip title="התנתק">
        <IconButton onClick={handleLogout} color="error">
          <LogoutIcon />
        </IconButton>
      </Tooltip>
    );
}

export default LogoutButton;