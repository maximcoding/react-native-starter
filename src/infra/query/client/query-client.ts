// src/infra/query/client/query-client.ts
import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { normalizeError } from '@/infra/error/normalize-error';
import { Freshness } from '@/infra/query/policy/freshness';
import { showErrorToast } from '@/core/ui/toast';

export function createQueryClient() {
  const queryCache = new QueryCache({
    onError: error => {
      const e = normalizeError(error);

      // ✅ не спамим тостами при оффлайне
      if (e.code === 'NETWORK_OFFLINE') return;

      if (__DEV__) console.log('[RQ][QUERY][ERROR]', e);
      showErrorToast(e);
    },
  });

  const mutationCache = new MutationCache({
    onError: error => {
      const e = normalizeError(error);

      // ✅ не спамим тостами при оффлайне
      if (e.code === 'NETWORK_OFFLINE') return;

      if (__DEV__) console.log('[RQ][MUTATION][ERROR]', e);
      showErrorToast(e);
    },
  });

  return new QueryClient({
    queryCache,
    mutationCache,
    defaultOptions: {
      queries: {
        // nearRealtime profile by default
        staleTime: Freshness.nearRealtime.staleTime,
        gcTime: Freshness.nearRealtime.gcTime,

        refetchOnReconnect: true,
        throwOnError: false,

        retry: (failureCount, error: unknown) => {
          const e = normalizeError(error);

          // ✅ никогда не ретраим оффлайн
          if (e.code === 'NETWORK_OFFLINE') return false;

          // ✅ ретраи только на 5xx/429
          if (e.status && (e.status >= 500 || e.status === 429)) {
            return failureCount < 2;
          }
          return false;
        },
      },

      mutations: {
        throwOnError: false,

        retry: (failureCount, error: unknown) => {
          const e = normalizeError(error);

          // ✅ никогда не ретраим оффлайн
          if (e.code === 'NETWORK_OFFLINE') return false;

          if (e.status && (e.status >= 500 || e.status === 429)) {
            return failureCount < 2;
          }
          return false;
        },
      },
    },
  });
}
