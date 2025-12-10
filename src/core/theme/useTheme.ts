/**
 * FILE: useTheme.ts
 * LAYER: core/theme
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Safe hook to read global theme context.
 *
 * RESPONSIBILITIES:
 *   - Guarantee non-null theme context.
 *   - Prevent misuse outside of <ThemeProvider>.
 *   - Provide fully typed theme, mode, and setter.
 *
 * EXTENSION GUIDELINES:
 *   - Add selectors: useThemeMode(), useThemeTokens().
 *   - Add memoized selectors for performance.
 * ---------------------------------------------------------------------
 */

import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

export function useTheme() {
  const ctx = useContext(ThemeContext);

  if (!ctx) {
    throw new Error(
      '[useTheme] ThemeContext is undefined. ' +
      'Wrap your app with <ThemeProvider>.'
    );
  }

  return ctx;
}
