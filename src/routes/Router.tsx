import { LoadingWithMessage } from '@/components/common/LoadingWithMessage';
import { useAuthContext } from '@/contexts/authContext';
import { HomePage } from '@/pages/HomePage';
import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

export const MyRouter: React.FC = () => {
  const { status } = useAuthContext();

  if (status === 'unverified') {
    return <LoadingWithMessage message="ユーザ認証を実施しています..." />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};
