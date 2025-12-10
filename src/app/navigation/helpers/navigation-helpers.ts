/**
 * FILE: navigation-helpers.ts
 * Safe fallback metadata provider
 */

import type { RouteName } from '@/app/navigation/routes';

/**
 * Minimal meta type used ONLY to satisfy presets.
 */
export interface NavMeta {
  label: string;
}

/**
 * Fallback for ALL routes.
 * stack/header will use this unless overridden.
 */
const FALLBACK: NavMeta = {
  label: 'app.title',
};

/**
 * TEMPORARY EMPTY MAP
 * (You removed navConfig.ts — this is OK)
 */
const EMPTY_MAP: Partial<Record<RouteName, NavMeta>> = {};

/**
 * Safe unified getter.
 * Never crashes.
 */
export function getNavConfig(route: RouteName): NavMeta {
  return EMPTY_MAP[route] ?? FALLBACK;
}
