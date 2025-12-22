// src/infra/transport/transport.ts
/**
 * FILE: transport.ts
 * LAYER: infra/transport
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Provide a single, offline-aware Transport instance for the app.
 *   All services must use this, never concrete adapters directly.
 *
 * RESPONSIBILITIES:
 *   - Hold active low-level adapter (REST/GraphQL/Firebase/WebSocket/...).
 *   - Expose setTransport() to swap adapters at runtime/config.
 *   - Track offlineMode flag (setOfflineMode()).
 *   - Wrap adapter calls to:
 *       - queue mutations/uploads when offline,
 *       - block queries/subscriptions when offline.
 * ---------------------------------------------------------------------
 */

// src/infra/transport/transport.ts
import type { Transport } from './transport.types';
import type { Tag } from '@/infra/query/tags';
import { restAdapter } from './adapters/rest.adapter';
import { offlineQueue } from '@/infra/offline/offline-queue';

let activeTransport: Transport = restAdapter;
let offline = false;

export function setTransport(adapter: Transport) {
  activeTransport = adapter;
}

export function setOfflineMode(enabled: boolean) {
  offline = enabled;
}

export function isOfflineMode(): boolean {
  return offline;
}

function normalizeTags(tags?: Tag | readonly Tag[]): Tag[] | undefined {
  if (!tags) return undefined;
  if (typeof tags === 'string') return [tags];
  if (Array.isArray(tags)) return [...tags]; // ✅ make mutable copy
  return undefined;
}

export const transport: Transport = {
  async query(operation, variables, meta) {
    if (offline) {
      const err: any = new Error('Offline: query is not available');
      err.code = 'NETWORK_OFFLINE';
      throw err;
    }
    return activeTransport.query(operation, variables, meta);
  },

  async mutate(operation, variables, meta) {
    if (offline) {
      const tags = normalizeTags(meta?.tags);
      offlineQueue.push(operation, variables, tags);
      return Promise.resolve({ offline: true, queued: true } as any);
    }
    return activeTransport.mutate(operation, variables, meta);
  },

  subscribe(channel, handler, meta) {
    if (offline) return () => {};
    return activeTransport.subscribe(channel, handler, meta);
  },

  async upload(operation, payload, meta) {
    if (offline) {
      const tags = normalizeTags(meta?.tags);
      offlineQueue.push(operation, payload, tags);
      return Promise.resolve({ offline: true, queued: true } as any);
    }
    return activeTransport.upload(operation, payload, meta);
  },
};
