// 2025 — infra/query/persistence/mmkv-persister.ts
/**
 * GUIDELINE: MMKV Query Cache Persistence (NO implementation)
 * ------------------------------------------------------------------
 * STORAGE
 *   - Use infra/storage/mmkv.ts (KeyValueStorage)
 *   - Namespace: 'rq_cache_v1'
 *
 * WHAT TO PERSIST
 *   - Only non-sensitive normalized data (no tokens/PII)
 *   - Query data + timestamps
 *   - Do NOT persist raw transport responses or errors
 *
 * TTL / LIMITS → see persistence/limits.ts
 *   realtime:     5–15s
 *   nearRealtime: 30–120s
 *   reference:    1–24h
 *
 * LIFECYCLE
 *   - Hydrate on app start
 *   - Persist on background/interval/successful fetch
 *   - Clear on logout / env switch
 */

// Persists React Query cache using your kvStorage + constants.RQ_CACHE
import type { Persister } from '@tanstack/react-query-persist-client';
import { kvStorage } from '@/infra/storage/mmkv';
import { constants } from '@/core/config/constants';

export const mmkvPersister: Persister = {
  persistClient: async client => {
    try {
      kvStorage.setString(constants.RQ_CACHE, JSON.stringify(client));
    } catch {}
  },
  restoreClient: async () => {
    try {
      const raw = kvStorage.getString(constants.RQ_CACHE);
      return raw ? JSON.parse(raw) : undefined;
    } catch {
      return undefined;
    }
  },
  removeClient: async () => {
    try {
      kvStorage.delete(constants.RQ_CACHE);
    } catch {}
  },
};
