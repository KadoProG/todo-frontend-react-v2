import '@/index.css';
import '@/index.scss';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { SnackbarProvider } from '@/components/Feedback/Snackbar/SnackbarProvider';
import { AuthProvider } from '@/contexts/auth/AuthProvider';
import { ThemeProvider } from '@/contexts/Theme/ThemeProvider';
import { Router } from '@/router';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
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
