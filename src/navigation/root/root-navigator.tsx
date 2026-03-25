// src/navigation/root/root-navigator.tsx

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import AuthScreen from '@/features/auth/screens/AuthScreen'
import HomeScreen from '@/features/home/screens/HomeScreen'
import StoryScreen from '@/features/home/screens/StoryScreen'
import LanguagePickerModal from '@/features/settings/screens/LanguagePickerModal'
import OnboardingScreen from '@/features/settings/screens/OnboardingScreen'
import SettingsScreen from '@/features/settings/screens/SettingsScreen'
import ThemePickerModal from '@/features/settings/screens/ThemePickerModal'
import type { HomeTabParamList, RootStackParamList } from '@/navigation/root-param-list'
import { ROUTES } from '@/navigation/routes'
import { AnimatedTabBar } from '@/navigation/tabs/AnimatedTabBar'
import { useInitialRoute } from '@/session/useInitialRoute'

const HALF_SHEET_OPTIONS = {
  presentation: 'transparentModal',
  animation: 'none',
  gestureEnabled: false,
} as const

const Tab = createBottomTabNavigator<HomeTabParamList>()
const Stack = createNativeStackNavigator<RootStackParamList>()

function HomeTabs() {
  return (
    <Tab.Navigator
      tabBar={props => <AnimatedTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name={ROUTES.TAB_HOME} component={HomeScreen} />
      <Tab.Screen name={ROUTES.TAB_SETTINGS} component={SettingsScreen} />
    </Tab.Navigator>
  )
}

export function RootNavigator() {
  const initialRoute = useInitialRoute()

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name={ROUTES.ROOT_ONBOARDING} component={OnboardingScreen} />
      <Stack.Screen name={ROUTES.ROOT_AUTH} component={AuthScreen} />
      <Stack.Screen name={ROUTES.ROOT_APP} component={HomeTabs} />
      <Stack.Screen name={ROUTES.HOME_STORY} component={StoryScreen} />
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
