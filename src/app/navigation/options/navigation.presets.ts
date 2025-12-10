import React from 'react';

import {
  useStackTokens,
  useModalTokens,
  useTabTokens,
} from './navigation.tokens';

import { getNavConfig } from '@/app/navigation/helpers/navigation-helpers';
import { useT } from '@/core/i18n/useT';
import { ROUTES, RouteName } from '@/app/navigation/routes';

import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { IconName } from '@/app/assets';
import { IconSvg } from '@/app/components/IconSvg';

/* -----------------------------------------------------
 * STACK PRESETS
 * ----------------------------------------------------- */
export function useStackPresets() {
  const t = useStackTokens();
  const translate = useT();

  return {
    default: {
      ...t.base,
      ...t.noHeader,
    },

    withHeader: {
      ...t.base,
      ...t.header,
    },

    transparent: {
      ...t.base,
      ...t.transparent,
    },

    forRoute(route: RouteName): NativeStackNavigationOptions {
      const cfg = getNavConfig(route);
      return {
        ...t.base,
        ...t.header,
        headerTitle: translate(cfg.label),
      };
    },
  };
}

/* -----------------------------------------------------
 * MODAL PRESETS
 * ----------------------------------------------------- */
export function useModalPresets() {
  const t = useModalTokens();
  const translate = useT();

  return {
    full: { ...t.full },
    half: { ...t.half },

    forRoute(route: RouteName) {
      const cfg = getNavConfig(route);
      return {
        ...t.full,
        title: translate(cfg.label),
      };
    },
  };
}

/* -----------------------------------------------------
 * TAB PRESETS (SVG ICONS ONLY)
 * ----------------------------------------------------- */
export function useTabPresets() {
  const tokens = useTabTokens();
  const translate = useT();

  function mapRouteToIcon(route: RouteName): IconName {
    switch (route) {
      case ROUTES.TAB_HOME:
        return IconName.User;

      case ROUTES.TAB_SETTINGS:
        return IconName.User;

      default:
        return IconName.User; // fallback icon
    }
  }

  return {
    default: { ...tokens },

    forRoute(route: RouteName): BottomTabNavigationOptions {
      const cfg = getNavConfig(route);
      const iconName = mapRouteToIcon(route);

      return {
        tabBarLabel: translate(cfg.label),
        tabBarIcon: ({ color, size }) =>
          React.createElement(IconSvg, {
            name: iconName,
            color,
            size,
          }),
        tabBarActiveTintColor: tokens.tabBarActiveTintColor,
        tabBarInactiveTintColor: tokens.tabBarInactiveTintColor,
        tabBarStyle: tokens.tabBarStyle,
      };
    },
  };
}
