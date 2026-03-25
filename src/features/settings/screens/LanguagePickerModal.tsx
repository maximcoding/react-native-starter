// src/features/settings/screens/LanguagePickerModal.tsx

import { IconName } from '@assets/icons'
import React, { memo, useCallback } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import i18n from '@/i18n/i18n'
import { useT } from '@/i18n/useT'
import { goBack } from '@/navigation/helpers/navigation-helpers'
import HalfSheet from '@/shared/components/ui/HalfSheet'
import { IconSvg } from '@/shared/components/ui/IconSvg'
import { Text } from '@/shared/components/ui/Text'
import { useTheme } from '@/shared/theme/useTheme'

const LANGUAGE_OPTIONS: {
  code: string
  labelKey:
    | 'settings.language.english'
    | 'settings.language.russian'
    | 'settings.language.german'
  abbr: string
}[] = [
  { code: 'en', labelKey: 'settings.language.english', abbr: 'EN' },
  { code: 'ru', labelKey: 'settings.language.russian', abbr: 'RU' },
  { code: 'de', labelKey: 'settings.language.german', abbr: 'DE' },
]

// ─── Item ─────────────────────────────────────────────────────────────────────

interface LanguageOptionRowProps {
  opt: (typeof LANGUAGE_OPTIONS)[number]
  selected: boolean
  onSelect: (code: string) => void
}

const LanguageOptionRow = memo(function LanguageOptionRow({
  opt,
  selected,
  onSelect,
}: LanguageOptionRowProps) {
  const t = useT()
  const { theme } = useTheme()
  const c = theme.colors
  const sp = theme.spacing
  const r = theme.radius
  const ty = theme.typography

  const handlePress = useCallback(
    () => onSelect(opt.code),
    [opt.code, onSelect],
  )

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={t(opt.labelKey)}
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: selected
            ? c.primaryAmbient
            : pressed
              ? c.surfaceSecondary
              : c.surface,
          borderColor: selected ? c.primary : c.border,
          borderRadius: r.xl,
          paddingVertical: sp.md,
          paddingHorizontal: sp.md,
        },
      ]}
    >
      <View
        style={[
          styles.badge,
          {
            backgroundColor: c.surfaceSecondary,
            borderRadius: r.sm,
            paddingHorizontal: sp.xs,
            paddingVertical: sp.xxs,
          },
        ]}
      >
        <Text style={[ty.labelSmall, { color: c.textSecondary }]}>
          {opt.abbr}
        </Text>
      </View>
      <Text
        style={[
          ty.bodyMedium,
          {
            flex: 1,
            color: selected ? c.primary : c.textPrimary,
            marginLeft: sp.sm,
          },
        ]}
      >
        {t(opt.labelKey)}
      </Text>
      {selected ? (
        <IconSvg
          name={IconName.CHECK}
          size={18}
          color={c.primary}
          style={{ width: 18, height: 18 }}
        />
      ) : null}
    </Pressable>
  )
})

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function LanguagePickerModal() {
  const t = useT()
  const { theme } = useTheme()
  const c = theme.colors
  const sp = theme.spacing
  const ty = theme.typography

  const currentLang = i18n.language

  const handleClose = useCallback(() => goBack(), [])

  const handleSelect = useCallback((code: string) => {
    i18n.changeLanguage(code)
    goBack()
  }, [])

  return (
    <HalfSheet onClose={handleClose}>
      <Text
        style={[ty.titleMedium, { color: c.textPrimary, marginBottom: sp.md }]}
      >
        {t('settings.language.label')}
      </Text>

      <View style={{ gap: sp.xs }}>
        {LANGUAGE_OPTIONS.map(opt => (
          <LanguageOptionRow
            key={opt.code}
            opt={opt}
            selected={currentLang === opt.code}
            onSelect={handleSelect}
          />
        ))}
      </View>
    </HalfSheet>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})
