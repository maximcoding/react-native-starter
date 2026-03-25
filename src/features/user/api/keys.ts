// src/features/user/api/keys.ts
/**
 * Centralized React Query keys for the User feature + tag→keys map.
 * Key format (strict):
 *   [feature, entity, id? , params?]
 *   Infinite pagination: [feature, entity, 'infinite', params]
 */

import {
  byIdKey,
  infiniteKey,
  qk,
} from '@/shared/services/api/query/keys/factory'
import type { TagMap } from '@/shared/services/api/query/tags'

// ---- key builders (NO self-reference) ----

const me = () => byIdKey('user', 'profile', 'me')

const byId = (id: string | number) => byIdKey('user', 'profile', id)

const infinite = (params?: Record<string, unknown>) =>
  infiniteKey('user', 'list', params)

const prefixes = {
  profiles: () => qk('user', 'profile'),
  listInfinite: () => qk('user', 'list', 'infinite'),
} as const

const tagMap = {
  'user:me': [me],
  'user:profiles': [prefixes.profiles],
  'user:list': [prefixes.listInfinite],
} as const satisfies TagMap

// ---- exported API ----

export const userKeys = {
  me,
  byId,
  infinite,
  prefixes,
  tagMap,
} as const

export type UserTag = keyof typeof tagMap

export const USER_PROFILE_TAGS = [
  'user:me',
  'user:list',
] as const satisfies readonly UserTag[]
