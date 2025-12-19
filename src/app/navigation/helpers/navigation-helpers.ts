/**
 * FILE: navigation-helpers.ts
 * Safe fallback metadata provider
 */

import type { RouteName } from '@/app/navigation/routes';
import {
  createNavigationContainerRef,
  NavigationState,
} from '@react-navigation/native';
import type { RootStackParamList } from '@/app/navigation/types/root-types';

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

/**
 * ------------------------------------------------------------------
 * Root navigation ref + helpers for imperative navigation (optional)
 * ------------------------------------------------------------------
 * Use only вне компонентов, если нет доступа к hook useNavigation().
 */
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

/** Возвращает имя активного роута, проходя вложенные навигаторы. */
export function getActiveRouteName(
  state: ReturnType<typeof navigationRef.getRootState>,
): keyof RootStackParamList | undefined {
  const index = state?.index ?? 0;
  const route = state?.routes?.[index];
  if (!route) return undefined;
  const childState = route.state as NavigationState | undefined;
  if (!childState) return route.name as keyof RootStackParamList;
  // рекурсия
  return getActiveRouteName(childState);
}

/** Императивная навигация без пропса navigation. Использовать осторожно. */
export function navigate<Name extends keyof RootStackParamList>(
  name: Name,
  params?: RootStackParamList[Name],
) {
  if (navigationRef.isReady()) {
    // RN допускает undefined params
    navigationRef.navigate(name as any, params as any);
  }
}

/** Безопасный goBack. */
export function goBack() {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
}

/** Полный сброс рутового состояния навигации. */
export function resetRoot(
  state: Parameters<typeof navigationRef.resetRoot>[0] = { index: 0, routes: [] },
) {
  if (navigationRef.isReady()) {
    navigationRef.resetRoot(state);
  }
}
