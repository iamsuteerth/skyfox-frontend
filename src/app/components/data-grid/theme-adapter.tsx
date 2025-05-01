'use client'

import React from 'react';

import { ThemeProvider, createTheme } from '@mui/material/styles';

const muiTheme = createTheme({
  palette: {
    primary: { main: '#E04B00' },
    secondary: { main: '#FFB199' },
    success: { main: '#228B22' },
    error: { main: '#D42158' },
    info: { main: '#6495ED' },
    background: {
      default: '#FFFFFF', paper: '#F0F0F5',
    },
    text: { primary: '#161A1E', secondary: '#404348' },
  },
  typography: {
    fontFamily: 'var(--font-poppins), Poppins, system-ui, sans-serif',
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
  shape: { borderRadius: 16 },
});

export default function ThemeAdapter({ children }: { children: React.ReactNode }) {
  return <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>;
}
