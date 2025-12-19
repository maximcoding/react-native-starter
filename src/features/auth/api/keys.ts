// 2025 — features/auth/api/keys.ts
/**
 * PURPOSE:
 *   Centralized React Query keys for the Auth feature + tag→keys map
 *   used for targeted invalidations after mutations.
 *
 * FORMAT (STRICT):
 *   [feature, entity, id? , params?]
 *   Examples:
 *     ['auth','me']
 *     ['auth','session']
 *
 * RULES:
 *   - Components do NOT assemble keys manually.
 *   - Mutations specify meta.tags (e.g., 'auth:me') and use this map.
 */

import { qk } from '@/infra/query/keys/factory';

export const authKeys = {
  // Singletons
  me: () => qk('auth', 'me'),
  session: () => qk('auth', 'session'),

  /**
   * Tag → keys mapping for invalidation after mutations.
   * Example usage:
   *   [authKeys.tagMap['auth:me'], authKeys.tagMap['auth:session']]
   *     .flat()
   *     .forEach((getKey) => qc.invalidateQueries({ queryKey: getKey() }));
   */
  tagMap: {
    'auth:me': [() => authKeys.me()],
    'auth:session': [() => authKeys.session()],
  } as const,
};

export type AuthTag = keyof typeof authKeys.tagMap;
