import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SettingsStackParamList } from '@/app/navigation/types/settings-types.ts';
import { ROUTES } from '@/app/navigation/routes.ts';
import SettingsScreen from '@/features/settings/screens/SettingsScreen.tsx';
import LanguageScreen from '@/features/settings/screens/LanguageScreen.tsx';
import ThemeScreen from '@/features/settings/screens/ThemeScreen.tsx';

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export default function SettingsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name={ROUTES.SETTINGS_ROOT} component={SettingsScreen} />
      <Stack.Screen
        name={ROUTES.SETTINGS_LANGUAGE}
        component={LanguageScreen}
      />
      <Stack.Screen name={ROUTES.SETTINGS_THEME} component={ThemeScreen} />
    </Stack.Navigator>
  );
}
