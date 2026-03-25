import React, { useEffect } from 'react'
import { StyleSheet } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { ThemeProvider } from '@/shared/theme/ThemeProvider'
import '@/i18n/i18n'

import { flags } from '@/config/constants'
import { authKeys } from '@/features/auth/api/keys'
import { userKeys } from '@/features/user/api/keys'
import { useT } from '@/i18n/useT'
import { useBackButtonHandler } from '@/navigation/helpers/use-back-handler'
import { NavigationRoot } from '@/navigation/NavigationRoot'
import { clearNavigationPersistence } from '@/navigation/persistence/navigation-persistence'
import { ROUTES } from '@/navigation/routes'
import { ErrorBoundary } from '@/shared/components/ui/ErrorBoundary'
import { OfflineBanner } from '@/shared/components/ui/OfflineBanner'
import { QueryProvider } from '@/shared/services/api/query/client/provider'
import { mockAdapter } from '@/shared/services/api/transport/adapters/mock.adapter'
import { restAdapter } from '@/shared/services/api/transport/adapters/rest.adapter'
import { setTransport } from '@/shared/services/api/transport/transport'
import {
  captureBoundaryError,
  initSentry,
} from '@/shared/services/monitoring/sentry'

initSentry()

export default function App() {
  const t = useT()

  useEffect(() => {
    setTransport(flags.USE_MOCK ? mockAdapter : restAdapter)
  }, [])

  // Android: exit app from root-level leaves (main tabs, login, onboarding).
  useBackButtonHandler(
    routeName =>
      routeName === ROUTES.TAB_HOME ||
      routeName === ROUTES.TAB_SETTINGS ||
      routeName === ROUTES.AUTH_LOGIN ||
      routeName === ROUTES.ONBOARDING_MAIN,
  )

  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ErrorBoundary
            onError={(error, errorInfo) => {
              captureBoundaryError(error, errorInfo)
              clearNavigationPersistence()
            }}
            labels={{
              title: t('common.error_title'),
              hint: t('common.error_hint'),
              retry: t('common.retry'),
            }}
          >
            <QueryProvider tagMaps={[authKeys.tagMap, userKeys.tagMap]}>
              <OfflineBanner message={t('common.offline_banner')} />
              <NavigationRoot />
            </QueryProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({ flex: { flex: 1 } })
