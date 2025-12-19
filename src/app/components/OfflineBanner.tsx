// src/app/components/OfflineBanner.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/core/theme';
import { useOnlineStatus } from '@/app/hooks/useOnlineStatus';

type Props = { testID?: string };

export function OfflineBanner({ testID }: Props) {
  const { theme } = useTheme();
  const { isOffline } = useOnlineStatus();

  if (!isOffline) return null;

  // Use existing color tokens (no 'card' / 'border' assumptions)
  const bg = theme.colors.surfaceSecondary ?? theme.colors.background;
  const border = theme.colors.surface ?? theme.colors.background;
  const fg = theme.colors.textPrimary;

  return (
    <View
      testID={testID}
      style={[
        styles.container,
        {
          backgroundColor: bg,
          borderColor: border,
        },
      ]}
    >
      <Text style={[styles.text, { color: fg }]} numberOfLines={1}>
        You’re offline. Showing cached data.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  text: {
    fontSize: 13,
  },
});
