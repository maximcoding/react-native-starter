import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Text } from '@/shared/components/ui/Text'
import { useTheme } from '@/shared/theme/useTheme'

interface SettingsSectionProps {
  title?: string
  children: React.ReactNode
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  const { theme } = useTheme()

  const childArray = React.Children.toArray(children).filter(Boolean)

  return (
    <View style={{ gap: theme.spacing.xs }}>
      {title != null ? (
        <Text
          style={[
            theme.typography.caps,
            {
              color: theme.colors.textTertiary,
              paddingHorizontal: theme.spacing.md,
            },
          ]}
        >
          {title}
        </Text>
      ) : null}

      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.xl,
            ...theme.elevation.card,
          },
        ]}
      >
        {childArray.map((child, idx) => (
          <React.Fragment key={idx}>
            {child}
            {idx < childArray.length - 1 ? (
              <View
                style={{
                  height: 1,
                  backgroundColor: theme.colors.border,
                  marginHorizontal: theme.spacing.md,
                }}
              />
            ) : null}
          </React.Fragment>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
})
