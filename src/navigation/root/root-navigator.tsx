/**
 * FILE: root-navigator.tsx
 * LAYER: navigation/root
 */

import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import LanguagePickerModal from '@/features/settings/screens/LanguagePickerModal'
import ThemePickerModal from '@/features/settings/screens/ThemePickerModal'
import { RootStackParamList } from '@/navigation'
import { ROUTES } from '@/navigation/routes'
import AuthStack from '@/navigation/stacks/auth-stack'
import OnboardingStack from '@/navigation/stacks/onboarding-stack'
import HomeTabs from '@/navigation/tabs/home-tabs'

import { useBootstrapRoute } from '@/session/useBootstrapRoute'

const Stack = createNativeStackNavigator<RootStackParamList>()

const HALF_SHEET_OPTIONS = {
  presentation: 'transparentModal',
  animation: 'none',
  gestureEnabled: false,
} as const

export default function RootNavigator() {
  const boot = useBootstrapRoute()

  return (
    <Stack.Navigator
      initialRouteName={boot}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name={ROUTES.ROOT_ONBOARDING} component={OnboardingStack} />
      <Stack.Screen name={ROUTES.ROOT_AUTH} component={AuthStack} />
      <Stack.Screen name={ROUTES.ROOT_APP} component={HomeTabs} />
      <Stack.Screen
        name={ROUTES.MODAL_THEME_PICKER}
        component={ThemePickerModal}
        options={HALF_SHEET_OPTIONS}
      />
      <Stack.Screen
        name={ROUTES.MODAL_LANGUAGE_PICKER}
        component={LanguagePickerModal}
        options={HALF_SHEET_OPTIONS}
      />
    </Stack.Navigator>
  )
}
