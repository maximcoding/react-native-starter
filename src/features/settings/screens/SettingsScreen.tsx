/**
 * FILE: SettingsScreen.tsx
 * PURPOSE:
 *   Settings hub screen where user can:
 *     - change language
 *     - change theme (light / dark / system)
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '@/app/components/Button.tsx';
import { useTheme } from '@/core/theme/useTheme';
import i18n from '@/core/i18n/i18n';

export default function SettingsScreen() {
  const { theme, mode, setTheme } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* --- LANGUAGE SELECT --- */}
      <Button
        title="English"
        variant="secondary"
        onPress={() => i18n.changeLanguage('en')}
      />

      <Button
        title="Русский"
        variant="secondary"
        onPress={() => i18n.changeLanguage('ru')}
      />

      <Button
        title="Deutsch"
        variant="secondary"
        onPress={() => i18n.changeLanguage('de')}
      />

      {/* --- THEME SWITCH --- */}
      <Button
        title={`Theme: ${mode}`}
        variant="outline"
        onPress={() => {
          const next =
            mode === 'light' ? 'dark' : mode === 'dark' ? 'system' : 'light';
          setTheme(next);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
});
