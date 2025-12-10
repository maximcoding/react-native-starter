/**
 * FILE: spacing.ts
 * LAYER: core/theme/tokens
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Unified spacing scale for margins/paddings/gaps across the entire app.
 *
 * DESIGN GOALS:
 *   - Follow 4px baseline grid (industry standard).
 *   - Provide micro → large spacing steps.
 *   - Semantic naming instead of raw numbers.
 *   - Scalable for responsive/density modes.
 *
 * EXTENSION:
 *   - Add density modes: compact/cozy/comfortable.
 *   - Add vertical rhythm presets for typography.
 * ---------------------------------------------------------------------
 */

export const spacing = {
  // Extremely small internal gaps (icons, tiny chips, line breaks)
  micro: 2,
  xxs: 4,

  // Small paddings (buttons, cards, inline elements)
  xs: 8,
  sm: 12,

  // Medium paddings (default UI spacing)
  md: 16,
  lg: 20,

  // Large gaps (section spacing, screen padding)
  xl: 24,
  xxl: 32,

  // Extra-large (modals, bottom sheets, hero sections)
  xxxl: 40,
  xxxxl: 48,
  xxxxxl: 56,
} as const;

export type Spacing = typeof spacing;
