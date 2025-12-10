/**
 * FILE: onboarding-stack.tsx
 * LAYER: navigation/stacks/onboarding
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ROUTES } from '@/app/navigation/routes.ts';
import OnboardingScreen from '@/features/settings/screens/OnboardingScreen.tsx';

const Stack = createNativeStackNavigator();

export default function OnboardingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name={ROUTES.ONBOARDING_MAIN}
        component={OnboardingScreen}
      />
    </Stack.Navigator>
  );
}
