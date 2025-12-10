import React from 'react';
import { useT } from '@/core/i18n/useT';
import { useTheme } from '@/core/theme/useTheme';

import { IconSvg } from '@/app/components/IconSvg.tsx';
import { ROUTES } from '@/app/navigation/routes';
import { IconName } from '@/app/assets/icons.ts';

//
// ICON LOGIC
//
export const BottomTabIcon = (
  route: any,
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
      return IconName.USER;
  }

  return <IconSvg name={iconName} size={size} color={color} />;
};

//
// TITLE LOGIC
//
export const TabTitle = (route: any, t: any) => {
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
    backgroundColor: theme.colors.background,
    borderTopWidth: 0.5,
    borderColor: theme.colors.border,
    paddingBottom: 4,
  };
};

//
// MAIN SCREEN OPTIONS (LIKE YOUR OLD APP)
//
