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
 *
 * DATA-FLOW (ONLINE):
 *   service → transport.query/mutate/subscribe/upload
 *      → activeTransport.query/mutate/subscribe/upload
 *         → adapter (REST/GraphQL/Firebase/...)
 *
 * DATA-FLOW (OFFLINE):
 *   service → transport.mutate/upload
 *      → offlineQueue.push()
 *      → immediate resolved Promise({ offline: true, queued: true })
 *
 *   netinfo: offline → online
 *      → syncEngine.onConnected()
 *         → replayOfflineMutations()
 *            → transport.mutate() (now online)
 *
 * EXTENSION GUIDELINES:
 *   - Do NOT import adapters directly in services.
 *   - Only modify adapter selection in setTransport().
 *   - Keep offline behavior here, not in services.
 * ---------------------------------------------------------------------
 */
import type { Transport } from './transport.types';
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

export const transport: Transport = {
  async query(operation, variables, meta) {
    if (offline) {
      throw new Error('Offline: query is not available');
    }
    return activeTransport.query(operation, variables, meta);
  },

  async mutate(operation, variables, meta) {
    if (offline) {
      offlineQueue.push(operation, variables);
      return Promise.resolve({
        offline: true,
        queued: true,
      } as any);
    }
    return activeTransport.mutate(operation, variables, meta);
  },

  subscribe(channel, handler, meta) {
    if (offline) {
      return () => {};
    }
    return activeTransport.subscribe(channel, handler, meta);
  },

  async upload(operation, payload, meta) {
    if (offline) {
      offlineQueue.push(operation, payload);
      return Promise.resolve({
        offline: true,
        queued: true,
      } as any);
    }
    return activeTransport.upload(operation, payload, meta);
  },
};

