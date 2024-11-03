import { AuthContextType, authContext } from '@/contexts/authContext';
import axios from '@/libs/axios';
import React from 'react';

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = (props) => {
  const [status, setStatus] = React.useState<AuthContextType['status']>('unverified');
  const [user, setUser] = React.useState<User | null>(null);

  const me = React.useCallback(async () => {
    try {
      const response = await axios.get<User>('/api/v1/me');
      setUser(response.data);
      setStatus('authenticated');
    } catch (error) {
      console.error(error); // eslint-disable-line no-console
      setUser(null);
      setStatus('unauthenticated');
    }
  }, []);

  React.useEffect(() => {
    me();
  }, [me]);

  const value = React.useMemo(() => ({ status, user }), [status, user]);

  return <authContext.Provider value={value}>{props.children}</authContext.Provider>;
};
