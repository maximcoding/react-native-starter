import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '@/app/navigation/routes.ts';
import HomeTabs from '../tabs/home-tabs.tsx';
import type { HomeStackParamList } from '@/app/navigation/types/home-types.ts';
import { useNav } from '@/app/navigation/options/navigation.ts';

const Stack = createNativeStackNavigator<HomeStackParamList>();

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
