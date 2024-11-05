import { useAuthContext } from '@/contexts/authContext';
import React from 'react';
import { Navigate, Outlet, RouteProps } from 'react-router-dom';

/**
 * ログインしていない場合のルーティングのためのコンポーネント
 */
export const UnauthenticatedOutlet: React.FC<RouteProps> = () => {
  const { status } = useAuthContext();

  if (status === 'unauthenticated') {
    return <Outlet />;
  }
  return <Navigate to="/" state={{ permanent: false }} />;
};
