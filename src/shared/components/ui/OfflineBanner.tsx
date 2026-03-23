import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useOnlineStatus } from '@/shared/hooks/useOnlineStatus'
import { useTheme } from '@/shared/theme'
import { Text } from './Text'

type Props = {
  testID?: string
  /** Translated message — pass via t('common.offline_banner') at the call site. */
  message?: string
}

const DEFAULT_MESSAGE = "You're offline. Showing cached data."

export function OfflineBanner({ testID, message = DEFAULT_MESSAGE }: Props) {
  const { theme } = useTheme()
  const { isOffline } = useOnlineStatus()

  if (!isOffline) return null

  return (
    <View
      testID={testID}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surfaceSecondary,
          borderColor: theme.colors.divider,
          paddingHorizontal: theme.spacing.sm,
          paddingVertical: theme.spacing.xs,
        },
      ]}
    >
      <Text
        style={[
          theme.typography.labelMedium,
          { color: theme.colors.textPrimary },
        ]}
        numberOfLines={1}
      >
        {message}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
})
