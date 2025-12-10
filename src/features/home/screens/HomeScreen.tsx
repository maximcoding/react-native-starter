import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/app/components/Text.tsx';
import { useTheme } from '@/core/theme/useTheme.ts';
import { useT } from '@/core/i18n/useT.ts';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '@/app/navigation/routes.ts';
import ScreenWrapper from '@/app/components/ScreenWrapper.tsx';

export default function HomeScreen() {
  const { theme } = useTheme();
  const t = useT();
  const nav = useNavigation();

  return (
    <ScreenWrapper>
      <View style={{ padding: theme.spacing.lg }}>
        <Text
          style={{
            ...theme.typography.displaySmall,
            color: theme.colors.textPrimary,
          }}
        >
          {t('home.title')}
        </Text>

        <Text
          style={{
            ...theme.typography.bodyLarge,
            color: theme.colors.textSecondary,
            marginTop: theme.spacing.md,
          }}
        >
          {t('home.subtitle')}
        </Text>

        <Pressable
          onPress={() => nav.navigate(ROUTES.TAB_SETTINGS as never)}
          style={{
            marginTop: theme.spacing.xl,
            backgroundColor: theme.colors.primary,
            borderRadius: theme.radius.md,
            paddingVertical: theme.spacing.md,
            paddingHorizontal: theme.spacing.lg,
          }}
        >
          <Text
            style={{
              ...theme.typography.labelLarge,
              color: theme.colors.textPrimary,
              textAlign: 'center',
            }}
          >
            {t('home.go_settings')}
          </Text>
        </Pressable>
      </View>
    </ScreenWrapper>
  );
}
