// src/app/navigation/tabs/home-tabs.tsx
import React, { useMemo } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ROUTES } from '@/app/navigation/routes';
import { useTheme } from '@/core/theme';
import { useT } from '@/core/i18n/useT';
import HomeScreen from '@/features/home/screens/HomeScreen.tsx';
import SettingsScreen from '@/features/settings/screens/SettingsScreen.tsx';
import { createHomeScreenOptions } from '@/app/navigation';

const Tab = createBottomTabNavigator();

export default function HomeTabs() {
  const { theme } = useTheme();
  const t = useT();

  // preserve referential stability of screenOptions
  const screenOptions = useMemo(
    () => createHomeScreenOptions(theme, t),
    [theme, t],
  );

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name={ROUTES.TAB_HOME} component={HomeScreen} />
      <Tab.Screen name={ROUTES.TAB_SETTINGS} component={SettingsScreen} />
    </Tab.Navigator>
  );
}
