/**
 * FILE: Button.tsx
 * LAYER: app/components/ui
 *
 * VARIANTS: primary | secondary | outline
 * SIZES:    md (44pt touch target) | lg (52pt CTA)
 */

import React from 'react'
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native'
import { useTheme } from '@/shared/theme/useTheme'
import { Text } from './Text'

type ButtonVariant = 'primary' | 'secondary' | 'outline'
type ButtonSize = 'md' | 'lg'

// Touch-target heights (WCAG / HIG: 44pt minimum; 52pt for primary CTAs).
// Not in the general spacing scale — intentional design values.
const BUTTON_HEIGHT_MD = 44
const BUTTON_HEIGHT_LG = 52

// Interaction opacities
const OPACITY_DISABLED = 0.55
const OPACITY_PRESSED = 0.85

// Outline border weight (not a hairline — needs visual presence)
const OUTLINE_BORDER_WIDTH = 1

interface ButtonProps {
  title: string
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  disabled?: boolean
  onPress?: () => void
  onPressIn?: () => void
  onPressOut?: () => void
  style?: ViewStyle
  textStyle?: TextStyle
  testID?: string
}

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onPress,
  onPressIn,
  onPressOut,
  style,
  textStyle,
  testID,
}: ButtonProps) {
  const { theme } = useTheme()

  const height = size === 'lg' ? BUTTON_HEIGHT_LG : BUTTON_HEIGHT_MD
  const paddingH = size === 'lg' ? theme.spacing.lg : theme.spacing.md
  const isInactive = disabled || loading

  const variantStyle: ViewStyle = (() => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: disabled
            ? theme.colors.overlayMedium
            : theme.colors.primary,
        }
      case 'secondary':
        return { backgroundColor: theme.colors.surfaceSecondary }
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: OUTLINE_BORDER_WIDTH,
          borderColor: disabled ? theme.colors.divider : theme.colors.primary,
        }
    }
  })()

  const textColor: string = (() => {
    switch (variant) {
      case 'primary':
        return disabled ? theme.colors.textSecondary : theme.colors.onPrimary
      case 'secondary':
        return theme.colors.textPrimary
      case 'outline':
        return disabled ? theme.colors.textTertiary : theme.colors.primary
    }
  })()

  const containerStyle: ViewStyle = {
    ...styles.base,
    height,
    paddingHorizontal: paddingH,
    borderRadius: theme.radius.md,
    opacity: disabled ? OPACITY_DISABLED : 1,
    ...variantStyle,
    ...style,
  }

  return (
    <Pressable
      testID={testID}
      onPress={isInactive ? undefined : onPress}
      onPressIn={isInactive ? undefined : onPressIn}
      onPressOut={isInactive ? undefined : onPressOut}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isInactive }}
      style={({ pressed }) => [
        containerStyle,
        pressed && { opacity: disabled ? OPACITY_DISABLED : OPACITY_PRESSED },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text
          style={[theme.typography.labelLarge, { color: textColor }, textStyle]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})
