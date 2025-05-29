import { DropdownList } from '@/components/Inputs/DropdownList';
import { ThemeContext } from '@/contexts/Theme';
import { FC, useContext } from 'react';

const options: {
  value: 'light' | 'dark' | 'device';
  label: string;
}[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'device', label: 'Device' },
];

export const ThemeSwitch: FC = () => {
  const { theme, updateTheme } = useContext(ThemeContext);

  return (
    <DropdownList
      id="theme"
      options={options}
      titleLabel="シーンの設定"
      value={theme}
      setValue={(newTheme) => updateTheme(newTheme as 'light' | 'dark' | 'device')}
    />
  );
};
