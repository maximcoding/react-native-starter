// 2025 — infra/query/persistence/limits.ts
/**
 * GUIDELINE: Persistence Limits & TTL Matrix (NO implementation)
 * ------------------------------------------------------------------
 * PROFILES
 *   realtime:
 *     ttl: 5–15s
 *     refetch: interval OR WS/Push invalidation
 *   nearRealtime:
 *     ttl: 30–120s
 *     refetch: on focus + on reconnect
 *   reference:
 *     ttl: 1–24h
 *     refetch: manual (pull-to-refresh)
 *
 * SIZE BUDGETS
 *   - Define total cache budget (e.g., 10–20 MB)
 *   - Evict LRU when above budget (policy-level note)
 */
export {};
