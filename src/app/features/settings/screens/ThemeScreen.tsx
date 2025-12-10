/**
 * FILE: ThemeScreen.tsx
 * LAYER: app/features/settings/screens
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '@/app/components/Button.tsx';
import { useTheme } from '@/core/theme/useTheme';
import type { ThemeMode } from '@/core/theme/ThemeContext';

export default function ThemeScreen() {
  const { mode, setTheme } = useTheme();

  const modes: ThemeMode[] = ['light', 'dark', 'system'];

  return (
    <View style={styles.container}>
      {modes.map(m => (
        <Button key={m} title={m.toUpperCase()} onPress={() => setTheme(m)} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 12,
  },
});
