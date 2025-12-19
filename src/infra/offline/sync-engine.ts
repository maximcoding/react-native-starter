// src/infra/offline/sync-engine.ts
/**
 * FILE: sync-engine.ts
 * LAYER: infra/offline
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Orchestrate offline → online synchronization process.
 *   Handles replaying queued write operations (mutations/uploads)
 *   once connectivity is restored.
 *
 * RESPONSIBILITIES:
 *   - Read queued offline mutations from offlineQueue.
 *   - Re-run them (FIFO) using transport.mutate().
 *   - Remove successfully replayed entries.
 *   - Stop on first failure to avoid destructive cascading errors.
 *   - Provide the main entry point: onConnected().
 *   - (ADDED) After successful replay, invalidate React Query caches by tags.
 *
 * DATA-FLOW:
 *   NetInfo detects online
 *      → syncEngine.onConnected()
 *         → replayOfflineMutations()
 *            → transport.mutate(...)
 *            → (ADDED) invalidateByTags(...)
 *            → offlineQueue.remove(id)
 *
 * OFFLINE POLICY:
 *   - Mutations done while offline are always queued.
 *   - Queries always fail while offline (by design).
 *
 * FUTURE EXTENSIONS:
 *   - Retry/backoff rules:
 *       exponentialBackoff, jitter, retryLimit.
 *
 *   - Conflict resolution:
 *       server-wins, client-wins, merge strategies.
 *
 *   - Partial replay:
 *       continue replaying even if one operation fails
 *       (configurable via replay strategy).
 *
 *   - Cache hydration:
 *       refresh stale queries via QueryClient after replay.
 *
 *   - Telemetry:
 *       track offline queue size, replay success rate, errors.
 *
 * THREAD SAFETY:
 *   - JS is single-threaded → safe for Map/array.
 *   - When persistent storage is added (MMKV/SQLite), ensure atomic ops.
 * ---------------------------------------------------------------------
 */

import { offlineQueue } from './offline-queue';
import { transport } from '@/infra/transport/transport';
import { QueryClient } from '@tanstack/react-query';
import { invalidateByTags } from '@/infra/query/helpers/invalidate-by-tags';

// Local copy of TagMap type to avoid build issues if "type" imports are restricted
type TagMap = Record<string, ReadonlyArray<() => unknown[]>>;

// Wired once at app startup
let qc: QueryClient | null = null;
let tagMaps: TagMap[] = [];

/** Provide QueryClient so sync-engine can invalidate caches after replay. */
export function setQueryClientForSync(client: QueryClient) {
  qc = client;
}

/** Provide feature tag maps (e.g., authKeys.tagMap, userKeys.tagMap). */
export function setTagMapsForSync(maps: TagMap[]) {
  tagMaps = maps;
}

export const syncEngine = {
  /**
   * Replay all pending offline mutations in FIFO order.
   *
   * Default behavior:
   *   - Stop replay on first error.
   *   - Remove only successful operations from the queue.
   *   - (Added) Invalidate related React Query keys by tags after success.
   */
  async replayOfflineMutations() {
    const items = offlineQueue.getAll();

    for (const item of items) {
      try {
        await transport.mutate(item.operation, item.variables);

        // ADDED: targeted invalidation after successful replay (if wired)
        if (qc && item.tags?.length && tagMaps.length) {
          await invalidateByTags(qc, item.tags, tagMaps);
        }

        offlineQueue.remove(item.id);
      } catch {
        // Backend/server is still unavailable OR non-recoverable failure.
        // Keep the rest for next attempt.
        return;
      }
    }
  },

  /**
   * Called automatically by NetInfo when device reconnects.
   *
   * Sync steps:
   *   1. replay offline mutations
   *   2. (future) hydrate caches
   */
  async onConnected() {
    await this.replayOfflineMutations();

    /**
     * FUTURE:
     *   queryClient.invalidateQueries();
     *   or
     *   syncEngine.hydrateQueryCache();
     */
  },
};
