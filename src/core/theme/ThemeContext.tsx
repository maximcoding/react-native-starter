import React, {createContext} from 'react';
import {lightTheme} from './light';

export type ThemeMode = 'light' | 'dark';

export const ThemeContext = createContext<{
  theme: typeof lightTheme;
  mode: ThemeMode;
  setTheme: (themeName: ThemeMode) => void;
}>({
  theme: lightTheme,
  mode: 'light',
  setTheme: () => {},
});
