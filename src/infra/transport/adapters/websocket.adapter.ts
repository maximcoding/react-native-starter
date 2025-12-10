/**
 * FILE: websocket.adapter.ts
 * LAYER: infra/transport/adapters
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Placeholder WebSocket adapter implementing the Transport interface
 *   for realtime event-driven APIs (chat, trading, presence, notifications).
 *
 * RESPONSIBILITIES:
 *   - Provide compile-time-complete Transport implementation.
 *   - Throw explicit "not implemented" until the actual WS client is wired.
 *   - Demonstrate how query/mutate/subscribe/upload would map to WS RPC.
 *
 * DATA-FLOW:
 *   service
 *      → transport (active = websocketAdapter)
 *         → websocketAdapter.query/mutate/subscribe/upload
 *            → WS client (future)
 *
 * EXTENSION GUIDELINES:
 *   - query/mutate:
 *        Send RPC message over WS:
 *        ws.send(JSON.stringify({ op: operation, data: variables }))
 *        Listen for matching response.
 *
 *   - subscribe:
 *        ws.subscribe(channel, handler)
 *        return () => ws.unsubscribe(channel)
 *
 *   - upload:
 *        WS is not designed for binary upload → require pre-signed URLs.
 *
 * ERROR HANDLING:
 *   - Wrap WS errors into NormalizedError before returning to services.
 * ---------------------------------------------------------------------
 */
import type { Transport } from '@/infra/transport/transport.types';

function notImplemented(method: string, operation: string): never {
  throw new Error(`[WebSocket adapter] ${method} not implemented for "${operation}"`);
}

export const websocketAdapter: Transport = {
  async query(operation, _variables, _meta) {
    /**
     * FUTURE EXAMPLE (pseudo):
     *
     * ws.send(JSON.stringify({ type: 'QUERY', op: operation, vars: _variables }));
     * const response = await ws.waitForResponse(operation);
     * return response.data;
     */
    notImplemented('query', operation);
  },

  async mutate(operation, _variables, _meta) {
    /**
     * FUTURE EXAMPLE:
     *
     * ws.send(JSON.stringify({ type: 'MUTATION', op: operation, vars: _variables }));
     * const response = await ws.waitForResponse(operation);
     * return response.data;
     */
    notImplemented('mutate', operation);
  },

  subscribe(_channel, _handler, _meta) {
    /**
     * FUTURE EXAMPLE:
     *
     * const unsubscribe = ws.subscribe(_channel, (msg) => {
     *   _handler(msg.data);
     * });
     *
     * return () => unsubscribe();
     */
    return () => {};
  },

  async upload(operation, _payload, _meta) {
    /**
     * WS uploads are non-standard.
     * Typical flows:
     *   1. generatePresignedUrl via mutation
     *   2. use REST to upload binary
     *
     * Placeholder → not implemented.
     */
    notImplemented('upload', operation);
  },
};
