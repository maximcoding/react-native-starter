import { useIsFocused } from '@react-navigation/native'
import React from 'react'
import { ThemedStatusBar, type ThemedStatusBarProps } from './ThemedStatusBar'

/**
 * Renders {@link ThemedStatusBar} only when the screen is focused — required for tabs/drawers
 * where sibling screens stay mounted.
 *
 * ⚠️ Must be rendered inside a React Navigation `NavigationContainer` — `useIsFocused` will
 * throw if called outside a navigation context. `ScreenWrapper` satisfies this by design
 * (all screens render inside `NavigationRoot`).
 *
 * @see https://reactnavigation.org/docs/status-bar
 */
export function FocusAwareStatusBar(props: ThemedStatusBarProps) {
  const isFocused = useIsFocused()
  if (!isFocused) {
    return null
  }
  return <ThemedStatusBar {...props} />
}
