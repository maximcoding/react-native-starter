/**
 * FILE: root-navigator.tsx
 * LAYER: navigation/root
 */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ROUTES } from '@/app/navigation/routes.ts';
import AuthStack from '@/app/navigation/stacks/auth-stack.tsx';
import OnboardingStack from '@/app/navigation/stacks/onboarding-stack.tsx';
import HomeTabs from '@/app/navigation/tabs/home-tabs.tsx';
import { RootStackParamList } from '@/app/navigation';

import { useBootstrapRoute } from '@/core/session/useBootstrapRoute';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const boot = useBootstrapRoute();

  // TODO: replace with your Splash component
  if (!boot) return null;

  // Map bootstrap route to ROUTES constants
  const initialRouteName =
    boot === 'ROOT_APP'
      ? ROUTES.ROOT_APP
      : boot === 'ROOT_AUTH'
      ? ROUTES.ROOT_AUTH
      : ROUTES.ROOT_ONBOARDING;

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name={ROUTES.ROOT_ONBOARDING} component={OnboardingStack} />
      <Stack.Screen name={ROUTES.ROOT_AUTH} component={AuthStack} />
      <Stack.Screen name={ROUTES.ROOT_APP} component={HomeTabs} />
    </Stack.Navigator>
  );
}
