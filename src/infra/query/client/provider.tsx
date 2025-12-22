// src/infra/query/client/provider.tsx
/**
 * FILE: provider.tsx
 * LAYER: infra/query/client
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Centralize React Query bootstrapping:
 *   - PersistQueryClientProvider (MMKV persister)
 *   - NetInfo bridge
 *   - onlineManager + focusManager wiring (RQ v5)
 *   - transport offlineMode switching (online/offline)
 *   - sync-engine wiring: QueryClient + tagMaps for invalidate-by-tags
 *   - session-bridge wiring: QueryClient for logout/refresh flows
 *
 * RULES:
 *   - No feature imports here.
 *   - Features pass tagMaps from App root.
 * ---------------------------------------------------------------------
 */

import React from 'react';
import { AppState } from 'react-native';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { focusManager, onlineManager } from '@tanstack/react-query';

import { createQueryClient } from './query-client';
import { mmkvPersister } from '@/infra/query/persistence/mmkv-persister';

import {
  initNetInfoBridge,
  onNetworkChange,
  isOffline,
} from '@/infra/network/netinfo';

import {
  setQueryClientForSync,
  setTagMapsForSync,
  syncEngine,
} from '@/infra/offline/sync-engine';
import type { TagMap } from '@/infra/query/tags';

import { setSessionQueryClient } from '@/core/session/session-bridge';
import { setOfflineMode } from '@/infra/transport/transport';

import type { DehydrateOptions } from '@tanstack/react-query';
import { PersistencePolicy } from '@/infra/query/persistence/limits';

type Props = React.PropsWithChildren<{
  /** Feature tag maps: [authKeys.tagMap, userKeys.tagMap, ...] */
  tagMaps: TagMap[];
}>;

// ✅ One QueryClient for the whole app lifetime
const queryClient = createQueryClient();

// Guard to avoid double-init in dev (Fast Refresh)
let didInit = false;

export function QueryProvider({ children, tagMaps }: Props) {
  React.useEffect(() => {
    // Always keep tag maps up-to-date (App may re-render)
    setTagMapsForSync(tagMaps);

    if (!didInit) {
      didInit = true;

      // 1) NetInfo bridge (safe no-op if package is absent)
      initNetInfoBridge();

      // 2) Wire QueryClient for non-React code (logout/refresh)
      setSessionQueryClient(queryClient);

      // 3) Wire sync engine
      setQueryClientForSync(queryClient);

      // 4) Initial offline/online state
      const offline = isOffline();
      setOfflineMode(offline);
      onlineManager.setOnline(!offline);
    }

    // Net changes -> update onlineManager + transport offlineMode + replay queue when online
    const unsubNet = onNetworkChange(async offline => {
      setOfflineMode(offline);
      onlineManager.setOnline(!offline);

      // when back online -> replay queued mutations
      if (!offline) {
        await syncEngine.onConnected();
      }
    });

    // AppState -> focusManager (refetchOnWindowFocus analogue)
    const sub = AppState.addEventListener('change', state => {
      focusManager.setFocused(state === 'active');
    });

    return () => {
      unsubNet();
      sub.remove();
    };
  }, [tagMaps]);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: mmkvPersister,
        buster: 'rq-cache-v1',
        dehydrateOptions: {
          shouldDehydrateQuery: query => {
            const meta = query.meta;
            if (PersistencePolicy.isSensitive(meta)) return false;

            const profile = PersistencePolicy.getProfile(meta);

            // не сохраняем профили, которые запрещены политикой
            if (!PersistencePolicy.allowedProfiles.has(profile)) return false;

            // не сохраняем запросы без данных
            const dataUpdatedAt = query.state.dataUpdatedAt ?? 0;
            if (!dataUpdatedAt) return false;

            // TTL: не пишем протухшее
            if (!PersistencePolicy.isFreshEnough(profile, dataUpdatedAt))
              return false;

            return true;
          },
        } satisfies DehydrateOptions,
      }}
      onSuccess={() => {
        queryClient.resumePausedMutations().catch(() => undefined);
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
