import { IconName } from '@assets/icons'
import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { IconSvg } from '@/shared/components/ui/IconSvg'
import { Text } from '@/shared/components/ui/Text'
import { useTheme } from '@/shared/theme/useTheme'

interface SettingsRowProps {
  label: string
  value?: string
  onPress?: () => void
  danger?: boolean
  icon?: IconName
  iconBg?: string
  iconColor?: string
}

export function SettingsRow({
  label,
  value,
  onPress,
  danger,
  icon,
  iconBg,
  iconColor,
}: SettingsRowProps) {
  const { theme } = useTheme()

  const labelColor = danger ? theme.colors.danger : theme.colors.textPrimary
  const chevronColor = theme.colors.textTertiary
  const resolvedIconColor =
    iconColor ?? (danger ? theme.colors.danger : theme.colors.textPrimary)

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : 'none'}
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.row,
        {
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.md,
        },
        pressed && { backgroundColor: theme.colors.overlayLight },
      ]}
    >
      {icon != null ? (
        <View
          style={[
            styles.iconBadge,
            {
              width: theme.spacing.xl,
              height: theme.spacing.xl,
              borderRadius: theme.radius.md,
              backgroundColor: iconBg ?? theme.colors.surfaceSecondary,
              marginRight: theme.spacing.sm,
            },
          ]}
        >
          <IconSvg name={icon} size={16} color={resolvedIconColor} />
        </View>
      ) : null}

      <Text
        style={[theme.typography.bodyMedium, { color: labelColor, flex: 1 }]}
      >
        {label}
      </Text>

      {value != null || onPress != null ? (
        <View style={styles.trailing}>
          {value != null ? (
            <Text
              style={[
                theme.typography.bodyMedium,
                { color: theme.colors.textTertiary },
              ]}
            >
              {value}
            </Text>
          ) : null}
          {onPress != null ? (
            <Text
              style={[
                theme.typography.bodyMedium,
                {
                  color: chevronColor,
                  marginLeft: theme.spacing.xxs,
                },
              ]}
            >
              {'\u203A'}
            </Text>
          ) : null}
        </View>
      ) : null}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 56,
  },
  trailing: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBadge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})
