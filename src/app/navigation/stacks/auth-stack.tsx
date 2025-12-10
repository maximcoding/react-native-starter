import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ROUTES } from '@/app/navigation/routes.ts';
import { useNav } from '@/app/navigation/options/navigation.ts';
import type { AuthStackParamList } from '@/app/navigation/types/auth-types.ts';
import AuthScreen from '@/features/auth/screens/AuthScreen.tsx';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack() {
  const nav = useNav();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ROUTES.AUTH_LOGIN}
        component={AuthScreen}
        options={nav.stack(ROUTES.AUTH_LOGIN)}
      />
    </Stack.Navigator>
  );
}
