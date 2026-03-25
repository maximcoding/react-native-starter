---
globs: src/features/*/api/**,src/features/*/hooks/**
---

Global rules: [AGENTS.md](../../AGENTS.md). Claude stack summary: [CLAUDE.md](../CLAUDE.md).

# Rules — React Query (server state)

## Key format
```
[feature, entity]                       # list / collection
[feature, entity, id]                   # detail
[feature, entity, id, params]           # detail with filters
[feature, entity, 'infinite', params]   # paginated list
```
Keys are defined in `src/features/<name>/api/keys.ts` — never inline in components or hooks.

## Freshness profiles (`src/shared/services/api/query/policy/freshness.ts`)
| Profile | `staleTime` | `gcTime` | Notes |
|---------|-------------|----------|-------|
| `realtime` | 5 s | 5 min | Use WS/Push invalidation where possible |
| `nearRealtime` | 60 s | 5 min | Default — used by `createQueryClient` |
| `reference` | 1 h | 24 h | Manual refetch only |

Never hardcode numeric stale/gc values — always reference a `Freshness` profile.

## Global defaults (enforced in `createQueryClient`)
- Retry: up to 2 times, 5xx / 429 only — never retry `NETWORK_OFFLINE`.
- `refetchOnReconnect: true`, `throwOnError: false`.
- Error toasts suppressed for `NETWORK_OFFLINE` (both queries and mutations).

## Must
- Every mutation must include `meta.tags` for targeted invalidation.
- On mutation success: invalidate via `invalidate-by-tags.ts` using `meta.tags` — no global `invalidateQueries`.
- Validate API responses with Zod **before** caching — never cache a raw DTO.
- Expose only normalized errors (`normalize-error.ts`) — UI must never see raw API error shapes.
- Pagination: infinite queries only (`useInfiniteQuery`); reset on params change.

## Must not
- No React Query keys inline in components — always use `api/keys.ts`.
- No tag arrays (e.g. `['auth:me', 'auth:session']`) inline in hooks — export named arrays from the feature's `api/keys.ts` and import from there.
- No `invalidateQueries()` without a targeted key — use tag-based invalidation.
- No magic `staleTime` / `gcTime` numbers — use `Freshness` profiles.
- No server data duplicated in Zustand.
