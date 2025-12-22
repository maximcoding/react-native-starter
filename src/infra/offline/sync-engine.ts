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
 * ---------------------------------------------------------------------
 */

import { offlineQueue } from './offline-queue';
import { transport } from '@/infra/transport/transport';
import { QueryClient } from '@tanstack/react-query';
import { invalidateByTags } from '@/infra/query/helpers/invalidate-by-tags';
import type { TagMap } from '@/infra/query/tags';

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
  async replayOfflineMutations() {
    const items = offlineQueue.getAll();

    for (const item of items) {
      try {
        await transport.mutate(item.operation, item.variables);

        // targeted invalidation after successful replay (if wired)
        if (qc && item.tags?.length && tagMaps.length) {
          await invalidateByTags(qc, item.tags, tagMaps);
        }

        offlineQueue.remove(item.id);
      } catch {
        return;
      }
    }
  },

  async onConnected() {
    await this.replayOfflineMutations();
  },
};
