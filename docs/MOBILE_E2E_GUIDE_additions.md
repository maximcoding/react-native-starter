# MOBILE E2E GUIDELINES (PRODUCTION MOBILE ENGINEERING)

**Scope:** React Native 0.75+, TypeScript (strict), offline-first, pure native modules, enterprise feature-first architecture.  
**Mode:** Guidelines only — no implementations or code.

---

## A) PROJECT PRINCIPLES

- Pure React Native (**no Expo**).
- No Firebase **unless** added via RFC + security review.
- No Tailwind/NativeWind/Styled Components — **pure RN theming** only.
- Feature-first modular architecture under `src/features`.
- Deterministic, typed, predictable code.
- **No magic numbers** for spacing/colors/fonts (tokens only).
- Reusable, theme-driven **UI Kit**.
- Navigation **standardized** and **centralized**.
- **State:** Zustand for global UI, **React Query** for server data only.
- **API:** Zod-validated responses; pagination/caching/refetch via **React Query** only.
- Offline storage — **MMKV** only (plus Keychain/Keystore for secrets).
- Errors normalized globally.
- Full CI/CD for iOS & Android; OTA (CodePush) with staged rollout + rollback.
- **All third-party libs require RFC + security review.**

---

## B) TOP-LEVEL STRUCTURE

```
assets/            # fonts & svgs (no assets/index.ts), generated icons.ts
scripts/           # build/release/codegen tools (e.g., generate-icons.js)
ios/, android/     # native projects
fastlane/          # lanes & metadata
src/               # application code only
```

### Deeper `src/` Layout

```
src/
  app/             # presentation layer (UI kit + navigation + cross-app hooks/state)
    components/    # stateless primitives (theme-based)
    hooks/         # cross-app hooks
    navigation/    # root/stacks/tabs, options/presets/tokens, modals (global/half-sheet)
      helpers/ modals/ options/ root/ stacks/ tabs/ types/ routes.ts index.ts
    state/         # cross-feature Zustand slices (global UI only)

  features/        # feature packages (auth, user, home, settings, …)
    <feature>/
      screens/ components/ hooks/ services/ stores/
      models/   # Zod schemas + mappers
      api/      # query keys + endpoint defs

  core/
    config/       # app-config.ts, env.ts, feature-flags.ts, constants.ts
    i18n/         # i18n.ts, parser config, typed useT, locales (en/de/ru)
    native/       # device-info, haptics, permissions (JS wrappers)
    theme/        # tokens, light/dark, ThemeProvider, useTheme
    utils/        # cross-cutting utilities

  infra/
    error/        # normalize-error.ts
    http/         # axios.instance + interceptors + thin api.ts helper
    network/      # netinfo.ts (online/offline bridge)
    offline/      # offline-queue.ts, sync-engine.ts (replay)
    storage/      # mmkv.ts (KV abstraction), cache-engine.ts (snapshots)
    transport/    # adapters(rest/graphql/websocket/firebase), transport.ts, types
    query/        # client/provider, keys factory, policies, netmode, persistence (guidelines only)

  types/
    globals.d.ts  # svg declarations for react-native-svg components
```

> **Removed:** `_deprecated` folders; `assets/index.ts` does **not** exist.

---

## C) RESPONSIBILITIES & GUARDRAILS (BY AREA)

### C1) Assets
- **Fonts:** `assets/fonts/*`, registered per RN rules; referenced **only via theme tokens**.
- **SVGs:** `assets/svgs/*`, rendered as components via `react-native-svg-transformer`.
- **Icons Registry:** `assets/icons.ts` is **auto-generated** from `assets/svgs/*` by `scripts/generate-icons.js`.
- **Import Paths:** **only** `@assets/svgs/...`.
- **CI Guard:** job fails if `icons.ts` is stale vs `assets/svgs/**`.

### C2) Theming & UI Kit
- **Tokens:** spacing, radius, typography, elevation, **semantic colors** (light/dark parity).
- **No inline** hex/spacing/fonts; use tokens everywhere.
- **UI Kit:** `src/app/components/ui/` — stateless, theme-driven primitives; no business/API logic; static styles via `StyleSheet.create`.
- Every screen is **theme-aware** (light/dark).

### C3) Navigation
- React Navigation v6+: **Root** (App/Auth/Onboarding + Modals/**Half-Sheet**) → **Stack** → **Tabs**.
- **Presets:** base, header/back, full modal, half-sheet modal, tab options (**height 60px**, **no border**).
- **Centralized routes:** `app/navigation/routes.ts` (as const) + typed ParamLists under `app/navigation/types`.
- **Provider order:** **I18n → Theme → Query Provider → NavigationContainer** (policy).
- Half-sheet rules: drag-to-close, velocity dismiss, backdrop tap closes, safe-area padding (guideline).

### C4) State Management (Global UI) — **Zustand**
- **Slices only** (e.g., `auth.store.ts`, `prefs.store.ts`); **no monolithic** store.
- **What to store:** flags, enums, selected IDs, tiny derived booleans (e.g., `isLoggedIn`).
- **What not to store:** server collections/entities (React Query owns server state).
- **Actions:** atomic, predictable; **no side effects** inside store definitions.
- **Selectors:** always **narrow**; avoid “whole slice” selectors.
- **Persistence:** only **safe, small** bits (theme/locale) via MMKV; **no secrets/tokens** in Zustand persist.
- **Logout:** reset slices + clear sensitive storage.

### C5) Server State — **React Query (Guidelines Only)**
- **Keys format:** `[feature, entity, id?, params?]`
  - Pagination: `[feature, entity, 'infinite', params]`.
  - Keys built via helpers (infra `query/keys` or feature `api/keys.ts`) — **never** in components.
- **Freshness profiles:**
  - **realtime**: stale 0–5s; refetchOnFocus true; interval 5–15s **or** WS/Push invalidation.
  - **nearRealtime**: stale 30–120s; refetch on focus & reconnect.
  - **reference**: stale 1–24h; manual refetch only.
- **Global defaults (policy):** stale ~60s, gc ~5m, retry: 2 (5xx/429 only), refetchOnReconnect true, throwOnError false.
- **Network mode:** bridged from NetInfo (`online`/`offlineFirst`/`always`).
- **Mutations:** must provide `meta.tags`; on success → **targeted invalidations** (detail + lists).
- **Offline:** queue mutations; replay on reconnect; **invalidate by tags** (no global).
- **Conditional requests:** ETag / If-Modified-Since when backend supports.
- **Feature mapping:** `features/<feature>/api/keys.ts` keeps **tag → keys** mapping.
- **Testing:** hooks/services cover keys, staleness, offline, invalidations.

#### C5.1 Feature Policies (examples)
- **Auth**
  - Keys: `['auth','me']`, `['auth','session']` → profile: **nearRealtime**.
  - Mutations → invalidation:
    - `auth.login` → invalidate `['auth','me']`, `['auth','session']`
    - `auth.logout` → clear all auth keys + drop persisted cache + navigate `ROOT_AUTH`
    - `auth.refreshToken` → invalidate `['auth','session']` if payload changed
  - 401/403: no retry; trigger logout/refresh outside Query.
- **User**
  - Keys: `['user','byId', userId]` (**nearRealtime** or **reference**), `['user','list','infinite', params]` (**nearRealtime**).
  - Mutations → invalidation:
    - `user.updateProfile`/`updateAvatar` → invalidate detail + lists containing id
    - `user.create` → invalidate lists
    - `user.delete` → invalidate lists + drop local snapshots by id
  - Pagination: infinite only; reset on params change.

### C6) Services & API
- Feature services live under `src/features/<feature>/services`.
- Services interact with API/Zustand/React Query; **never return raw DTO** — map to domain models.
- **HTTP:** centralized Axios instance + interceptors (auth/error/logging), thin `api.ts` helper for trivial REST.
- Authentication handled via interceptor; tokens stored in Keychain/MMKV.
- Responses validated via **Zod**.
- **Forbid:** `fetch` and inline axios in screens/components.

### C7) Transport, Offline & Network
- **Transport layer:** `infra/transport/transport.ts` with adapters: REST/GraphQL/WebSocket/Firebase.
- **NetInfo:** `infra/network/netinfo.ts` toggles `transport.setOfflineMode`.
- **Offline queue:** `infra/offline/offline-queue.ts` (FIFO mutations while offline).
- **Sync engine:** `infra/offline/sync-engine.ts` replays on reconnect; stop on first fatal error; then **invalidate by tags**.
- **Cache engine:** `infra/storage/cache-engine.ts` — in-memory snapshots (future MMKV/SQLite).

### C8) Error Handling
- Single normalization point: `infra/error/normalize-error.ts`.
- **UI never sees raw API errors**; only normalized shape.
- **ErrorBoundary is required** for fatal UI crashes.
- Logging redacts sensitive info (Authorization).

### C9) Native Modules
- Swift/Kotlin under platform projects; JS wrappers in `src/core/native`.
- Use only allow-listed native deps; permissions via `react-native-permissions`.

### C10) Performance
- Long lists → **FlashList** (`estimatedItemSize`, item type hints when needed).
- Remote images → **FastImage**.
- Avoid inline functions in render; memoize heavy components.
- Lazy-load screens; preloading allowed; heavy tasks via **InteractionManager** after first paint.
- Track **TTMI** (time to meaningful interaction) per screen.

### C11) Security & Compliance
- Tokens & secrets only in **MMKV/Keychain/Keystore**; configs via `react-native-config`.
- Optional: clear sensitive data on background (product policy).
- Device integrity checks (root/jail/emulator/debug flags) — informational guard.
- No logging of sensitive data; sanitize outbound logs/analytics.
- **All new dependencies via RFC + security review.**

### C12) i18n
- Typed i18n; feature namespaces; `useT` helper.
- **Parity across locales** (`en`, `de`, `ru`); RTL readiness.
- Parser in CI to catch missing keys.

### C13) Testing
- Coverage: UI components (snapshot + behavior), hooks, services, API, stores, navigation flows.
- Deterministic: **no real IO** (network/storage/permissions mocked).
- Mock assets/SVGs with component stubs.
- Zod-validated fixtures for payloads.
- Snapshots for simple UI only; behavior tests for logic.

### C14) CI/CD & OTA
- **CI (GitHub Actions):** lint → typecheck → test → Android AAB → iOS IPA; cache Gradle/Pods; upload artifacts.
- **Guards:**
  - `check:icons` — `assets/icons.ts` freshness vs `assets/svgs/**`.
  - Import path policy — **no deep relatives**, use aliases only.
- **Fastlane:** `gym`, `match`, `pilot` (iOS), `supply` (Android), version bump, screenshots, changelog.
- **OTA (CodePush optional):** staged rollout, rollback rule, crash-rate threshold, native compatibility policy.

### C15) Code Style
- TS **strict**; named imports; default exports **only** for React components.
- Functional components; hooks start with `use`.
- Filenames: components **PascalCase**, hooks **camelCase**, stores/services **kebab-case**.
- **No deep relative imports**; use absolute imports; ESLint + Prettier enforced in CI.

### C16) Path Aliases & Types
- `@assets/*` → `assets/*`; `@/*`, `@app/*`, `@features/*`, `@core/*`, `@infra/*`, `@types/*`.
- `src/types/globals.d.ts` declares `*.svg` as react-native-svg components.

### C17) Icons Generator & Tooling
- `scripts/generate-icons.js` produces `assets/icons.ts` with `@assets/svgs/...` imports.
- Run `npm run gen:icons` after SVG changes.
- CI job fails if stale; husky pre-commit may run freshness & import-path guards.

### C18) Non-Functional Requirements (NFR)
- Accessibility on all interactive components (roles, labels, focus order, hitSlop, dynamic type).
- Theming compliance (no raw values), **contrast QA** for light/dark.
- Offline UX: cached data shows gracefully; pull-to-refresh always available.
- **TTMI budgets** per screen; perf budgets tracked.
- Security checklist per feature (secrets, logging, storage).
- Documentation governance: ADR/RFC templates; CI checks guide freshness.

### C19) AI Agent Rules
- **MUST:** follow folder structure & theme system; use UI Kit only; TS strict; typed navigation; provide full file paths when outputting code; ask for missing context.
- **MUST NOT:** add new deps; break structure; use inline styles (except dynamic); use `fetch`; use Redux/Tailwind/NativeWind; use Expo.

---

## D) “WHAT SHOULD BE DONE” (ACTIONABLE ROADMAP — GUIDELINES ONLY)

1. **UI Kit Hardening** — add required primitives (Input, Card, Spacer, Divider, Icon, Avatar, Badge, Loader); document token usage; accessibility rules.
2. **Cross-cutting Hooks** — `useOnlineStatus`, `useAppLaunch`, `useToast`, `useSafeAreaScroll` (design & contract only).
3. **Zustand** — define cross-feature slices (theme/locale); persist safe bits via MMKV; narrow selectors; logout reset policy.
4. **React Query Policies** — finalize freshness/retry matrices; keys factory usage; tag→keys mapping per feature; persistence & netmode policies documented.
5. **Domain Services** — auth/user contracts (schemas + mappers + error mapping); pagination spec (infinite keys & merge rules); auth lifecycle (attach/refresh/revoke).
6. **HTTP Policies** — timeouts, headers, retry/backoff matrix (5xx/429 only), idempotent mutation guidance.
7. **Transport ADR** — when to use REST/GraphQL/WebSocket/Firebase; how to route operations; offline queueing expectations.
8. **Offline Playbook** — queue triggers, replay strategy, conflict resolution policy (default: last-write-wins; feature overrides allowed), TTL per resource.
9. **Error Taxonomy** — codes/classes → user messages; toast/snackbar policy; redaction.
10. **Navigation Governance** — route naming, presets, deep linking, analytics screen names; half-sheet/modal rules.
11. **i18n** — namespaces per feature; parser in CI; parity across `en/de/ru`; RTL readiness.
12. **Testing Matrix** — across layers; deterministic; fixtures validated by Zod; asset/SVG mocks policy.
13. **CI/CD** — ensure guards (`check:icons`, import path policy) & artifacts; staged vs prod lanes with promotion gates; secrets via env only.
14. **Security** — sensitive data redaction, device integrity checks, config via env, key rotation doc.
15. **Performance** — FlashList for lists; FastImage for remote images; memoization; InteractionManager; TTMI budgets per screen.
16. **Documentation & Governance** — ADR/RFC templates; CI doc freshness check.

---

## E) PR CHECKLISTS

**React Query PR Checklist**
- [ ] Keys via `api/keys.ts` (not in components).
- [ ] Freshness profile from `policy/freshness.ts` (no magic numbers).
- [ ] Mutations include `meta.tags`; `api/keys.ts` contains tag→keys mapping.
- [ ] Zod validation before caching.
- [ ] Normalized errors only.
- [ ] Infinite pagination only.
- [ ] Offline behavior & post-replay invalidations defined.

**State & Stores PR Checklist**
- [ ] One responsibility per slice; no monolithic store.
- [ ] Actions atomic; no side effects in store definitions.
- [ ] Narrow selectors; components subscribe to specific fields.
- [ ] Persist only safe bits; secrets elsewhere.
- [ ] No duplication of server data (Query is source of truth).
- [ ] Logout resets slices + clears sensitive storage.

**Navigation PR Checklist**
- [ ] Routes from centralized `routes.ts`.
- [ ] ParamLists typed; presets used (base/header/back/full/half/tab).
- [ ] Half-sheet/modal follow gesture/backdrop/safe-area rules.
- [ ] Provider order respected (I18n → Theme → Query → Nav).

**Assets & Theming PR Checklist**
- [ ] No raw colors/spacing/fonts; tokens only.
- [ ] SVGs via `@assets/svgs/*`; `icons.ts` updated (`gen:icons`).
- [ ] Contrast compliance (light/dark).

**Security & NFRs PR Checklist**
- [ ] No sensitive logs; secrets in env; tokens in secure storage.
- [ ] Offline UX acceptable; TTMI budget met.
- [ ] i18n keys exist with locale parity.
