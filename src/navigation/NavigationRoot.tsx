import type { NavigationState, PartialState } from '@react-navigation/native'
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Linking, Platform, useColorScheme } from 'react-native'
import BootSplash from 'react-native-bootsplash'

import { navigationRef } from '@/navigation/helpers/navigation-helpers'
import {
  loadPersistedNavigationState,
  persistNavigationState,
} from '@/navigation/persistence/navigation-persistence'
import { RootNavigator } from '@/navigation/root/root-navigator'
import { ThemedStatusBar } from '@/shared/components/ui/ThemedStatusBar'
import { useTheme } from '@/shared/theme'

/**
 * Navigation + StatusBar wired to app theme (inside ThemeProvider).
 * Persists root navigation state to MMKV unless a cold-start deep link is present.
 * @see https://reactnavigation.org/docs/state-persistence/
 */
export function NavigationRoot() {
  const { theme, mode } = useTheme()
  const systemScheme = useColorScheme()
  const isDark =
    mode === 'dark' || (mode === 'system' && systemScheme === 'dark')

  const [isReady, setIsReady] = useState(Platform.OS === 'web')
  const [initialState, setInitialState] = useState<
    NavigationState | PartialState<NavigationState> | undefined
  >(undefined)

  useEffect(() => {
    if (Platform.OS === 'web') {
      return
    }

    let cancelled = false

    const restore = async () => {
      try {
        const url = await Linking.getInitialURL()
        if (url != null) {
          return
        }
        const restored = loadPersistedNavigationState()
        if (!cancelled && restored !== undefined) {
          setInitialState(restored)
        }
      } finally {
        if (!cancelled) {
          setIsReady(true)
        }
      }
    }

    restore().catch(() => undefined)

    return () => {
      cancelled = true
    }
  }, [])

  const onStateChange = useCallback((state: NavigationState | undefined) => {
    persistNavigationState(state)
  }, [])

  const navigationTheme = useMemo(
    () => ({
      ...(isDark ? DarkTheme : DefaultTheme),
      dark: isDark,
      colors: {
        ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
        primary: theme.colors.primary,
        background: theme.colors.background,
        card: theme.colors.surface,
        text: theme.colors.textPrimary,
        border: theme.colors.border,
        notification: theme.colors.danger,
      },
    }),
    [isDark, theme],
  )

  if (!isReady) {
    return <ThemedStatusBar />
  }

  return (
    <>
      <ThemedStatusBar />
      <NavigationContainer
        ref={navigationRef}
        theme={navigationTheme}
        initialState={initialState}
        onStateChange={onStateChange}
        onReady={() => BootSplash.hide({ fade: true })}
      >
        <RootNavigator />
      </NavigationContainer>
    </>
  )
}
