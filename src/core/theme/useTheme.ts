import {useContext} from 'react';
import {ThemeContext} from './ThemeContext';

export function useTheme() {
  const ctx = useContext(ThemeContext);
  return ctx;
}
