import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

import { apiClient } from '@/lib/apiClient';
import { components } from '@/lib/apiClient/types/schema';
import { store } from '@/lib/store';

import { AuthContext } from '.';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<'pending' | 'unAuthenticated' | 'authenticated' | 'error'>(
    'pending'
  );
  const [user, setUser] = useState<components['schemas']['UserResource'] | null>(null);

  useEffect(() => {
    if (status !== 'pending') return;

    const controller = new AbortController();
    apiClient
      .GET('/v1/users/me', {
        signal: controller.signal,
      })
      .then((res) => {
        if (!res.response.ok) {
          if (res.response.status === 401) {
            setStatus('unAuthenticated');
            setUser(null);
            return;
          }
          throw new Error('予期せぬfetchエラー');
        }
        if (!res.data?.user) {
          throw new Error('予期せぬレスポンスエラー');
        }
        setStatus('authenticated');
        setUser(res.data.user);
      })
      .catch((e) => {
        if (e.name === 'AbortError') {
          // Fetch が中断された（StrictMode等での再マウント時）
          return;
        }

        console.error(e);
        setStatus('error');
        setUser(null);
        return;
      });

    return () => {
      controller.abort();
    };
  }, [status]);

  const mutate = useCallback(() => setStatus('pending'), []);
  const logout = useCallback(() => {
    store.remove('token');
    mutate();
  }, [mutate]);

  const value = useMemo(
    () => ({
      status,
      user,
      mutate,
      logout,
    }),
    [status, user, mutate, logout]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
