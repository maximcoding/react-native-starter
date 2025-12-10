/**
 * FILE: transport.types.ts
 * LAYER: infra/transport
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Define a backend-agnostic interface for all data transports used
 *   in the app (REST, GraphQL, Firebase, WebSocket, gRPC, etc.).
 *
 * RESPONSIBILITIES:
 *   - Provide generic signatures for query/mutate/subscribe/upload.
 *   - Allow adapters to implement concrete protocols.
 *
 * DATA-FLOW:
 *   service layer
 *      → transport (wrapper)
 *         → active adapter (REST/GraphQL/Firebase/WebSocket/...)
 *
 * EXTENSION GUIDELINES:
 *   - Keep interface stable; extend meta if needed.
 * ---------------------------------------------------------------------
 */
export type TransportRequestMeta = {
  offline?: boolean;
  retry?: boolean;
  tags?: string | string[];
};

export interface Transport {
  query<TResponse = unknown, TVariables = unknown>(
    operation: string,
    variables?: TVariables,
    meta?: TransportRequestMeta,
  ): Promise<TResponse>;

  mutate<TResponse = unknown, TVariables = unknown>(
    operation: string,
    variables?: TVariables,
    meta?: TransportRequestMeta,
  ): Promise<TResponse>;

  subscribe<TData = unknown>(
    channel: string,
    handler: (data: TData) => void,
    meta?: TransportRequestMeta,
  ): () => void;

  upload<TResponse = unknown>(
    operation: string,
    payload: { file: unknown; extra?: Record<string, unknown> },
    meta?: TransportRequestMeta,
  ): Promise<TResponse>;
}
