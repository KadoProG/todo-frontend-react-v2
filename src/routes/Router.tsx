import { LoadingWithMessage } from '@/components/common/LoadingWithMessage';
import { useAuthContext } from '@/contexts/authContext';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { AuthenticatedOutlet } from '@/routes/outlet/AuthenticatedOutlet';
import { UnauthenticatedOutlet } from '@/routes/outlet/UnauthenticatedOutlet';
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
        {/* 誰でも閲覧できるルーティング */}
        <Route path="/" element={<HomePage />} />

        <Route element={<AuthenticatedOutlet />}>{/* ログイン済みのルーティング */}</Route>

        <Route element={<UnauthenticatedOutlet />}>
          {/* 未ログインのルーティング */}
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};
