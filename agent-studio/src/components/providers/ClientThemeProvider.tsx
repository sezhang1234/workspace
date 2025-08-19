'use client';

import { ReactNode } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

type ClientThemeProviderProps = {
  children: ReactNode;
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#fafafa',
    },
  },
  shape: { borderRadius: 10 },
});

export default function ClientThemeProvider({ children }: ClientThemeProviderProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

