import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import SettingsStack from '@/app/navigation/stacks/settings-stack';
import { ROUTES } from '@/app/navigation/routes';
import { HomeScreenOptions } from '@/app/navigation';
import HomeScreen from '@/features/home/screens/HomeScreen.tsx';

const Tab = createBottomTabNavigator();

export default function HomeTabs() {
  return (
    <Tab.Navigator screenOptions={HomeScreenOptions}>
      <Tab.Screen name={ROUTES.TAB_HOME} component={HomeScreen} />
      <Tab.Screen name={ROUTES.TAB_SETTINGS} component={SettingsStack} />
    </Tab.Navigator>
  );
}
