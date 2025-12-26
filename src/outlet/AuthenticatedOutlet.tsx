import React, { useContext } from 'react';
import { Navigate, Outlet, RouteProps } from 'react-router-dom';

import { AuthContext } from '@/contexts/auth';

/**
 * ログイン済みの場合のルーティングのためのコンポーネント
 */
export const AuthenticatedOutlet: React.FC<RouteProps> = () => {
  const { status } = useContext(AuthContext);

  if (status === 'authenticated') {
    return <Outlet />;
  }
  return <Navigate to="/" state={{ permanent: false }} />;
};
