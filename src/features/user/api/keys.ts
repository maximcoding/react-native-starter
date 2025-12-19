// src/features/user/api/keys.ts
/**
 * Centralized React Query keys for the User feature + tag→keys map.
 * Key format (strict):
 *   [feature, entity, id? , params?]
 *   Infinite pagination: [feature, entity, 'infinite', params]
 */
import { byIdKey, infiniteKey } from '@/infra/query/keys/factory';

export const userKeys = {
  /** Singleton: current user ("me") detail key */
  me: () => byIdKey('user', 'profile', 'me'),

  /** Detail by id */
  byId: (id: string | number) => byIdKey('user', 'profile', id),

  /** Infinite list (pagination) */
  infinite: (params?: Record<string, unknown>) =>
    infiniteKey('user', 'list', params),

  /**
   * Tag → keys mapping for precise invalidations after mutations.
   */
  tagMap: {
    'user:me': [() => userKeys.me()],
    'user:list': [() => userKeys.infinite()],
  } as const,
};

export type UserTag = keyof typeof userKeys.tagMap;
