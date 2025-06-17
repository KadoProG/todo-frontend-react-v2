import { AuthContext } from '@/contexts/auth';
import React, { useContext } from 'react';
import { Navigate, Outlet, RouteProps } from 'react-router-dom';

/**
 * ログインしていない場合のルーティングのためのコンポーネント
 */
export const UnauthenticatedOutlet: React.FC<RouteProps> = () => {
  const { status } = useContext(AuthContext);

  if (status === 'unAuthenticated') {
    return <Outlet />;
  }
  return <Navigate to="/" state={{ permanent: false }} />;
};
