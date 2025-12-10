import React from 'react';
import { View, StyleSheet } from 'react-native';
import ScreenWrapper from '@/app/components/ScreenWrapper';
import { Text } from '@/app/components/Text.tsx';
import { Button } from '@/app/components/Button.tsx';
import { useT } from '@/core/i18n/useT';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ROUTES } from '@/app/navigation/routes';
import { RootStackParamList } from '@/app/navigation';

export default function AuthScreen() {
  const t = useT();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleLogin = () => {
    // Here you would normally set auth store/session token.
    // For now we just navigate to authenticated app flow:

    navigation.reset({
      index: 0,
      routes: [{ name: ROUTES.ROOT_APP }],
    });
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>{t('auth.title')}</Text>

        <Button
          title={t('auth.login')}
          variant="primary"
          onPress={handleLogin}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { marginBottom: 24 },
});
