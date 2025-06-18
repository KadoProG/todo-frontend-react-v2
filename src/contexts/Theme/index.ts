import { createContext } from 'react';

export type ThemeContextType = {
  theme: 'light' | 'dark' | 'device';
  updateTheme: (newTheme: 'light' | 'dark' | 'device') => void;
};
export const ThemeContext = createContext<ThemeContextType>({
  theme: 'device',
  updateTheme: () => {},
});
