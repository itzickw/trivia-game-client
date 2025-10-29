import { createTheme } from "@mui/material";

declare module '@mui/material/styles' {
  interface TypeBackground {
    sidebar?: string;
    surface?: string;
    card?: string;
    header?: string;
    footer?: string;
  }
}

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFC107', // Warm yellow accent
    },
    secondary: {
      main: '#90A4AE', // Softer blue-gray
    },
    background: {
      default: '#46c1b9ff', // Slightly lighter than pure black
      paper: '#2A2A2A',   // Used for dialogs, cards, etc.
      sidebar: '#242424', // Side panels, menus
      surface: '#2E2E2E', // General surface containers
      card: '#333333',    // Individual cards
      header: '#202020',  // Top bar / app bar
      footer: '#232323',  // Footer background
    },
    text: {
      primary: '#F5F5F5',   // Bright but not pure white
      secondary: '#CFCFCF', // Softer secondary text
      dark: '#121010ff',  // Disabled text
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
          backgroundColor: '#2E2E2E',
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
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default darkTheme;
