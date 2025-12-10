/**
 * FILE: elevation.ts
 * LAYER: core/theme/tokens
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Cross-platform elevation system with unified shadow presets for
 *   iOS and Android. Used for cards, modals, surfaces, sheets, toolbars.
 *
 * DESIGN NOTES:
 *   - iOS uses shadows (shadowOpacity, shadowRadius, shadowOffset).
 *   - Android uses elevation only (shadow ignored).
 *   - Values tuned to match Material / Stripe / Airbnb levels.
 *   - Must be semantic and identical across light/dark themes.
 *
 * EXTENSION:
 *   - Add levels (e4, e8, e16...) for cloud-scale apps.
 *   - Add "top-only" shadows for headers.
 *   - Add dynamic shadows based on theme (light/dark).
 * ---------------------------------------------------------------------
 */

export const elevation = {
  /**
   * No shadow — for flat UI (screens, lists, headers)
   */
  none: {
    elevation: 0,
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
  },

  /**
   * Small elevation — Cards, small surfaces, inputs
   * Level: e2 (Material-like)
   */
  card: {
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  /**
   * Medium elevation — Popovers, dropdowns, floating buttons
   * Level: e4
   */
  floating: {
    elevation: 4,
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },

  /**
   * Large elevation — Modals, bottom sheets
   * Level: e8
   */
  modal: {
    elevation: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },

  /**
   * Extra-large (e16) — Rare usage: Heavy-focus dialogs
   */
  dialog: {
    elevation: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
  },
} as const;

export type Elevation = typeof elevation;
