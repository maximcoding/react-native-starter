// FILE: App.tsx
// ROOT ENTRY POINT
// -------------------------------------------------------
// WRAPS:
//   - ThemeProvider (light/dark)
//   - i18n initialization (side-effect import)
//   - React Query (persisted via MMKV)
//   - NavigationContainer
//   - RootNavigator
//   - OfflineBanner
// -------------------------------------------------------

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

// THEME
import { ThemeProvider } from '@/core/theme/ThemeProvider';

// i18n (auto-init via side-effect)
import '@/core/i18n/i18n';

// NAVIGATION ROOT + helpers
import RootNavigator from '@/app/navigation/root/root-navigator';
import { navigationRef } from '@/app/navigation/helpers/navigation-helpers';
import { useBackButtonHandler } from '@/app/navigation/helpers/use-back-handler';
import { ROUTES } from '@/app/navigation/routes';

// REACT QUERY (persisted)
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createQueryClient } from '@/infra/query/client/query-client';
import { mmkvPersister } from '@/infra/query/persistence/mmkv-persister';

// OFFLINE/SYNC: wire QueryClient + tag maps + NetInfo bridge
import { initNetInfoBridge } from '@/infra/network/netinfo';
import {
  setQueryClientForSync,
  setTagMapsForSync,
} from '@/infra/offline/sync-engine';
import { authKeys } from '@/features/auth/api/keys';
import { userKeys } from '@/features/user/api/keys';

// Global offline UI
import { OfflineBanner } from '@/app/components/OfflineBanner';

// Create client once
const queryClient = createQueryClient();
setQueryClientForSync(queryClient);
setTagMapsForSync([authKeys.tagMap, userKeys.tagMap]);
initNetInfoBridge();

export default function App() {
  // Android back button handling (exit only on root tabs)
  useBackButtonHandler(routeName => {
    return routeName === ROUTES.HOME_TABS || routeName === ROUTES.TAB_HOME;
  });

  return (
    <ThemeProvider>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister: mmkvPersister }}
      >
        {/* Global offline status banner */}
        <OfflineBanner />

        <NavigationContainer ref={navigationRef}>
          <RootNavigator />
        </NavigationContainer>
      </PersistQueryClientProvider>
    </ThemeProvider>
  );
}
