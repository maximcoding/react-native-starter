/**
 * FILE: light.ts
 * LAYER: core/theme
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Define the full light theme object for the application including
 *   semantic color system, tokens, spacing, radius, typography, and
 *   elevation. Used directly by ThemeProvider to construct final theme.
 *
 * DESIGN GOALS:
 *   - No magic hex values outside theme files.
 *   - Semantic-driven palette (background, surface, textPrimary, etc).
 *   - Extensible for brand overrides and density modes.
 *   - Consistent with darkTheme structure (1:1 mirroring).
 *   - Ready for enterprise UI Kit + tokens architecture.
 *
 * EXTENSION:
 *   - Add "accent", "warning", "info" states.
 *   - Add subtle opacities (textSecondary, textTertiary).
 *   - Add inverse palette for dark surfaces.
 * ---------------------------------------------------------------------
 */

import { spacing } from './tokens/spacing';
import { radius } from './tokens/radius';
import { typography } from './tokens/typography';
import { elevation } from './tokens/elevation';

export const lightTheme = {
  /**
   * SEMANTIC PALETTE
   * Colors must describe meaning, NOT brand hex values.
   * Every UI component should use semantic color names only.
   */
  colors: {
    // Core background layers
    background: '#FFFFFF',
    backgroundSecondary: '#F7F7F7',

    // Surface cards, sheets, modals
    surface: '#FFFFFF',
    surfaceSecondary: '#F3F3F3',

    // Text layers
    textPrimary: '#000000',
    textSecondary: '#555555',
    textTertiary: '#888888',

    // Brand
    primary: '#5247E6',
    primaryHover: '#463BCF',
    primaryActive: '#3E39B4',

    // System states
    success: '#28A745',
    danger: '#E04242',
    warning: '#F4A100',
    info: '#2E8ECE',

    // Borders, outlines, dividers
    border: '#E0E0E0',
    divider: '#EBEBEB',

    // Overlays
    overlayLight: 'rgba(0,0,0,0.05)',
    overlayMedium: 'rgba(0,0,0,0.12)',
    overlayHeavy: 'rgba(0,0,0,0.2)',
  },

  /**
   * TOKENS (spacing, radius, typography, elevation)
   * These are imported token systems, not raw values.
   */
  spacing,
  radius,
  typography,
  elevation,
} as const;

export type LightTheme = typeof lightTheme;
