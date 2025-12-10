/**
 * FILE: OnboardingScreen.tsx
 * LAYER: features/onboarding/screens
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/app/components/Text.tsx';
import { Button } from '@/app/components/Button.tsx';
import { useT } from '@/core/i18n/useT';
import ScreenWrapper from '@/app/components/ScreenWrapper.tsx';
import { ROUTES } from '@/app/navigation/routes.ts';
import { useNavigation } from '@react-navigation/native';

export default function OnboardingScreen() {
  const t = useT();
  const navigation = useNavigation(); // ← добавили

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>{t('onboarding.welcome')}</Text>

        <Button
          title={t('onboarding.continue')}
          variant="primary"
          onPress={() => {
            navigation.replace(ROUTES.ROOT_AUTH);
          }}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { marginBottom: 24 },
});
