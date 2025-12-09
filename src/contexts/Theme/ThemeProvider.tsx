import { ThemeContext } from '@/contexts/Theme';
import { store } from '@/lib/store';
import { FC, ReactNode, useCallback, useLayoutEffect, useMemo, useState } from 'react';

export const ThemeProvider: FC<{ children: ReactNode }> = (props) => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'device'>(store.get('theme'));

  const updateTheme = useCallback((newTheme: 'light' | 'dark' | 'device') => {
    setTheme(newTheme);
    store.set('theme', newTheme);
  }, []);

  useLayoutEffect(() => {
    if (theme === 'device') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const handleChange = () => {
        if (mediaQuery.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      };

      handleChange();
      mediaQuery.addEventListener('change', handleChange);

      return () => mediaQuery.removeEventListener('change', handleChange);
    } else if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const value = useMemo(() => ({ theme, updateTheme }), [theme, updateTheme]);

  return <ThemeContext.Provider value={value}>{props.children}</ThemeContext.Provider>;
};
