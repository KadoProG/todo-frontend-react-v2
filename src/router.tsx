import type { FC } from 'react';
import { useContext } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { LoadingWithMessage } from '@/components/common/LoadingWithMessage';
import { AuthContext } from '@/contexts/auth';
import { AuthenticatedOutlet } from '@/outlet/AuthenticatedOutlet';
import { UnauthenticatedOutlet } from '@/outlet/UnauthenticatedOutlet';
import { HomePage } from '@/pages/home/HomePage';
import { LoginPage } from '@/pages/login/LoginPage';
import { NotificationPage } from '@/pages/notifications';
import { ProfilePage } from '@/pages/profile';
import { RegisterPage } from '@/pages/register/RegisterPage';
import { TodoPage } from '@/pages/todo';
import { TodoDetailPage } from '@/pages/todo/[id]';

export const Router: FC = () => {
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
          <Route path="/profile" element={<ProfilePage />} />
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
