import type { FC } from 'react';
import { useContext } from 'react';
import { Navigate, Outlet, type RouteProps } from 'react-router-dom';

import { AuthContext } from '@/contexts/auth';

/**
 * ログインしていない場合のルーティングのためのコンポーネント
 */
export const UnauthenticatedOutlet: FC<RouteProps> = () => {
  const { status } = useContext(AuthContext);

  if (status === 'unAuthenticated') {
    return <Outlet />;
  }
  return <Navigate to="/" state={{ permanent: false }} />;
};
