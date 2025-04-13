import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const materialTheme = createTheme({
  palette: {
    primary: {
      main: '#E04B00',
      light: '#FF784D',
      dark: '#B33D00',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#3182CE',
      light: '#63B3ED',
      dark: '#2C5282',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F7FAFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A202C',
      secondary: '#4A5568',
    },
    error: {
      main: '#E53E3E',
    },
    warning: {
      main: '#DD6B20',
    },
    info: {
      main: '#3182CE',
    },
    success: {
      main: '#38A169',
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif', 
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '0.375rem',
          fontFamily: 'Poppins, sans-serif', 
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '0.375rem',
            fontFamily: 'Poppins, sans-serif', 
          },
          '& .MuiFormHelperText-root.Mui-error': {
            color: '#E53E3E',
            fontSize: '0.75rem',
            marginTop: '0.25rem',
            lineHeight: 1.2,
            fontFamily: 'Poppins, sans-serif', 
          },
        },
      },
    },
  },
});

interface ThemeAdapterProps {
  children: React.ReactNode;
}

const ThemeAdapter: React.FC<ThemeAdapterProps> = ({ children }) => {
  return <ThemeProvider theme={materialTheme}>{children}</ThemeProvider>;
};

export default ThemeAdapter;
