import React, { useEffect } from 'react';
import BootSplash from 'react-native-bootsplash';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, StyleSheet } from 'react-native';

import { ThemeProvider } from '@/core/theme/ThemeProvider';
import '@/core/i18n/i18n';

import RootNavigator from '@/app/navigation/root/root-navigator';
import { navigationRef } from '@/app/navigation/helpers/navigation-helpers';
import { useBackButtonHandler } from '@/app/navigation/helpers/use-back-handler';
import { ROUTES } from '@/app/navigation/routes';

import { QueryProvider } from '@/infra/query/client/provider';
import { authKeys } from '@/features/auth/api/keys';
import { userKeys } from '@/features/user/api/keys';
import { OfflineBanner } from '@/app/components/OfflineBanner';

import { setTransport } from '@/infra/transport/transport';
import { mockAdapter } from '@/infra/transport/adapters/mock.adapter';
import { restAdapter } from '@/infra/transport/adapters/rest.adapter';
import { flags } from '@/core/config/constants';

export default function App() {
  useEffect(() => {
    setTransport(flags.USE_MOCK ? mockAdapter : restAdapter);
  }, []);

  useBackButtonHandler(
    routeName =>
      routeName === ROUTES.HOME_TABS || routeName === ROUTES.TAB_HOME,
  );

  return (
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <ThemeProvider>
          <QueryProvider tagMaps={[authKeys.tagMap, userKeys.tagMap]}>
            <OfflineBanner />

            <NavigationContainer
              ref={navigationRef}
              onReady={() => BootSplash.hide({ fade: true })}
            >
              <RootNavigator />
            </NavigationContainer>
          </QueryProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({ flex: { flex: 1 } });
