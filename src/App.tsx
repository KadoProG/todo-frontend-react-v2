import { SnackbarContextProvider } from '@/components/common/feedback/SnackbarContextProvider';
import { AuthContextProvider } from '@/contexts/AuthContextProvider';
import { MyRouter } from '@/routes/Router';
import React from 'react';

export const App: React.FC = () => (
  <SnackbarContextProvider>
    <AuthContextProvider>
      <MyRouter />
    </AuthContextProvider>
  </SnackbarContextProvider>
);
