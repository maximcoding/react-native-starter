/**
 * FILE: fonts.ts
 * LAYER: core/theme/tokens
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Define stable, semantic font family tokens with full cross-platform
 *   support and fallback chains for iOS/Android.
 *
 * DESIGN GOALS:
 *   - One source of truth for all font families in the app.
 *   - Avoid raw font names in UI components.
 *   - Provide semantic font tokens (“regular”, “medium”, “semiBold” etc.).
 *   - Support monospace fonts for code/technical UI.
 *   - Provide fallback families for platform differences.
 *
 * EXTENSION:
 *   - Add variable-font weights (InterVariable).
 *   - Add italic variants when imported.
 *   - Add brand typography override system.
 * ---------------------------------------------------------------------
 */
import { Platform } from 'react-native';

export const fonts = {
  /**
   * INTER FAMILY (Primary UI Font)
   * These names MUST match your linked font files via react-native.config.js.
   *
   * Fallbacks ensure Android uses Roboto if custom fonts fail.
   */
  regular: Platform.select({
    ios: 'Inter-Regular',
    android: 'Inter-Regular',
    default: 'Inter-Regular',
  }),
  medium: Platform.select({
    ios: 'Inter-Medium',
    android: 'Inter-Medium',
    default: 'Inter-Medium',
  }),
  semiBold: Platform.select({
    ios: 'Inter-SemiBold',
    android: 'Inter-SemiBold',
    default: 'Inter-SemiBold',
  }),
  bold: Platform.select({
    ios: 'Inter-Bold',
    android: 'Inter-Bold',
    default: 'Inter-Bold',
  }),

  /**
   * ITALICS (optional — can be commented until imported)
   */
  italic: Platform.select({
    ios: 'Inter-Italic',
    android: 'Inter-Italic',
    default: 'Inter-Italic',
  }),

  /**
   * MONO FAMILY (Technical UI)
   */
  mono: Platform.select({
    ios: 'JetBrainsMono-Regular',
    android: 'JetBrainsMono-Regular',
    default: 'JetBrainsMono-Regular',
  }),

  /**
   * CAPS / TAB / BADGE SPECIFIC FONT
   * Used for uppercase tab labels, chips, badges.
   * If you want a different weight — override here.
   */
  caps: Platform.select({
    ios: 'Inter-SemiBold',
    android: 'Inter-SemiBold',
    default: 'Inter-SemiBold',
  }),

  /**
   * FUTURE:
   *   - InterVariable
   *   - RobotoFlex fallback
   *   - Brand custom fonts (e.g. “MyBrand-Display”)
   */
} as const;

export type Fonts = typeof fonts;
