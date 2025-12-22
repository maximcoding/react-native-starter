/**
 * FILE: OnboardingScreen.tsx
 * LAYER: features/onboarding/screens
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';

import { Text } from '@/app/components/Text';
import { Button } from '@/app/components/Button';
import ScreenWrapper from '@/app/components/ScreenWrapper';

import { useT } from '@/core/i18n/useT';
import { setOnboardingDone } from '@/core/session/bootstrap';

import { resetRoot } from '@/app/navigation/helpers/navigation-helpers';
import { ROUTES } from '@/app/navigation/routes';

export default function OnboardingScreen() {
  const t = useT();

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>{t('onboarding.welcome')}</Text>

        <Button
          title={t('onboarding.continue')}
          variant="primary"
          onPress={() => {
            // 1) mark onboarding completed
            setOnboardingDone();

            // 2) go to Auth root (clean history)
            resetRoot({
              index: 0,
              routes: [{ name: ROUTES.ROOT_AUTH as never }],
            });
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
