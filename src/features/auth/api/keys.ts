// src/features/auth/api/keys.ts
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
import type { TagMap } from '@/infra/query/tags';

// ---- key builders (NO self-reference) ----

const me = () => qk('auth', 'me');
const session = () => qk('auth', 'session');

const prefixes = {
  all: () => qk('auth'),
} as const;

const tagMap = {
  'auth:me': [me],
  'auth:session': [session],
  'auth:all': [prefixes.all],
} as const satisfies TagMap;

// ---- exported API ----

export const authKeys = {
  me,
  session,
  prefixes,
  tagMap,
} as const;

export type AuthTag = keyof typeof tagMap;
