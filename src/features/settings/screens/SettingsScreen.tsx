import { IconName } from '@assets/icons'
import React, { useCallback, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { SettingsRow } from '@/features/settings/components/SettingsRow'
import { SettingsSection } from '@/features/settings/components/SettingsSection'
import { useMeQuery } from '@/features/user/hooks/useMeQuery'
import i18n from '@/i18n/i18n'
import { useT } from '@/i18n/useT'
import { navigate } from '@/navigation/helpers/navigation-helpers'
import { ROUTES } from '@/navigation/routes'
import { performLogout } from '@/session/logout'
import { ScreenHeader } from '@/shared/components/ui/ScreenHeader'
import { ScreenWrapper } from '@/shared/components/ui/ScreenWrapper'
import { Text } from '@/shared/components/ui/Text'
import { useTheme } from '@/shared/theme/useTheme'

const THEME_MODE_KEYS = {
  light: 'settings.theme_light',
  dark: 'settings.theme_dark',
  system: 'settings.theme_system',
} as const

const LANGUAGE_LABELS: Record<string, string> = {
  en: 'English',
  ru: 'Русский',
  de: 'Deutsch',
}

export default function SettingsScreen() {
  const { theme, mode } = useTheme()
  const t = useT()
  const me = useMeQuery()
  const c = theme.colors
  const sp = theme.spacing
  const r = theme.radius
  const ty = theme.typography

  const themeModeLabel = t(THEME_MODE_KEYS[mode])
  const currentLang = i18n.language
  const languageLabel = LANGUAGE_LABELS[currentLang] ?? currentLang

  const openThemePicker = useCallback(
    () => navigate(ROUTES.MODAL_THEME_PICKER),
    [],
  )
  const openLanguagePicker = useCallback(
    () => navigate(ROUTES.MODAL_LANGUAGE_PICKER),
    [],
  )
  const handleLogout = useCallback(() => performLogout(), [])

  const userName = me.data?.name ?? '—'
  const userEmail = me.data?.email ?? undefined

  const initials = useMemo(() => {
    if (!me.data?.name) return '?'
    return me.data.name
      .split(' ')
      .slice(0, 2)
      .map(w => w[0]?.toUpperCase())
      .join('')
  }, [me.data?.name])

  const themeIcon = mode === 'light' ? IconName.SUN : IconName.MOON

  return (
    <ScreenWrapper scroll header={<ScreenHeader title={t('settings.title')} />}>
      <View style={{ padding: sp.lg, gap: sp.lg }}>
        {/* Profile card */}
        <View
          style={[
            styles.profileCard,
            {
              backgroundColor: c.surface,
              borderRadius: r.xxl,
              padding: sp.lg,
              borderWidth: 1,
              borderColor: c.border,
              gap: sp.md,
              ...theme.elevation.card,
            },
          ]}
        >
          <View style={styles.profileRow}>
            {/* Avatar with ring */}
            <View
              style={[
                styles.avatarRing,
                {
                  width: sp.xxxxxl + sp.xs,
                  height: sp.xxxxxl + sp.xs,
                  borderRadius: r.rounded,
                  borderWidth: 2,
                  borderColor: c.primary,
                  padding: 2,
                },
              ]}
            >
              <View
                style={[
                  styles.avatar,
                  {
                    flex: 1,
                    borderRadius: r.rounded,
                    backgroundColor: c.primaryAmbient,
                  },
                ]}
              >
                <Text style={[ty.headlineSmall, { color: c.primary }]}>
                  {initials}
                </Text>
              </View>
            </View>

            {/* Name + email */}
            <View style={styles.profileInfo}>
              <Text style={[ty.titleLarge, { color: c.textPrimary }]}>
                {userName}
              </Text>
              {userEmail != null ? (
                <Text
                  style={[
                    ty.bodySmall,
                    { color: c.textSecondary, marginTop: sp.xxs },
                  ]}
                >
                  {userEmail}
                </Text>
              ) : null}
            </View>
          </View>
        </View>

        {/* Appearance */}
        <SettingsSection title={t('settings.appearance')}>
          <SettingsRow
            label={t('settings.theme')}
            value={themeModeLabel}
            icon={themeIcon}
            iconBg={c.primaryAmbient}
            iconColor={c.primary}
            onPress={openThemePicker}
          />
          <SettingsRow
            label={t('settings.language.label')}
            value={languageLabel}
            icon={IconName.GLOBE}
            iconBg={'rgba(96, 165, 250, 0.14)'}
            iconColor={c.info}
            onPress={openLanguagePicker}
          />
        </SettingsSection>

        {/* About */}
        <SettingsSection title={t('settings.about')}>
          <SettingsRow
            label={t('settings.version')}
            value="0.0.1"
            icon={IconName.INFO}
            iconBg={c.surfaceSecondary}
            iconColor={c.textSecondary}
          />
        </SettingsSection>

        {/* Logout */}
        <SettingsSection>
          <SettingsRow
            label={t('settings.logout')}
            icon={IconName.LOGOUT}
            iconBg={'rgba(251, 113, 133, 0.14)'}
            iconColor={c.danger}
            danger
            onPress={handleLogout}
          />
        </SettingsSection>
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  profileCard: {
    overflow: 'hidden',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarRing: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
})
