import React, {useState, type ReactNode} from 'react';
import {ThemeContext, type ThemeMode} from './ThemeContext';
import {lightTheme} from './light';
import {darkTheme} from './dark';

export function ThemeProvider({children}: {children: ReactNode}) {
  const [mode, setMode] = useState<ThemeMode>('light');

  const theme = mode === 'light' ? lightTheme : darkTheme;

  const setTheme = (themeName: ThemeMode) => {
    setMode(themeName);
  };

  return (
    <ThemeContext.Provider value={{theme, mode, setTheme}}>
      {children}
    </ThemeContext.Provider>
  );
}
