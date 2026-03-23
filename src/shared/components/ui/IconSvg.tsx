import { AppIcon, IconName } from '@assets/icons'
import React from 'react'
import { View, type ViewStyle } from 'react-native'
import { useTheme } from '@/shared/theme'
import { spacing } from '@/shared/theme/tokens/spacing'

// spacing.xl = 24 — standard icon touch-safe size
const DEFAULT_ICON_SIZE = spacing.xl
const DEFAULT_STROKE_WIDTH = 2

interface Props {
  name: IconName
  size?: number
  /** Defaults to theme.colors.textPrimary when not provided. */
  color?: string
  style?: ViewStyle
}

export function IconSvg({
  name,
  size = DEFAULT_ICON_SIZE,
  color,
  style,
}: Props) {
  const { theme } = useTheme()
  const iconColor = color ?? theme.colors.textPrimary
  const IconComponent = AppIcon[name]

  if (!IconComponent) {
    if (__DEV__) {
      console.warn(`[IconSvg] icon "${name}" not found in AppIcon`)
    }
    return <View style={{ width: size, height: size }} />
  }

  return (
    <View style={style}>
      <IconComponent
        width={size}
        height={size}
        color={iconColor}
        stroke={iconColor}
        fill="none"
        strokeWidth={DEFAULT_STROKE_WIDTH}
      />
    </View>
  )
}
