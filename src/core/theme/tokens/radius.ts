/**
 * FILE: radius.ts
 * LAYER: core/theme/tokens
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Unified border-radius scale used across all UI components.
 *
 * DESIGN GOALS:
 *   - Semantic naming (not arbitrary numbers).
 *   - Follow 2–4–8px rounded system (industry standard).
 *   - Fully compatible with iOS/Android design guidelines.
 *   - Scalable for chips, modals, cards, sheets, buttons.
 *
 * EXTENSION:
 *   - Add density modes (compact/comfortable).
 *   - Support brand overrides or device-specific radii.
 * ---------------------------------------------------------------------
 */

export const radius = {
  // No rounding (tables, separators)
  none: 0,

  // Subtle rounding (inputs, lists)
  xs: 2,
  sm: 4,

  // Medium rounding (buttons, cards)
  md: 6,
  lg: 8,

  // Large rounding (sheets, surfaces)
  xl: 12,
  xxl: 16,
  xxxl: 20,

  // Special shapes
  rounded: 999,  // full circle if width = height
  pill: 9999,    // for chips / tags
  full: 99999,   // maximum — auto-circle
} as const;

export type Radius = typeof radius;
