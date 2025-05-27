import '@/index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/index.scss';
import { AuthContextProvider } from '@/contexts/AuthContextProvider';
import { Router } from '@/router';
import { ThemeContextProvider } from '@/contexts/Theme/ThemeProvider';
import { SnackbarProvider } from '@/components/Feedback/Snackbar/SnackbarProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeContextProvider>
      <SnackbarProvider>
        <AuthContextProvider>
          <Router />
        </AuthContextProvider>
      </SnackbarProvider>
    </ThemeContextProvider>
  </StrictMode>
);
