import { LoadingWithMessage } from '@/components/common/LoadingWithMessage';
import { HomePage } from '@/pages/home/HomePage';
import { LoginPage } from '@/pages/login/LoginPage';
import { RegisterPage } from '@/pages/register/RegisterPage';
import { TodoDetailPage } from '@/pages/todo/[id]';
import { AuthenticatedOutlet } from '@/outlet/AuthenticatedOutlet';
import { UnauthenticatedOutlet } from '@/outlet/UnauthenticatedOutlet';
import React, { useContext } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { TodoPage } from '@/pages/todo';
import { NotificationPage } from '@/pages/notifications';
import { AuthContext } from '@/contexts/auth';

export const Router: React.FC = () => {
  const { status } = useContext(AuthContext);

  if (status === 'pending') {
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
          <Route path="/notifications" element={<NotificationPage />} />
        </Route>

        <Route element={<UnauthenticatedOutlet />}>
          {/* 未ログインのルーティング */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};
