import React from 'react';

import { useStackTokens, useModalTokens } from './navigation.tokens';

import { getNavConfig } from '@/app/navigation/helpers/navigation-helpers';
import { useT } from '@/core/i18n/useT';
import { ROUTES, RouteName } from '@/app/navigation/routes';

import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { IconSvg } from '@/app/components/IconSvg';
import { IconName } from '@assets/icons';

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
  return {
    forRoute(route: any) {
      const iconName: IconName =
        route === ROUTES.TAB_HOME
          ? IconName.USER
          : route === ROUTES.TAB_SETTINGS
          ? IconName.USER
          : IconName.USER;

      return {
        tabBarIcon: ({ focused, color, size }: any) =>
          React.createElement(IconSvg, {
            name: iconName as any,
            color,
            size,
          }),
      };
    },
  };
}
