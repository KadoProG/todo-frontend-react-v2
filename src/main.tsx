import '@/index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/index.scss';
import { SnackbarContextProvider } from '@/components/common/feedback/SnackbarContextProvider';
import { AuthContextProvider } from '@/contexts/AuthContextProvider';
import { Router } from '@/router';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SnackbarContextProvider>
      <AuthContextProvider>
        <Router />
      </AuthContextProvider>
    </SnackbarContextProvider>
  </StrictMode>
);
