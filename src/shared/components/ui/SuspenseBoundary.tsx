/**
 * `React.Suspense` with a theme-aware default fallback (`ActivityIndicator`).
 * Use with `useSuspenseQuery` or `React.lazy` children. Must be under `ThemeProvider`.
 */

import React, { Suspense } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { spacing } from '@/shared/theme/tokens/spacing'
import { useTheme } from '@/shared/theme/useTheme'

// Minimum height for the loading fallback: gives the spinner visual breathing room.
// Derived from spacing tokens: spacing.xxxl * 3 = 40 * 3 = 120
const FALLBACK_MIN_HEIGHT = spacing.xxxl * 3

function DefaultFallback({ label }: { label: string }) {
  const { theme } = useTheme()
  return (
    <View
      style={[styles.center, { padding: theme.spacing.lg }]}
      accessibilityRole="progressbar"
      accessibilityLabel={label}
    >
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  )
}

export function SuspenseBoundary({
  children,
  fallback,
  loadingLabel = 'Loading',
}: {
  children: React.ReactNode
  fallback?: React.ReactNode
  /** Translated loading label for screen readers — pass via t('common.loading'). */
  loadingLabel?: string
}) {
  return (
    <Suspense fallback={fallback ?? <DefaultFallback label={loadingLabel} />}>
      {children}
    </Suspense>
  )
}

const styles = StyleSheet.create({
  center: {
    minHeight: FALLBACK_MIN_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
