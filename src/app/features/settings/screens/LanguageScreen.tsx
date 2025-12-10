import React from 'react';
import { View, StyleSheet } from 'react-native';
import i18n from '@/core/i18n/i18n';
import { Button } from '@/app/components/Button.tsx';
import { useTheme } from '@/core/theme/useTheme';

export default function LanguageScreen() {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Button
        title="settings.language.english"
        onPress={() => i18n.changeLanguage('en')}
      />
      <Button
        title="settings.language.russian"
        onPress={() => i18n.changeLanguage('ru')}
      />
      <Button
        title="settings.language.german"
        onPress={() => i18n.changeLanguage('de')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 12,
  },
});
