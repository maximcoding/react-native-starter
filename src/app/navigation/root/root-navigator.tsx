/**
 * FILE: root-navigator.tsx
 * LAYER: navigation/root
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ROUTES } from '@/app/navigation/routes.ts';
import AuthStack from '@/app/navigation/stacks/auth-stack.tsx';
import { RootStackParamList } from '@/app/navigation';
import OnboardingStack from '@/app/navigation/stacks/onboarding-stack.tsx';
import HomeTabs from '@/app/navigation/tabs/home-tabs.tsx';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.ROOT_ONBOARDING} component={OnboardingStack} />
      <Stack.Screen name={ROUTES.ROOT_AUTH} component={AuthStack} />
      <Stack.Screen name={ROUTES.ROOT_APP} component={HomeTabs} />
    </Stack.Navigator>
  );
}
