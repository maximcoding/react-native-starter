/**
 * FILE: Text.tsx
 * LAYER: app/components/ui
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Unified Text component powered by theme typography + colors.
 *
 * RULES:
 *   - Default typography → bodyMedium
 *   - Default color → textPrimary
 *   - User style overrides merged last
 *   - Supports arrays, cleans false/null values
 * ---------------------------------------------------------------------
 *
 * USAGE:
 *   <Text style={theme.typography.headlineLarge}>Title</Text>
 *   <Text style={theme.typography.bodyLarge}>Paragraph</Text>
 *   <Text style={theme.typography.labelSmall}>Button Text</Text>
 *   <Text style={theme.typography.caps}>UPPER LABEL</Text>
 * ---------------------------------------------------------------------
 */

import React from 'react';
import {
  Text as RNText,
  TextProps,
  TextStyle,
  StyleProp,
} from 'react-native';
import { useTheme } from '@/core/theme/useTheme.ts';

export type UITextProps = Omit<TextProps, 'style'> & {
  style?: StyleProp<TextStyle>;
};

function normalizeStyle(style: StyleProp<TextStyle>): StyleProp<TextStyle> {
  if (!Array.isArray(style)) return style;
  return style.filter(Boolean) as StyleProp<TextStyle>;
}

export function Text({ style, ...rest }: UITextProps) {
  const { theme } = useTheme();

  return (
    <RNText
      {...rest}
      style={normalizeStyle([
        {
          ...theme.typography.bodyMedium,
          color: theme.colors.textPrimary,
        },
        style,
      ])}
    />
  );
}
