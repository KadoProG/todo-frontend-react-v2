import React from 'react';

export interface AuthContextType {
  status: 'unverified' | 'authenticated' | 'unauthenticated';
  user: User | null;
  updateToken: (newToken: string) => void;
}

export const authContext = React.createContext<AuthContextType>({
  status: 'unverified',
  user: null,
  updateToken: () => {},
});

export const useAuthContext = () => React.useContext(authContext);
