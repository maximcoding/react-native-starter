/**
 * FILE: brand.ts
 * LAYER: core/theme/tokens
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Third-party brand colors required verbatim by vendor identity
 *   guidelines (OAuth providers, social platforms).
 *   These are NOT part of the app semantic palette — do not use for
 *   any app-owned UI element. Components use useTheme().brand.*
 * ---------------------------------------------------------------------
 */

export const brand = {
  google: {
    blue: '#4285F4',
    green: '#34A853',
    yellow: '#FBBC05',
    red: '#EA4335',
  },
  facebook: {
    blue: '#1877F2',
  },
} as const

export type Brand = typeof brand
