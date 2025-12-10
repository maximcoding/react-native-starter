/**
 * FILE: cache-engine.ts
 * LAYER: infra/storage
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Lightweight offline-first snapshot cache. NOT persistent.
 *   Used by services and query layers as a minimal data cache before
 *   integrating MMKV/SQLite-based persistence.
 *
 *   Designed to support:
 *     - stale-while-revalidate patterns
 *     - offline fallback
 *     - domain-level prefetching
 *     - high-level services using transport.query()
 *
 * RESPONSIBILITIES:
 *   - setSnapshot(key, data)
 *   - getSnapshot(key)
 *   - removeSnapshot(key)
 *   - clear()
 *   - (future) TTL, versioning, hydration, serialization
 *
 * DATA-FLOW:
 *   ONLINE:
 *     transport.query()
 *        → cacheEngine.setSnapshot()
 *        → UI reads via cacheEngine.getSnapshot()
 *
 *   OFFLINE:
 *     transport.query() throws offline
 *        → UI falls back to cacheEngine.getSnapshot()
 *
 * EXTENSION GUIDELINES:
 *   - Replace Map with MMKV/SQLite for persistence.
 *   - Add TTL per entry:
 *         MEMORY_CACHE.set(key, { data, cachedAt, ttlMs })
 *
 *   - Add versioning per domain:
 *         { version: schemaVersion, data }
 *
 *   - Add "listeners" (pub/sub):
 *         cacheEngine.subscribe(key, callback)
 *
 *   - Keep API stable — do NOT change public signatures.
 *
 * THREAD SAFETY:
 *   RN JS runtime is single-threaded → Map is safe.
 *   When migrating to native storage, ensure atomic writes.
 * ---------------------------------------------------------------------
 */

type CacheValue = unknown;

const MEMORY_CACHE = new Map<string, CacheValue>();

export const cacheEngine = {
  /**
   * Save snapshot under the provided key.
   * Keys SHOULD be namespaced (e.g., "user.profile", "feed.home", etc.)
   */
  setSnapshot(key: string, value: CacheValue) {
    MEMORY_CACHE.set(key, value);
  },

  /**
   * Retrieve previously cached snapshot.
   * Returns undefined if nothing is cached.
   */
  getSnapshot<T>(key: string): T | undefined {
    return MEMORY_CACHE.get(key) as T | undefined;
  },

  /**
   * Remove specific snapshot entry.
   */
  removeSnapshot(key: string) {
    MEMORY_CACHE.delete(key);
  },

  /**
   * Clear entire snapshot cache.
   * Called typically on logout or environment reset.
   */
  clear() {
    MEMORY_CACHE.clear();
  },

  /**
   * FUTURE API:
   * - getMeta(key) → TTL, version
   * - subscribe(key, cb) → pub/sub
   * - hydrateFromMMKV()
   * - persistToMMKV()
   */
};
