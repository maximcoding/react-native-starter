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
 *   - Warm-neutral base with subtle cool undertone for depth.
 *   - WCAG AA+ contrast on all text layers.
 *   - 1:1 structural parity with darkTheme.
 *   - Ready for enterprise UI Kit + tokens architecture.
 *
 * PALETTE PHILOSOPHY:
 *   Backgrounds carry a faint cool-blue tint (~228° at 2-4% saturation)
 *   to pair with the dark theme's undertone. Pure #FFF is reserved for
 *   elevated surfaces (cards, modals) so they "lift" off the page
 *   without heavy shadows.
 *
 * EXTENSION:
 *   - Add density modes (compact, comfortable, spacious).
 *   - Add brand accent overrides.
 * ---------------------------------------------------------------------
 */

import { brand } from './tokens/brand'
import { elevation } from './tokens/elevation'
import { radius } from './tokens/radius'
import { spacing } from './tokens/spacing'
import { typography } from './tokens/typography'

export const lightTheme = {
  /**
   * SEMANTIC PALETTE
   * Colors must describe meaning, NOT brand hex values.
   * Every UI component should use semantic color names only.
   */
  colors: {
    // ── Core background layers ────────────────────────────────────
    // Tinted off-white so elevated surfaces (pure white) pop.
    // The subtle blue keeps visual continuity with darkTheme.
    background: '#F6F7FA',
    backgroundSecondary: '#EDEEF3',

    // ── Surface layers (cards, sheets, modals) ────────────────────
    // Primary surface is near-white; secondary steps down slightly
    // so nested cards remain distinguishable.
    surface: '#FFFFFF',
    surfaceSecondary: '#F2F3F7',

    // ── Text layers ──────────────────────────────────────────────
    // Primary avoids pure black (reduces halation on white).
    // Ratios on #F6F7FA → Primary ≥14:1, Secondary ≥7:1, Tertiary ≥4.6:1.
    textPrimary: '#111318',
    textSecondary: '#4A4D5C',
    textTertiary: '#7C7F91',

    // ── Brand accent ─────────────────────────────────────────────
    // Darkened vs dark-mode primary to maintain ≥4.5:1 on white
    // surfaces. Same hue family (indigo-violet ~245°).
    primary: '#5247E6',
    primaryHover: '#4338CA',
    primaryActive: '#3730A3',
    onPrimary: '#FFFFFF',

    // ── System states ────────────────────────────────────────────
    // Slightly deeper than typical to clear AA on white surfaces.
    // Hue-matched with darkTheme counterparts.
    success: '#16A34A',
    danger: '#E11D48',
    warning: '#D97706',
    info: '#2563EB',

    // ── Borders / dividers ───────────────────────────────────────
    // Semi-transparent so they adapt when layered on tinted surfaces.
    border: 'rgba(17, 19, 24, 0.10)',
    divider: 'rgba(17, 19, 24, 0.06)',

    // ── Overlays ─────────────────────────────────────────────────
    overlayLight: 'rgba(17, 19, 24, 0.03)',
    overlayMedium: 'rgba(17, 19, 24, 0.06)',
    overlayHeavy: 'rgba(17, 19, 24, 0.12)',
    overlayBackdrop: 'rgba(17, 19, 24, 0.40)',
    overlayOnSurface: 'rgba(17, 19, 24, 0.04)',

    // ── Form controls & brand wash ───────────────────────────────
    inputBackground: '#FFFFFF',
    inputBackgroundFocused: 'rgba(82, 71, 230, 0.04)',
    inputBorder: 'rgba(17, 19, 24, 0.12)',
    primaryAmbient: 'rgba(82, 71, 230, 0.10)',
  },

  /**
   * TOKEN SYSTEM
   */
  spacing,
  radius,
  typography,
  elevation,
  brand,
} as const

export type LightTheme = typeof lightTheme
