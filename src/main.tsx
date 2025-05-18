import '@/index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/index.scss';
import { SnackbarContextProvider } from '@/components/common/feedback/SnackbarContextProvider';
import { AuthContextProvider } from '@/contexts/AuthContextProvider';
import { Router } from '@/router';
import { ThemeContextProvider } from '@/contexts/Theme/ThemeProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeContextProvider>
      <SnackbarContextProvider>
        <AuthContextProvider>
          <Router />
        </AuthContextProvider>
      </SnackbarContextProvider>
    </ThemeContextProvider>
  </StrictMode>
);
