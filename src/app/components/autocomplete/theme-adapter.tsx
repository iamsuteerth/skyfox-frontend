import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const ThemeAdapter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const materialTheme = createTheme({
    typography: {
      fontFamily: 'var(--font-poppins), sans-serif',
    },
    palette: {
      primary: {
        main: '#E04B00', 
      },
      error: {
        main: '#D42158',
      },
      text: {
        primary: '#161A1E',
        secondary: '#404348',
      },
    },
    components: {
      MuiAutocomplete: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: '0.75rem', 
              borderColor: '#D8DADC', 
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#D8DADC',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#5C6063',
            },
            '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#E04B00', 
              borderWidth: '2px',
            },
          },
          input: {
            padding: '10px 14px',
            fontSize: '1rem',
            color: '#161A1E',
          },
          endAdornment: {
            top: 'calc(50% - 10px)',
            right: '8px',
            '& .MuiButtonBase-root': {
              padding: '4px',
            },
            '& .MuiSvgIcon-root': {
              fontSize: '1.25rem',
            },
          },
          popupIndicator: {
            color: '#5C6063', 
          },
          paper: {
            backgroundColor: '#FFFFFF',
            boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
            borderRadius: '0.5rem',
            fontFamily: 'var(--font-poppins), sans-serif',
            zIndex: 1500,
          },
          listbox: {
            padding: '8px 0',
            '& .MuiAutocomplete-option': {
              padding: '8px 16px',
              minHeight: '48px',
            },
          },
          option: {
            '&[aria-selected="true"]': {
              backgroundColor: 'rgba(224, 75, 0, 0.1) !important',
            },
            '&[data-focus="true"]': {
              backgroundColor: 'rgba(224, 75, 0, 0.2) !important',
              color: '#161A1E',
            },
            '&:hover': {
              backgroundColor: 'rgba(224, 75, 0, 0.1) !important',
            },
          },
          noOptions: {
            color: '#666A6D', 
            padding: '12px 16px',
          },
          clearIndicator: {
            color: '#5C6063', 
            '&:hover': {
              backgroundColor: 'rgba(224, 75, 0, 0.1)',
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: '#FFFFFF',
            fontSize: '1rem',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#5C6063', 
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#E04B00', 
              borderWidth: '2px',
            },
          },
          notchedOutline: {
            borderColor: '#D8DADC',
          },
          input: {
            padding: '14px 16px', 
            height: 'auto',
            '&::placeholder': {
              color: '#8E9091',
              opacity: 1,
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
        },
      },
    },
  });

  return <ThemeProvider theme={materialTheme}>{children}</ThemeProvider>;
};

export default ThemeAdapter;
