import React, { useCallback } from 'react'
import { View } from 'react-native'
import i18n from '@/i18n/i18n'
import { useT } from '@/i18n/useT'
import { goBack } from '@/navigation/helpers/navigation-helpers'
import { Button } from '@/shared/components/ui/Button'
import { ScreenHeader } from '@/shared/components/ui/ScreenHeader'
import { ScreenWrapper } from '@/shared/components/ui/ScreenWrapper'
import { useTheme } from '@/shared/theme/useTheme'

export default function LanguageScreen() {
  const { theme } = useTheme()
  const t = useT()

  const handleBack = useCallback(() => goBack(), [])
  const handleEnglish = useCallback(() => i18n.changeLanguage('en'), [])
  const handleRussian = useCallback(() => i18n.changeLanguage('ru'), [])
  const handleGerman = useCallback(() => i18n.changeLanguage('de'), [])

  return (
    <ScreenWrapper
      header={
        <ScreenHeader
          title={t('settings.language.label')}
          onBack={handleBack}
        />
      }
    >
      <View style={{ padding: theme.spacing.lg, gap: theme.spacing.sm }}>
        <Button
          title={t('settings.language.english')}
          onPress={handleEnglish}
        />
        <Button
          title={t('settings.language.russian')}
          onPress={handleRussian}
        />
        <Button title={t('settings.language.german')} onPress={handleGerman} />
      </View>
    </ScreenWrapper>
  )
}
