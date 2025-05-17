import { LoadingWithMessage } from '@/components/common/LoadingWithMessage';
import { useAuthContext } from '@/contexts/authContext';
import { HomePage } from '@/pages/home/HomePage';
import { LoginPage } from '@/pages/login/LoginPage';
import { TodoDetailPage } from '@/pages/todo/[id]';
import { TodoPage } from '@/pages/todo/TodoPage';
import { AuthenticatedOutlet } from '@/outlet/AuthenticatedOutlet';
import { UnauthenticatedOutlet } from '@/outlet/UnauthenticatedOutlet';
import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

export const Router: React.FC = () => {
  const { status } = useAuthContext();

  if (status === 'unverified') {
    return <LoadingWithMessage message="ユーザ認証を実施しています..." />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* 誰でも閲覧できるルーティング */}
        <Route path="/" element={<HomePage />} />

        <Route element={<AuthenticatedOutlet />}>
          {/* ログイン済みのルーティング */}
          <Route path="/todo/:id" element={<TodoDetailPage />} />
          <Route path="/todo" element={<TodoPage />} />
        </Route>

        <Route element={<UnauthenticatedOutlet />}>
          {/* 未ログインのルーティング */}
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};
