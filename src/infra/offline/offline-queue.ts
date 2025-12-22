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

import type { Operation } from '@/infra/transport/operations';
import type { Tag } from '@/infra/query/tags';

export interface OfflineMutation {
  id: string;
  operation: Operation;
  variables: unknown;
  createdAt: number;
  tags?: Tag[]; // stored as mutable copy
}

const MEMORY_QUEUE: OfflineMutation[] = [];

export const offlineQueue = {
  /**
   * Push a new offline mutation into the FIFO queue.
   * Backward-compatible: `tags` is optional.
   */
  push(operation: Operation, variables: unknown, tags?: readonly Tag[]) {
    MEMORY_QUEUE.push({
      id: Math.random().toString(36).slice(2),
      operation,
      variables,
      createdAt: Date.now(),
      tags: tags ? [...tags] : undefined, // ✅ copy readonly -> mutable
    });
  },

  getAll(): OfflineMutation[] {
    return [...MEMORY_QUEUE];
  },

  remove(id: string) {
    const index = MEMORY_QUEUE.findIndex(q => q.id === id);
    if (index !== -1) MEMORY_QUEUE.splice(index, 1);
  },

  clear() {
    MEMORY_QUEUE.length = 0;
  },
};
