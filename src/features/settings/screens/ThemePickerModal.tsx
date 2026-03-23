// src/features/settings/screens/ThemePickerModal.tsx

import React, { useCallback } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import Svg, { Polyline } from 'react-native-svg'
import { useT } from '@/i18n/useT'
import { goBack } from '@/navigation/helpers/navigation-helpers'
import HalfSheet from '@/navigation/modals/half-sheet'
import { Text } from '@/shared/components/ui/Text'
import type { ThemeMode } from '@/shared/theme/ThemeContext'
import { useTheme } from '@/shared/theme/useTheme'

const THEME_OPTIONS: {
  mode: ThemeMode
  labelKey:
    | 'settings.theme_light'
    | 'settings.theme_dark'
    | 'settings.theme_system'
  emoji: string
}[] = [
  { mode: 'light', labelKey: 'settings.theme_light', emoji: '☀️' },
  { mode: 'dark', labelKey: 'settings.theme_dark', emoji: '🌙' },
  { mode: 'system', labelKey: 'settings.theme_system', emoji: '⚙️' },
]

export default function ThemePickerModal() {
  const t = useT()
  const { theme, mode, setTheme } = useTheme()
  const c = theme.colors
  const sp = theme.spacing
  const r = theme.radius
  const ty = theme.typography

  const handleClose = useCallback(() => goBack(), [])

  const handleSelect = useCallback(
    (selected: ThemeMode) => {
      setTheme(selected)
      goBack()
    },
    [setTheme],
  )

  return (
    <HalfSheet onClose={handleClose}>
      {/* Title */}
      <Text
        style={[ty.titleMedium, { color: c.textPrimary, marginBottom: sp.md }]}
      >
        {t('settings.theme')}
      </Text>

      {/* Options */}
      <View style={{ gap: sp.xs }}>
        {THEME_OPTIONS.map(opt => {
          const selected = mode === opt.mode
          return (
            <Pressable
              key={opt.mode}
              onPress={() => handleSelect(opt.mode)}
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
              <Text style={[ty.bodyLarge]}>{opt.emoji}</Text>
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
