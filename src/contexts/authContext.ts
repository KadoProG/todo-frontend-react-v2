import React from 'react';

export interface AuthContextType {
  status: 'unverified' | 'authenticated' | 'unauthenticated';
  user: User | null;
}

export const authContext = React.createContext<AuthContextType>({
  status: 'unverified',
  user: null,
});

export const useAuthContext = () => React.useContext(authContext);
