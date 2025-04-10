import { LOCAL_STORAGE_TOKEN_KEY } from '@/const/const';
import { AuthContextType, authContext } from '@/contexts/authContext';
import axios from '@/libs/axios';
import React from 'react';

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = (props) => {
  const [status, setStatus] = React.useState<AuthContextType['status']>('unverified');
  const [user, setUser] = React.useState<User | null>(null);
  const [token, setToken] = React.useState<string>(
    localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY) || ''
  );

  const me = React.useCallback(async () => {
    if (!token) {
      setUser(null);
      setStatus('unauthenticated');
      return;
    }

    try {
      const response = await axios.get<User>('/v1/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
      setStatus('authenticated');
    } catch (error) {
      console.error(error); // eslint-disable-line no-console
      setUser(null);
      setStatus('unauthenticated');
    }
  }, [token]);

  const updateToken = React.useCallback(
    (newToken: string) => {
      setToken(newToken);
      localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, newToken);
      setTimeout(() => me(), 0);
    },
    [me]
  );

  React.useEffect(() => {
    me();
  }, [me]);

  const value = React.useMemo(() => ({ status, user, updateToken }), [status, user, updateToken]);

  return <authContext.Provider value={value}>{props.children}</authContext.Provider>;
};
