/**
 * FILE: graphql.adapter.ts
 * LAYER: infra/transport/adapters
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Placeholder GraphQL adapter implementing the Transport interface.
 *   Intended for Apollo Client, urql, AWS AppSync, or any GraphQL client.
 *
 * RESPONSIBILITIES:
 *   - Provide a complete Transport implementation (query/mutate/subscribe/upload).
 *   - Ensure compile-time correctness until real implementation is added.
 *   - consistently throw explicit errors for unimplemented ops.
 *
 * DATA-FLOW:
 *   service
 *      → transport (active = graphQLAdapter)
 *         → graphQLAdapter.query/mutate/subscribe/upload
 *            → GQL Client (future)
 *
 * EXTENSION GUIDELINES:
 *   - query():
 *       gqlClient.query({ query: OperationMap[operation], variables })
 *       → return data
 *
 *   - mutate():
 *       gqlClient.mutate({ mutation: OperationMap[operation], variables })
 *       → return data
 *
 *   - subscribe():
 *       gqlClient.subscribe({ query: SubscriptionMap[channel] })
 *         .subscribe(result => handler(result.data))
 *
 *   - upload():
 *       GraphQL normally requires:
 *         - multipart GraphQL upload spec, OR
 *         - pre-signed URL from a mutation → then REST upload
 *
 * ERROR HANDLING:
 *   - Wrap GQL errors → normalizeError before rethrowing.
 *   - Do NOT return raw client errors to services/UI.
 * ---------------------------------------------------------------------
 */
import type { Transport } from '@/infra/transport/transport.types';

function notImplemented(method: string, operation: string): never {
  throw new Error(`[GraphQL adapter] ${method} not implemented for "${operation}"`);
}

export const graphQLAdapter: Transport = {
  async query(operation, _variables, _meta) {
    /**
     * FUTURE IMPLEMENTATION (Apollo):
     *
     * const result = await apolloClient.query({
     *   query: GQLOperations[operation],
     *   variables: _variables,
     *   fetchPolicy: 'network-only'
     * });
     *
     * return result.data;
     */
    notImplemented('query', operation);
  },

  async mutate(operation, _variables, _meta) {
    /**
     * FUTURE IMPLEMENTATION (Apollo):
     *
     * const result = await apolloClient.mutate({
     *   mutation: GQLOperations[operation],
     *   variables: _variables
     * });
     *
     * return result.data;
     */
    notImplemented('mutate', operation);
  },

  subscribe(_channel, _handler, _meta) {
    /**
     * FUTURE IMPLEMENTATION (Apollo GraphQL WS):
     *
     * const sub = apolloClient.subscribe({
     *   query: GQLSubscriptions[_channel],
     *   variables: {},
     * }).subscribe({
     *   next: (event) => _handler(event.data),
     *   error: console.error
     * });
     *
     * return () => sub.unsubscribe();
     */
    return () => {};
  },

  async upload(operation, _payload, _meta) {
    /**
     * GRAPHQL UPLOAD STRATEGY:
     *   GraphQL itself does NOT directly support binary uploads.
     *   Patterns:
     *     1. multipart/form-data (graphql-upload)
     *     2. mutation → getPresignedUrl → REST upload
     *     3. AWS AppSync Storage manager (complex)
     *
     * Until implemented → throw.
     */
    notImplemented('upload', operation);
  },
};
