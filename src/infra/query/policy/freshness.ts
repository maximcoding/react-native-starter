// 2025 — infra/query/policy/freshness.ts
/**
 * GUIDELINE: Freshness Profiles (NO implementation)
 * ------------------------------------------------------------------
 * PROFILES
 *   realtime:
 *     staleTime: 0–5000ms
 *     refetchOnFocus: true
 *     refetchInterval: 5–15s OR prefer WS/Push invalidation
 *
 *   nearRealtime:
 *     staleTime: 30–120s
 *     refetchOnFocus: true
 *     refetchOnReconnect: true
 *
 *   reference:
 *     staleTime: 1–24h
 *     refetchOnFocus: false
 *     manual refresh only
 *
 * ASSIGNMENT
 *   - Each feature/hook references one profile; never hardcode numbers in UI.
 */
export {};
