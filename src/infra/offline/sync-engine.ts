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
 *
 * DATA-FLOW:
 *   NetInfo detects online
 *      → syncEngine.onConnected()
 *         → replayOfflineMutations()
 *            → transport.mutate(...)
 *               → offlineQueue.remove(id)
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

export const syncEngine = {
  /**
   * Replay all pending offline mutations in FIFO order.
   *
   * Default behavior:
   *   - Stop replay on first error.
   *   - Remove only successful operations from the queue.
   */
  async replayOfflineMutations() {
    const items = offlineQueue.getAll();

    for (const item of items) {
      try {
        await transport.mutate(item.operation, item.variables);
        offlineQueue.remove(item.id);
      } catch (err) {
        /**
         * Backend/server is still unavailable OR
         * operation failed in a non-recoverable way.
         *
         * In production you may:
         *   - implement retry metadata (retryCount++)
         *   - log error for analytics
         *   - mark item.lastError = err
         *   - break or continue based on strategy
         */
        return;
      }
    }
  },

  /**
   * Called automatically by NetInfo when device reconnects.
   *
   * Sync steps:
   *   1. replay offline mutations
   *   2. hydrate caches (future)
   */
  async onConnected() {
    await this.replayOfflineMutations();

    /**
     * FUTURE:
     *   If using React Query:
     *
     *   queryClient.invalidateQueries();
     *   or
     *   syncEngine.hydrateQueryCache();
     */
  },
};
