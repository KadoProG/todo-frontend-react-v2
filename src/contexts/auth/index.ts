import { createContext } from 'react';
import { components } from '@/lib/apiClient/types/schema';

export type AuthContextType = {
  status: 'pending' | 'unAuthenticated' | 'authenticated' | 'error';
  user: components['schemas']['UserResource'] | null;
  mutate: () => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  status: 'pending',
  user: null,
  mutate: () => {},
  logout: () => {},
});
