---
globs: src/shared/services/**
---

Global rules: [AGENTS.md](../../AGENTS.md). Claude stack summary: [CLAUDE.md](../CLAUDE.md).

# Rules — shared/services

Infrastructure-level data layer. Split into two sub-trees:

```
shared/services/
  api/
    http/          # axios instance + interceptors (auth, error, logging, refresh)
    transport/     # pluggable adapters: rest (apisauce), graphql, websocket, firebase, mock (dev-only)
    query/
      client/      # QueryClient instance + provider
      policy/      # retry.ts, freshness.ts
      persistence/ # mmkv-persister.ts, limits.ts
      netmode/     # network-mode.ts
      helpers/     # invalidate-by-tags.ts
      keys/        # factory.ts (shared key factory)
      tags.ts      # invalidation tag constants
    network/       # netinfo wrapper
    offline/       # offline-queue.ts, sync-engine.ts
  monitoring/
    sentry.ts      # Sentry init + shared capture helpers
  storage/
    mmkv.ts        # kvStorage singleton
    cache-engine.ts
    zustand-mmkv-storage.ts
```

## Must
- All HTTP calls must go through `http/http.client.ts` (exported `httpClient`) / `http/api.ts` helpers or a `transport/` adapter — never bare `fetch`.
- Every adapter must pass responses through `src/shared/utils/normalize-error.ts` for consistent error shapes.
- React Query client configuration (staleTime, retry, persistence) must live in `query/policy/`, `query/client/`, or `query/persistence/` — not scattered across feature hooks.
- Tag-based cache invalidation must use `query/helpers/invalidate-by-tags.ts`. The `Tag`, `TagMap`, and `KeyGetter` types live in `query/tags.ts`; feature tag arrays (e.g. `AUTH_SESSION_TAGS`) and tagMaps belong in each feature's `api/keys.ts`.
- MMKV key strings must be imported from `src/config/constants.ts`.
- Sentry calls (`captureException`, `captureMessage`) must go through `monitoring/sentry.ts` helpers — do not call the Sentry SDK directly in feature code.
- The mock transport adapter (`transport/adapters/mock.adapter.ts`) is dev-only; it must be gated by `flags.USE_MOCK` from `src/config/constants.ts`.

- UI must never receive raw API errors — every error must pass through `src/shared/utils/normalize-error.ts` before reaching a component or hook.
- Logging inside interceptors must redact sensitive fields (`Authorization`, tokens, passwords) before writing to console or Sentry.
- `ErrorBoundary` (`src/shared/components/ui/ErrorBoundary.tsx`) is required for fatal UI crash paths; wire `captureBoundaryError` via its `onError` prop (see `App.tsx`).

## Must not
- Do not import from `src/features/**` — this layer is feature-agnostic.
- Do not put business logic or domain models here. Domain logic belongs in `src/features/<name>/services/`; domain **interfaces and type aliases** belong in `src/features/<name>/types/`.
- Do not use Zustand stores inside this layer — pass data up via return values or callbacks.
- Do not return raw DTOs from service functions — always map to a domain model.
