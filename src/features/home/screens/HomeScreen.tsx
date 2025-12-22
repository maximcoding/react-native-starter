// src/features/home/screens/HomeScreen.tsx

import React from 'react';
import { View, Pressable } from 'react-native';

import ScreenWrapper from '@/app/components/ScreenWrapper';
import { Text } from '@/app/components/Text';

import { useTheme } from '@/core/theme/useTheme';
import { useT } from '@/core/i18n/useT';

import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ROUTES } from '@/app/navigation/routes';
import type { RootStackParamList } from '@/app/navigation';

import { useMeQuery } from '@/features/user/hooks/useMeQuery';
import { performLogout } from '@/core/session/logout';
import { normalizeError } from '@/infra/error/normalize-error';

export default function HomeScreen() {
  const { theme } = useTheme();
  const t = useT();
  const nav = useNavigation<NavigationProp<RootStackParamList>>();

  const me = useMeQuery();

  const errorText = me.error ? normalizeError(me.error).message : null;

  return (
    <ScreenWrapper>
      <View style={{ padding: theme.spacing.lg, gap: theme.spacing.md }}>
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
          }}
        >
          {t('home.subtitle')}
        </Text>

        {/* ✅ auth check visible */}
        <View
          style={{
            marginTop: theme.spacing.md,
            padding: theme.spacing.md,
            borderRadius: theme.radius.md,
            backgroundColor: theme.colors.surface,
          }}
        >
          {me.isLoading ? (
            <Text style={{ color: theme.colors.textSecondary }}>
              {t('common.loading')}
            </Text>
          ) : errorText ? (
            <Text style={{ color: theme.colors.textSecondary }}>
              {t('common.error')}: {errorText}
            </Text>
          ) : me.data ? (
            <>
              <Text style={{ color: theme.colors.textPrimary }}>
                Me: {me.data.name}
              </Text>
              {me.data.email ? (
                <Text style={{ color: theme.colors.textSecondary }}>
                  {me.data.email}
                </Text>
              ) : null}
            </>
          ) : (
            <Text style={{ color: theme.colors.textSecondary }}>
              {t('common.no_data')}
            </Text>
          )}
        </View>

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

        {/* ✅ Logout */}
        <Pressable
          onPress={() => performLogout()}
          style={{
            marginTop: theme.spacing.md,
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.md,
            paddingVertical: theme.spacing.md,
            paddingHorizontal: theme.spacing.lg,
            borderWidth: 1,
            borderColor: theme.colors.border ?? theme.colors.textSecondary,
          }}
        >
          <Text
            style={{
              ...theme.typography.labelLarge,
              color: theme.colors.textPrimary,
              textAlign: 'center',
            }}
          >
            {t('auth.logout') ?? 'Logout'}
          </Text>
        </Pressable>
      </View>
    </ScreenWrapper>
  );
}
