/**
 * FILE: ThemeScreen.tsx
 * LAYER: app/features/settings/screens
 */

import React, { useCallback } from 'react'
import { View } from 'react-native'
import { useT } from '@/i18n/useT'
import { goBack } from '@/navigation/helpers/navigation-helpers'
import { Button } from '@/shared/components/ui/Button'
import { ScreenHeader } from '@/shared/components/ui/ScreenHeader'
import ScreenWrapper from '@/shared/components/ui/ScreenWrapper'
import type { ThemeMode } from '@/shared/theme/ThemeContext'
import { useTheme } from '@/shared/theme/useTheme'

const MODES: ThemeMode[] = ['light', 'dark', 'system']

export default function ThemeScreen() {
  const { theme, setTheme } = useTheme()
  const t = useT()

  const handleBack = useCallback(() => goBack(), [])

  return (
    <ScreenWrapper
      header={<ScreenHeader title={t('settings.theme')} onBack={handleBack} />}
    >
      <View style={{ padding: theme.spacing.lg, gap: theme.spacing.sm }}>
        {MODES.map(m => (
          <Button key={m} title={m.toUpperCase()} onPress={() => setTheme(m)} />
        ))}
      </View>
    </ScreenWrapper>
  )
}
