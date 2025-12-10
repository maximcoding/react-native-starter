/**
 * FILE: typography.ts
 * LAYER: core/theme/tokens
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Standardized typography scale for the entire app.
 *
 * GOALS:
 *   - Semantic names (NOT numeric names like "h1", "h2").
 *   - Consistent baseline grid (4px line height rounding).
 *   - Cross-platform readability (iOS/Android).
 *   - Accessible sizes (WCAG AA).
 *   - Matching industry standards (Stripe, Coinbase, Shopify).
 *
 * EXTENSION:
 *   - Add responsive scale (compact/cozy/comfortable).
 *   - Add fontWeight presets (regular/medium/semibold/bold).
 * ---------------------------------------------------------------------
 */

import { fonts } from './fonts';

export const typography = {
  /**
   * DISPLAY (large titles, hero sections)
   */
  displayLarge: {
    fontSize: 34,
    lineHeight: 42,
    fontFamily: fonts.semiBold,
    fontWeight: '600' as const,
  },
  displayMedium: {
    fontSize: 30,
    lineHeight: 38,
    fontFamily: fonts.semiBold,
    fontWeight: '600' as const,
  },
  displaySmall: {
    fontSize: 26,
    lineHeight: 32,
    fontFamily: fonts.medium,
    fontWeight: '500' as const,
  },

  /**
   * HEADLINES (screen titles, section titles)
   */
  headlineLarge: {
    fontSize: 22,
    lineHeight: 28,
    fontFamily: fonts.semiBold,
    fontWeight: '600' as const,
  },
  headlineMedium: {
    fontSize: 20,
    lineHeight: 26,
    fontFamily: fonts.semiBold,
    fontWeight: '600' as const,
  },
  headlineSmall: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: fonts.medium,
    fontWeight: '500' as const,
  },

  /**
   * TITLES (card titles, list item titles)
   */
  titleLarge: {
    fontSize: 17,
    lineHeight: 22,
    fontFamily: fonts.medium,
    fontWeight: '500' as const,
  },
  titleMedium: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fonts.semiBold,
    fontWeight: '600' as const,
  },
  titleSmall: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: fonts.medium,
    fontWeight: '500' as const,
  },

  /**
   * BODY TEXT (paragraphs, content)
   */
  bodyLarge: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fonts.regular,
    fontWeight: '400' as const,
  },
  bodyMedium: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: fonts.regular,
    fontWeight: '400' as const,
  },
  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.regular,
    fontWeight: '400' as const,
  },
  bodyBold: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fonts.semiBold,
    fontWeight: '600' as const,
  },

  /**
   * LABELS (buttons, chips, badges)
   */
  labelLarge: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.semiBold,
    fontWeight: '600' as const,
  },
  labelMedium: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.medium,
    fontWeight: '500' as const,
  },
  labelSmall: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.medium,
    fontWeight: '500' as const,
  },

  /**
   * CAPS (uppercase text — tabs, section labels)
   */
  caps: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1,
    fontFamily: fonts.semiBold,
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
  },

  /**
   * MONO (code, technical values)
   */
  mono: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.mono,
    fontWeight: '400' as const,
  },
} as const;

export type Typography = typeof typography;
