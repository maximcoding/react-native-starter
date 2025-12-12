// 2025 — infra/query/client/query-client.ts
/**
 * GUIDELINE: React Query Client (NO implementation)
 * ------------------------------------------------------------------
 * PURPOSE
 *   Single place to define global defaults for @tanstack/react-query:
 *   - staleTime / gcTime
 *   - retry / backoff (see policy/retry.ts)
 *   - refetchOnReconnect / refetchOnFocus
 *   - networkMode ('online' | 'offlineFirst' | 'always') via netmode
 *   - error handling → infra/error/normalize-error.ts
 *
 * DEFAULTS (RECOMMENDED)
 *   staleTime:            60_000 ms (1 min)
 *   gcTime:               300_000 ms (5 min)
 *   retry:                2 (5xx/429 only)
 *   refetchOnFocus:       true (nearRealtime), false (reference)
 *   refetchOnReconnect:   true
 *   networkMode:          'online' (switch via netmode on connectivity)
 *   throwOnError:         false (UI sees normalized errors only)
 *
 * INTEGRATIONS
 *   - NetInfo bridge: infra/query/netmode/network-mode.ts
 *   - Cache persistence: infra/query/persistence/mmkv-persister.ts
 *   - Error shape: infra/error/normalize-error.ts
 *
 * RULES
 *   - No axios/fetch here. No business logic.
 *   - Hooks in features must reference profiles in policy/*.ts.
 */
export {};
