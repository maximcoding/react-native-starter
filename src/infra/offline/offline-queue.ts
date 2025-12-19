// src/infra/offline/offline-queue.ts
/**
 * FILE: offline-queue.ts
 * LAYER: infra/offline
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Queue write operations (mutations / uploads) attempted while the app
 *   is offline. When the device reconnects, sync-engine replays queued
 *   operations in FIFO order.
 *
 * RESPONSIBILITIES:
 *   - push(operation, variables, tags?) → store new offline task.
 *   - getAll()                         → return snapshot for replay/inspection.
 *   - remove(id)                       → remove successfully replayed mutation.
 *   - clear()                          → wipe queue on logout or environment reset.
 *
 * DATA-FLOW:
 *   service.mutate()
 *      → transport.mutate()
 *         → offline? → offlineQueue.push(operation, variables, tags?)
 *
 *   connectivity restored (NetInfo)
 *      → syncEngine.onConnected()
 *         → replayOfflineMutations()
 *            → transport.mutate()
 *            → (optional) invalidate by tags
 *            → offlineQueue.remove(id)
 *
 * DESIGN NOTES:
 *   - In-memory array used only for development.
 *   - Replace with MMKV/SQLite for persistence (recommended).
 *
 * EXTENSION GUIDELINES:
 *   - Add retry metadata: { retryCount, lastAttempt, lastError }.
 *   - Add conflict-resolution strategies:
 *       optimistic merge, server-wins, client-wins, CRDT.
 *   - Add deduplication based on operation + payload hash.
 *   - Add TTL (“discard after X hours offline”).
 *   - Add encryption if persistent storage contains sensitive data.
 *
 * THREAD SAFETY:
 *   - JS thread is single-threaded → array operations are safe.
 *   - When using SQLite/MMKV ensure atomic writes.
 * ---------------------------------------------------------------------
 */

export interface OfflineMutation {
  id: string; // unique queue entry identifier
  operation: string; // name of mutation (transport-level)
  variables: unknown; // payload passed to transport.mutate
  createdAt: number; // timestamp for ordering and TTL
  tags?: string[]; // NEW: logical tags for post-replay cache invalidation
  // Future:
  // retryCount?: number;
  // lastError?: NormalizedError;
  // hash?: string;          // deduplication key
}

const MEMORY_QUEUE: OfflineMutation[] = [];

export const offlineQueue = {
  /**
   * Push a new offline mutation into the FIFO queue.
   * Backward-compatible: `tags` is optional.
   */
  push(operation: string, variables: unknown, tags?: string[]) {
    MEMORY_QUEUE.push({
      id: Math.random().toString(36).slice(2),
      operation,
      variables,
      createdAt: Date.now(),
      tags,
    });
  },

  /**
   * Return a snapshot of all queued offline mutations.
   * sync-engine uses this to replay operations when online.
   */
  getAll(): OfflineMutation[] {
    return [...MEMORY_QUEUE];
  },

  /**
   * Remove a specific queued item by ID.
   * Called after successful replay of a mutation.
   */
  remove(id: string) {
    const index = MEMORY_QUEUE.findIndex(q => q.id === id);
    if (index !== -1) {
      MEMORY_QUEUE.splice(index, 1);
    }
  },

  /**
   * Clear the entire queue.
   * Called when:
   *   - user logs out
   *   - environment resets
   *   - new session started
   */
  clear() {
    MEMORY_QUEUE.length = 0;
  },
};
