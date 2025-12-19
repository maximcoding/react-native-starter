// src/app/navigation/options/tabOptions.tsx
import React from 'react';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { IconSvg } from '@/app/components/IconSvg';
import { ROUTES } from '@/app/navigation/routes';
import { IconName } from '@assets/icons'; // ← no .ts extension

//
// ICON LOGIC
//
export const BottomTabIcon = (
  route: { name: string },
  focused: boolean,
  color: string,
  size: number,
) => {
  let iconName: IconName = IconName.USER;

  switch (route.name) {
    case ROUTES.TAB_HOME:
      iconName = IconName.USER;
      break;
    case ROUTES.TAB_SETTINGS:
      iconName = IconName.USER;
      break;
    default:
      iconName = IconName.USER;
  }

  return <IconSvg name={iconName} size={size} color={color} />;
};

//
// TITLE LOGIC
//
export const TabTitle = (route: { name: string }, t: (k: string) => string) => {
  switch (route.name) {
    case ROUTES.TAB_HOME:
      return t('home.title');
    case ROUTES.TAB_SETTINGS:
      return t('settings.title');
    default:
      return route.name;
  }
};

//
// TAB BAR STYLE
//
export const TabBarStyle = (theme: any) => {
  return {
    height: 64,
    backgroundColor: theme.colors.surface ?? theme.colors.background,
    borderTopWidth: 0.5,
    borderColor: theme.colors.border ?? theme.colors.surface,
    paddingBottom: 4,
  };
};

//
// MAIN SCREEN OPTIONS (pure helper for screenOptions)
// Call inside your Tabs component where you already have `theme` and `t`.
//
export const makeTabScreenOptions = (theme: any, t: (k: string) => string) => {
  return ({
    route,
  }: {
    route: { name: string };
  }): BottomTabNavigationOptions => ({
    headerShown: false,
    tabBarLabel: TabTitle(route, t),
    tabBarIcon: ({ focused, color, size }) =>
      BottomTabIcon(route, focused, color!, size!),
    tabBarActiveTintColor: theme.colors.primary,
    tabBarInactiveTintColor: theme.colors.textSecondary,
    tabBarStyle: TabBarStyle(theme),
  });
};
