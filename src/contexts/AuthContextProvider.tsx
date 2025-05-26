import { AuthContextType, authContext } from '@/contexts/authContext';
import { apiClient } from '@/lib/apiClient';
import { store } from '@/lib/store';
import { FC, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

export const AuthContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<AuthContextType['status']>('unverified');
  const [user, setUser] = useState<User | null>(null);

  const me = useCallback(async () => {
    try {
      const response = await apiClient.GET('/v1/users/me');
      if (response.data?.user) {
        setUser(response.data?.user);
        setStatus('authenticated');
      } else {
        setUser(null);
        setStatus('unauthenticated');
      }
    } catch (error) {
      console.error(error);
      setUser(null);
      setStatus('unauthenticated');
    }
  }, []);

  const updateToken = useCallback(
    (newToken: string) => {
      store.set('token', newToken);
      me();
    },
    [me]
  );

  useEffect(() => {
    me();
  }, [me]);

  const value = useMemo(() => ({ status, user, updateToken }), [status, user, updateToken]);

  return <authContext.Provider value={value}>{children}</authContext.Provider>;
};
