// 2025 — infra/query/policy/retry.ts
/**
 * GUIDELINE: Retry / Backoff Matrix (NO implementation)
 * ------------------------------------------------------------------
 * RETRY RULES
 *   - 5xx errors: retry 2–3 times with exponential backoff + jitter
 *   - 429: retry respecting Retry-After header
 *   - 4xx (except 429): no retry
 *   - 401/403: no retry — trigger auth/refresh flow (outside Query)
 *
 * CANCELLATION
 *   - Cancel inflight queries on unmount if non-critical
 *   - Prefer deduplication to avoid duplicate traffic
 */
export {};
