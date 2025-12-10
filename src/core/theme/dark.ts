/**
 * FILE: dark.ts
 * LAYER: core/theme
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Define fully semantic dark theme variant matching lightTheme structure.
 *
 * DESIGN GOALS:
 *   - 1:1 parity with lightTheme (mandatory for dynamic theming).
 *   - High contrast text colors.
 *   - Correct elevation behavior for dark UI (less shadows → more overlays).
 *   - Semantic, not brand-based color system.
 *
 * EXTENSION:
 *   - Add amoled mode (true black).
 *   - Add brand accent overrides.
 * ---------------------------------------------------------------------
 */

import { spacing } from './tokens/spacing';
import { radius } from './tokens/radius';
import { typography } from './tokens/typography';
import { elevation } from './tokens/elevation';

export const darkTheme = {
  /**
   * SEMANTIC PALETTE (Dark Mode)
   * Matches lightTheme keys exactly.
   */
  colors: {
    // Core background layers
    background: '#000000',
    backgroundSecondary: '#0E0E0E',

    // Surface layers (cards, sheets)
    surface: '#121212',
    surfaceSecondary: '#1A1A1A',

    // Text layers (high contrast)
    textPrimary: '#FFFFFF',
    textSecondary: '#CCCCCC',
    textTertiary: '#888888',

    // Brand (brightened for dark mode)
    primary: '#9C92FF',
    primaryHover: '#8A7CF2',
    primaryActive: '#6D63D5',

    // System states
    success: '#41D97C',
    danger: '#FF6B6B',
    warning: '#FFB84D',
    info: '#4DB8FF',

    // Borders / dividers
    border: '#333333',
    divider: '#2A2A2A',

    // Overlays
    overlayLight: 'rgba(255,255,255,0.05)',
    overlayMedium: 'rgba(255,255,255,0.12)',
    overlayHeavy: 'rgba(255,255,255,0.2)',
  },

  /**
   * TOKEN SYSTEM
   */
  spacing,
  radius,
  typography,
  elevation,
} as const;

export type DarkTheme = typeof darkTheme;
