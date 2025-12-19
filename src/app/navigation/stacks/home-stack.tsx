// src/app/navigation/options/createHomeScreenOptions.ts
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { makeTabScreenOptions } from '@/app/navigation/options/tabOptions';
import { ROUTES } from '@/app/navigation/routes';

type ThemeLike = {
  colors: Record<string, any>;
};

type TFunc = (k: string) => string;

/**
 * Factory that composes/extends base tab options.
 * - No hooks here (safe to import anywhere).
 * - Pass in theme & t from a component that can use hooks.
 */
export function createHomeScreenOptions(theme: ThemeLike, t: TFunc) {
  const baseFactory = makeTabScreenOptions(theme, t);

  return ({
    route,
  }: {
    route: { name: string };
  }): BottomTabNavigationOptions => {
    // Start with the base options from our shared helper
    const base = baseFactory({ route });

    // Add/override per-route tweaks (examples below)
    const perRouteOverrides: Partial<BottomTabNavigationOptions> = {};

    if (route.name === ROUTES.TAB_HOME) {
      // Example: slightly taller bar on Home
      perRouteOverrides.tabBarStyle = {
        ...(base.tabBarStyle || {}),
        height: 68,
      };
    }

    if (route.name === ROUTES.TAB_SETTINGS) {
      // Example: custom label for Settings
      perRouteOverrides.tabBarLabel = t('settings.title');
      // Example: hide header (already false in base, shown just as a demo)
      perRouteOverrides.headerShown = false;
    }

    // Global tweaks for all tabs (optional)
    const globalOverrides: Partial<BottomTabNavigationOptions> = {
      // Example: ensure consistent visibility of labels
      tabBarShowLabel: true,
    };

    // Merge order: base → per-route → global (last wins)
    return {
      ...base,
      ...perRouteOverrides,
      ...globalOverrides,
    };
  };
}
