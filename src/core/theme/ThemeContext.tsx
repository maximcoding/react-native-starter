/**
 * FILE: ThemeContext.ts
 * LAYER: core/theme
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Provide a strongly-typed global theme context shared across the app.
 *
 * RESPONSIBILITIES:
 *   - Hold current theme object (light/dark/system-resolved).
 *   - Expose current theme mode.
 *   - Provide setTheme() to switch modes.
 *
 * DESIGN NOTES:
 *   - ThemeMode includes `"system"` so ThemeProvider can use Appearance.
 *   - Default fallback is "system" to avoid forcing a fixed theme.
 *   - theme type is inferred from lightTheme but applies to all themes.
 *
 * EXTENSION GUIDELINES:
 *   - Add more modes: "highContrast", "amoled", "brandA", "brandB".
 *   - Add ThemeTokensContext if tokens become dynamic.
 *   - Persist mode in MMKV so theme survives app restarts.
 * ---------------------------------------------------------------------
 */

import { createContext } from 'react';
import { lightTheme } from './light';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeContextValue {
  theme: typeof lightTheme; // resolved theme object
  mode: ThemeMode; // light | dark | system
  setTheme: (nextMode: ThemeMode) => void; // toggle/set handler
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: lightTheme,
  mode: 'system',
  setTheme: () => {},
});
