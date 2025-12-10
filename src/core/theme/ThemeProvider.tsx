/**
 * FILE: ThemeProvider.tsx
 * LAYER: core/theme
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Provide global theme context with:
 *     - light/dark modes
 *     - system appearance support
 *     - dynamic toggle
 *     - future persistent storage (MMKV)
 *
 * RESPONSIBILITIES:
 *   - Compute final theme object (light/dark).
 *   - Sync with system theme if enabled.
 *   - Expose mode + setTheme to UI and logic layers.
 *
 * EXTENSION GUIDELINES:
 *   - Persist user-selected theme in MMKV:
 *       kvStorage.setString('themeMode', mode)
 *   - Add high-contrast or custom branding themes.
 *   - Add ThemeTokensProvider wrapper if tokens become dynamic.
 * ---------------------------------------------------------------------
 */

import React, { useState, useEffect, useMemo, type ReactNode } from 'react';
import { Appearance } from 'react-native';
import { ThemeContext, type ThemeMode } from './ThemeContext';

import { lightTheme } from './light';
import { darkTheme } from './dark';

export function ThemeProvider({ children }: { children: ReactNode }) {
  /**
   * MODE:
   *  - 'light'        → user forced light
   *  - 'dark'         → user forced dark
   *  - 'system'       → follow OS setting
   *
   * Persisting user choice:
   *   kvStorage.getString('themeMode') || 'system'
   */
  const [mode, setMode] = useState<ThemeMode>('system');

  /**
   * Read initial system theme.
   */
  const systemColorScheme = Appearance.getColorScheme() || 'light';

  /**
   * Listen to system theme changes when mode === 'system'.
   */
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      if (mode === 'system') {
        // triggers rerender automatically
        setMode('system');
      }
    });

    return () => sub.remove();
  }, [mode]);

  /**
   * Compute active theme.
   */
  const theme = useMemo(() => {
    const usedMode = mode === 'system' ? systemColorScheme : mode;
    return usedMode === 'light' ? lightTheme : darkTheme;
  }, [mode, systemColorScheme]);

  /**
   * Safe setter (future: persist to MMKV).
   */
  const setTheme = (nextMode: ThemeMode) => {
    setMode(nextMode);
    // kvStorage.setString('themeMode', nextMode);
  };

  return (
    // @ts-ignore
    <ThemeContext.Provider value={{ theme, mode, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
