import '@/index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/index.scss';
import { Router } from '@/router';
import { ThemeProvider } from '@/contexts/Theme/ThemeProvider';
import { SnackbarProvider } from '@/components/Feedback/Snackbar/SnackbarProvider';
import { AuthProvider } from '@/contexts/auth/AuthProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <SnackbarProvider>
        <AuthProvider>
          <Router />
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  </StrictMode>
);
