// src/features/settings/screens/ThemePickerModal.tsx

import { IconName } from '@assets/icons'
import React, { memo, useCallback } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { useT } from '@/i18n/useT'
import { goBack } from '@/navigation/helpers/navigation-helpers'
import HalfSheet from '@/shared/components/ui/HalfSheet'
import { IconSvg } from '@/shared/components/ui/IconSvg'
import { Text } from '@/shared/components/ui/Text'
import type { ThemeMode } from '@/shared/theme/ThemeContext'
import { useTheme } from '@/shared/theme/useTheme'

const THEME_OPTIONS: {
  mode: ThemeMode
  labelKey:
    | 'settings.theme_light'
    | 'settings.theme_dark'
    | 'settings.theme_system'
  icon: IconName
}[] = [
  { mode: 'light', labelKey: 'settings.theme_light', icon: IconName.SUN },
  { mode: 'dark', labelKey: 'settings.theme_dark', icon: IconName.MOON },
  {
    mode: 'system',
    labelKey: 'settings.theme_system',
    icon: IconName.SETTINGS,
  },
]

// ─── Item ─────────────────────────────────────────────────────────────────────

interface ThemeOptionRowProps {
  opt: (typeof THEME_OPTIONS)[number]
  selected: boolean
  onSelect: (mode: ThemeMode) => void
}

const ThemeOptionRow = memo(function ThemeOptionRow({
  opt,
  selected,
  onSelect,
}: ThemeOptionRowProps) {
  const t = useT()
  const { theme } = useTheme()
  const c = theme.colors
  const sp = theme.spacing
  const r = theme.radius
  const ty = theme.typography

  const handlePress = useCallback(
    () => onSelect(opt.mode),
    [opt.mode, onSelect],
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
      <IconSvg
        name={opt.icon}
        size={20}
        color={selected ? c.primary : c.textSecondary}
        style={{ width: 20, height: 20 }}
      />
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

export default function ThemePickerModal() {
  const t = useT()
  const { theme, mode, setTheme } = useTheme()
  const c = theme.colors
  const sp = theme.spacing
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
      <Text
        style={[ty.titleMedium, { color: c.textPrimary, marginBottom: sp.md }]}
      >
        {t('settings.theme')}
      </Text>

      <View style={{ gap: sp.xs }}>
        {THEME_OPTIONS.map(opt => (
          <ThemeOptionRow
            key={opt.mode}
            opt={opt}
            selected={mode === opt.mode}
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
})
