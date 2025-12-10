import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LanguageScreen from '@/app/features/settings/screens/LanguageScreen.tsx';
import ThemeScreen from '@/app/features/settings/screens/ThemeScreen.tsx';
import SettingsScreen from '@/app/features/settings/screens/SettingsScreen.tsx';
import { SettingsStackParamList } from '@/app/navigation/types/settings-types.ts';
import { ROUTES } from '@/app/navigation/routes.ts';

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
