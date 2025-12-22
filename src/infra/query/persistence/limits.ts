// src/infra/query/persistence/limits.ts
/**
 * FILE: limits.ts
 * LAYER: infra/query/persistence
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Centralized persistence TTL and filtering rules for React Query cache.
 *   Used by PersistQueryClientProvider via dehydrateOptions.
 *
 * HOW IT WORKS:
 *   - Each query can specify meta.persistence:
 *       'realtime' | 'nearRealtime' | 'reference' | 'none'
 *   - Only safe profiles are persisted by policy.
 *   - TTL is applied at dehydrate time to avoid writing stale data.
 * ---------------------------------------------------------------------
 */

export type PersistenceProfile =
  | 'realtime'
  | 'nearRealtime'
  | 'reference'
  | 'none';

export const PersistenceTTL: Record<
  Exclude<PersistenceProfile, 'none'>,
  number
> = {
  realtime: 15_000, // 15s (upper bound)
  nearRealtime: 120_000, // 2m
  reference: 24 * 60 * 60 * 1000, // 24h
};

export const PersistencePolicy = {
  /**
   * Global toggle: which profiles are allowed to be persisted.
   * Обычно realtime НЕ сохраняем (слишком часто меняется и раздувает кэш).
   */
  allowedProfiles: new Set<PersistenceProfile>(['nearRealtime', 'reference']),

  /**
   * Default profile if feature forgot to set meta.persistence.
   * Рекомендую nearRealtime, но можно 'none' для строгого режима.
   */
  defaultProfile: 'nearRealtime' as Exclude<PersistenceProfile, 'none'>,

  /**
   * Hard safety: never persist queries that are explicitly marked sensitive.
   * Feature can set meta.sensitive = true
   */
  isSensitive(meta: unknown): boolean {
    return Boolean((meta as any)?.sensitive);
  },

  /**
   * Read profile from query meta.
   */
  getProfile(meta: unknown): PersistenceProfile {
    const p = (meta as any)?.persistence as PersistenceProfile | undefined;
    return p ?? PersistencePolicy.defaultProfile;
  },

  /**
   * TTL check based on query state timestamps.
   * We consider dataUpdatedAt as freshness source.
   */
  isFreshEnough(profile: PersistenceProfile, dataUpdatedAt: number): boolean {
    if (profile === 'none') return false;
    const ttl = PersistenceTTL[profile as Exclude<PersistenceProfile, 'none'>];
    return Date.now() - dataUpdatedAt <= ttl;
  },
} as const;
