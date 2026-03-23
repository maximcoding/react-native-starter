// src/features/settings/screens/LanguagePickerModal.tsx

import React, { useCallback } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import Svg, { Polyline } from 'react-native-svg'
import i18n from '@/i18n/i18n'
import { useT } from '@/i18n/useT'
import { goBack } from '@/navigation/helpers/navigation-helpers'
import HalfSheet from '@/navigation/modals/half-sheet'
import { Text } from '@/shared/components/ui/Text'
import { useTheme } from '@/shared/theme/useTheme'

const LANGUAGE_OPTIONS: {
  code: string
  labelKey:
    | 'settings.language.english'
    | 'settings.language.russian'
    | 'settings.language.german'
  flag: string
}[] = [
  { code: 'en', labelKey: 'settings.language.english', flag: '🇬🇧' },
  { code: 'ru', labelKey: 'settings.language.russian', flag: '🇷🇺' },
  { code: 'de', labelKey: 'settings.language.german', flag: '🇩🇪' },
]

export default function LanguagePickerModal() {
  const t = useT()
  const { theme } = useTheme()
  const c = theme.colors
  const sp = theme.spacing
  const r = theme.radius
  const ty = theme.typography

  const currentLang = i18n.language

  const handleClose = useCallback(() => goBack(), [])

  const handleSelect = useCallback((code: string) => {
    i18n.changeLanguage(code)
    goBack()
  }, [])

  return (
    <HalfSheet onClose={handleClose}>
      {/* Title */}
      <Text
        style={[ty.titleMedium, { color: c.textPrimary, marginBottom: sp.md }]}
      >
        {t('settings.language.label')}
      </Text>

      {/* Options */}
      <View style={{ gap: sp.xs }}>
        {LANGUAGE_OPTIONS.map(opt => {
          const selected = currentLang === opt.code
          return (
            <Pressable
              key={opt.code}
              onPress={() => handleSelect(opt.code)}
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
              <Text style={[ty.bodyLarge]}>{opt.flag}</Text>
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
                <Svg
                  width={18}
                  height={18}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={c.primary}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <Polyline points="20 6 9 17 4 12" />
                </Svg>
              ) : null}
            </Pressable>
          )
        })}
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
})
