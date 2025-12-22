// src/features/auth/screens/AuthScreen.tsx

import React, { useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';

import ScreenWrapper from '@/app/components/ScreenWrapper';
import { Text } from '@/app/components/Text';
import { Button } from '@/app/components/Button';

import { useT } from '@/core/i18n/useT';
import { ROUTES } from '@/app/navigation/routes';
import { resetRoot } from '@/app/navigation/helpers/navigation-helpers';

import { useLoginMutation } from '@/features/auth/hooks/useLoginMutation';
import { showErrorToast } from '@/core/ui/toast';
import { normalizeError } from '@/infra/error/normalize-error';

export default function AuthScreen() {
  const t = useT();
  const login = useLoginMutation();

  // TODO: заменить на Input из UI kit когда он будет готов
  const [email] = useState('test@example.com');
  const [password] = useState('password');

  const disabled = useMemo(() => {
    return login.isPending || !email.trim() || !password.trim();
  }, [login.isPending, email, password]);

  const handleLogin = async () => {
    try {
      await login.mutateAsync({ email, password });

      resetRoot({
        index: 0,
        routes: [{ name: ROUTES.ROOT_APP as never }],
      });
    } catch (e) {
      showErrorToast(normalizeError(e));
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>{t('auth.title')}</Text>

        <Button
          title={login.isPending ? t('common.loading') : t('auth.login')}
          variant="primary"
          disabled={disabled}
          onPress={() => void handleLogin()}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { marginBottom: 24 },
});
