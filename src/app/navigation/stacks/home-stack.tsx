import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '@/app/navigation/routes.ts';
import HomeTabs from '../tabs/home-tabs.tsx';
import type { HomeStackParamList } from '@/app/navigation/types/home-types.ts';
import { useNav } from '@/app/navigation/options/navigation.ts';
import { useT } from '@/core/i18n/useT.ts';
import { useTheme } from '@/core/theme';
import {
  BottomTabIcon,
  TabBarStyle,
  TabTitle,
} from '@/app/navigation/options/tabOptions.tsx';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeScreenOptions = (props: any) => {
  const { route } = props;
  const t = useT();
  const { theme } = useTheme();

  return {
    headerShown: false,

    tabBarShowLabel: true,
    tabBarLabel: TabTitle(route, t),

    tabBarActiveTintColor: theme.colors.primary,
    tabBarInactiveTintColor: theme.colors.textSecondary,

    tabBarIcon: ({ focused, color, size }: any) =>
      BottomTabIcon(route, focused, color, size),

    tabBarStyle: TabBarStyle(theme),
  };
};

export default function HomeStack() {
  const nav = useNav();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={ROUTES.HOME_TABS}
        component={HomeTabs}
        options={nav.stack(ROUTES.HOME_TABS)}
      />
    </Stack.Navigator>
  );
}
