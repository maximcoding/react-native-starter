/**
 * FILE: Button.tsx
 * LAYER: app/components/ui
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Enterprise-grade unified button component based on:
 *     - theme.semantic colors   (primary, border, overlay, textPrimary)
 *     - theme.typography        (labelLarge)
 *     - theme.spacing + radius  (layout tokens)
 *
 * GOALS:
 *   - Deterministic design system compatible with native & web design tokens.
 *   - No inline hex values, only semantic theme references.
 *   - Predictable variants + sizes.
 *   - Zero magic numbers outside token system.
 *   - Safe disabled/pressed states.
 *   - 100% accessibility readable contrast.
 *
 * VARIANTS (semantic only):
 *   primary    → solid brand button (CTA)
 *   secondary  → neutral surface button
 *   outline    → transparent button with semantic border
 *
 * SIZES:
 *   md → default height (44)
 *   lg → CTA / primary action height (52)
 *
 * EXAMPLES:
 *   <Button
 *     title={t('auth.login')}
 *     variant="primary"
 *     size="lg"
 *     onPress={handleLogin}
 *   />
 *
 *   <Button
 *     title={t('common.cancel')}
 *     variant="secondary"
 *   />
 *
 *   <Button
 *     title={t('common.delete')}
 *     variant="outline"
 *     disabled
 *   />
 *
 * DESIGN RULES:
 *   - Typography always labelLarge unless overridden.
 *   - Pressed state = slight opacity (0.85).
 *   - Disabled state = reduced opacity + semantic muted colors.
 *
 * EXTENSION:
 *   - Add destructive variant (danger) using theme.colors.danger.
 *   - Add "ghost" variant (transparent, no border).
 *   - Add icon support: left/right icon slots.
 *   - Add fullWidth, compact, pill shapes.
 * ---------------------------------------------------------------------
 */

import React from 'react';
import {
  Pressable,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '@/core/theme/useTheme.ts';
import { Text } from './Text.tsx';

type ButtonVariant = 'primary' | 'secondary' | 'outline';
type ButtonSize = 'md' | 'lg';

interface ButtonProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
                         title,
                         variant = 'primary',
                         size = 'md',
                         loading = false,
                         disabled = false,
                         onPress,
                         style,
                         textStyle,
                       }: ButtonProps) {
  const { theme } = useTheme();

  /**
   * SIZES (token-driven)
   */
  const height = size === 'lg' ? 52 : 44;
  const paddingH = size === 'lg' ? theme.spacing.lg : theme.spacing.md;

  /**
   * VARIANTS (semantic)
   */
  const variants: Record<ButtonVariant, ViewStyle> = {
    primary: {
      backgroundColor: disabled
        ? theme.colors.overlayMedium
        : theme.colors.primary,
    },

    secondary: {
      backgroundColor: disabled
        ? theme.colors.surfaceSecondary
        : theme.colors.surfaceSecondary,
    },

    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: disabled ? theme.colors.divider : theme.colors.primary,
    },
  };

  /**
   * TEXT COLORS (semantic)
   */
  const textColors: Record<ButtonVariant, string> = {
    primary: theme.colors.textPrimary,
    secondary: theme.colors.textPrimary,
    outline: theme.colors.primary,
  };

  /**
   * MERGED CONTAINER STYLE
   */
  const containerStyle: ViewStyle = {
    height,
    paddingHorizontal: paddingH,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled ? 0.55 : 1,
    ...variants[variant],
    ...style,
  };

  return (
    <Pressable
      onPress={disabled || loading ? undefined : onPress}
      style={({ pressed }) => [
        containerStyle,
        pressed && { opacity: disabled ? 0.55 : 0.85 },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColors[variant]} />
      ) : (
        <Text
          style={[
            theme.typography.labelLarge,
            { color: textColors[variant] },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}
