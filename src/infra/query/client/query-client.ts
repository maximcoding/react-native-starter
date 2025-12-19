// 2025 — infra/query/client/query-client.ts
/**
 * GUIDELINE: React Query Client
 * ------------------------------------------------------------------
 * PURPOSE
 *   Single place to define global defaults for @tanstack/react-query:
 *   - staleTime / gcTime
 *   - retry / backoff (see policy/retry.ts)
 *   - refetchOnReconnect / refetchOnFocus
 *   - networkMode ('online' | 'offlineFirst' | 'always') via netmode
 *   - error handling → infra/error/normalize-error.ts
 *
 * DEFAULTS (RECOMMENDED)
 *   staleTime:            60_000 ms (1 min)
 *   gcTime:               300_000 ms (5 min)
 *   retry:                2 (5xx/429 only)
 *   refetchOnFocus:       true (nearRealtime), false (reference)
 *   refetchOnReconnect:   true
 *   networkMode:          'online' (switch via netmode on connectivity)
 *   throwOnError:         false (UI sees normalized errors only)
 *
 * INTEGRATIONS
 *   - NetInfo bridge: infra/query/netmode/network-mode.ts
 *   - Cache persistence: infra/query/persistence/mmkv-persister.ts
 *   - Error shape: infra/error/normalize-error.ts
 *
 * RULES
 *   - No axios/fetch here. No business logic.
 *   - Hooks in features must reference profiles in policy/*.ts.
 */

import { QueryClient } from '@tanstack/react-query';
import { normalizeError } from '@/infra/error/normalize-error';
import { Freshness } from '@/infra/query/policy/freshness';
import { showErrorToast } from '@/core/ui/toast';

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // nearRealtime profile by default
        staleTime: Freshness.nearRealtime.staleTime,
        gcTime: Freshness.nearRealtime.gcTime,
        refetchOnReconnect: true,
        throwOnError: false,
        retry: (failureCount, error: unknown) => {
          const e = normalizeError(error);
          // Retry only transient server errors
          if (e.status && (e.status >= 500 || e.status === 429)) {
            return failureCount < 2;
          }
          return false;
        },
        // Global UX for query failures
        onError: error => {
          const e = normalizeError(error);
          if (__DEV__) console.log('[RQ][QUERY][ERROR]', e);
          showErrorToast(e);
        },
      },
      mutations: {
        throwOnError: false,
        retry: (failureCount, error: unknown) => {
          const e = normalizeError(error);
          if (e.status && (e.status >= 500 || e.status === 429)) {
            return failureCount < 2;
          }
          return false;
        },
        // Global UX for mutation failures
        onError: error => {
          const e = normalizeError(error);
          if (__DEV__) console.log('[RQ][MUTATION][ERROR]', e);
          showErrorToast(e);
        },
      },
    },
  });
}
