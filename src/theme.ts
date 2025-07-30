import { createTheme } from "@mui/material";


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFC107',
    },
    secondary: {
      main: '#607D8B',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#E0E0E0',
      secondary: '#B0B0B0',
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#FFC107',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            color: '#FFC107',
          },
        },
      },
    },
  },
});

export default darkTheme;