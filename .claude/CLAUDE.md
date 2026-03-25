# CLAUDE.md — React Native Starter

**Claude Code context** for this repo. **Canonical agent rules:** [AGENTS.md](../AGENTS.md) (structure, don’ts, “when adding”, documentation map). This file adds stack/commands for Claude; on conflict, prefer **AGENTS.md** and the codebase. **Path-scoped rules:** [.claude/rules/](rules/) (`config`, `features`, `shared-components`, `shared-services`).

## Project Overview

Production-oriented React Native starter for mobile apps: feature-first architecture, strict TypeScript, centralized theme and navigation, i18n, offline-ready infra, and pluggable transport (REST/GraphQL/WebSocket/Firebase). For teams building maintainable, offline-first RN apps.

## Tech Stack

- **Framework:** React Native 0.82.1 (bare workflow)
- **Language:** TypeScript (strict)
- **State Management:** Zustand (`src/shared/stores/`); TanStack React Query for server state
- **Navigation:** React Navigation v7; `src/navigation/routes.ts`, `root-param-list.ts`
- **Styling:** `src/shared/theme/`
- **Backend/API:** `src/shared/services/api/`
- **Auth:** interceptors in shared API; session in `src/session/`
- **Testing:** Jest (react-native preset), react-test-renderer; `jest.config.js`, `jest.setup.js`
- **CI/CD:** GitHub Actions — `.github/workflows/ci.yml` (PR checks), `.github/workflows/android-ci.yml`, `.github/workflows/ios-ci.yml` (manual); Fastlane optional — not in this template (add under `fastlane/` for store releases; see [docs/OPERATIONS.md](../docs/OPERATIONS.md#github-actions))

## Project Structure

```
src/
├── navigation/            # App wiring: stacks, tabs, routes, modals — imports features
├── session/               # Bootstrap, logout, session-bridge — app infrastructure
├── config/                # Env, constants, feature flags
├── i18n/                  # useT, locales, extraction
├── shared/                # Cross-cutting code — must NOT import from features
│   ├── components/ui/     # Button, Text, ScreenWrapper, …
│   ├── hooks/
│   ├── constants/         # shared non-config constants (not storage keys; tag arrays belong in feature api/keys.ts)
│   ├── services/api|storage/
│   ├── stores/
│   ├── theme/
│   ├── utils/
│   └── types/
├── features/<feature>/    # per slice: types/, screens/, components/, hooks/, services/, api/, navigation/
assets/
scripts/
ios/, android/     # native projects (Fastlane optional — add fastlane/ when needed)
```

Feature code lives under `src/features/<feature>/`: `screens/`, `components/`, `hooks/`, **`types/`** (interfaces + type aliases), `services/` (Zod + mappers + service modules), `api/keys.ts`, `navigation/param-list.ts`.

## Key Commands

```bash
# Install
npm install

# Metro
npm start

# Run
npm run ios
npm run android

# Test
npm test
npm test -- --testPathPattern=<path>

# Biome & type check
npm run lint   # biome check .
npx tsc --noEmit

# i18n
npm run i18n:all
npm run i18n:extract
npm run i18n:types

# Icons
npm run gen:icons
npm run check:icons

# Guards
npm run check:imports

# Build
npm run android:build:release   # Android
# iOS via Xcode / fastlane
```

## Architecture & Patterns

- **Component pattern:** Functional components only; no class components.
- **File naming:** PascalCase for components (e.g. `ScreenWrapper.tsx`); camelCase or kebab for utils/services (e.g. `navigation-helpers.ts`, `auth.service.ts`).
- **Exports:** Named exports for components/hooks; screens follow existing files.
- **API layer:** `src/shared/services/api/`; feature services in `features/<name>/services/`; domain types in `features/<name>/types/`; Zod validation.
- **Error handling:** `src/shared/utils/normalize-error.ts`, `toast.ts`.
- **Navigation typing:** `src/navigation/routes.ts`.

## Coding Rules

- Use path aliases `@/` (maps to `src/`) and `@assets/` (maps to `assets/`) only (e.g. `@/navigation/`, `@/shared/components/ui/`, `@assets/icons/logo.svg`); no deep relative imports; `npm run check:imports`.
- Prefer `StyleSheet.create()` over inline styles; inline only for dynamic values; no raw colors/spacing/fonts — theme tokens only.
- No `any`; use `unknown` and type guards when uncertain.
- Async: handle loading, success, and error; React Query for server state; mutations with `meta.tags` and targeted invalidation.
- Platform-specific code: use `Platform.select()` or `.ios.tsx`/`.android.tsx`.
- User-facing strings via `src/i18n/`; `useT()` / `t()`.
- No new dependencies without RFC/agreed process. No Tailwind, NativeWind, Redux, Styled Components.
- Ask for missing context when unclear.
- Use full file paths when outputting code.

## State Management Conventions

- **Global UI state:** `src/shared/stores/`.
- **Server state:** React Query; `src/shared/services/api/query/`.
- **Local UI state:** `useState` in components; don’t lift to global unless shared across screens.

## Testing Conventions

- Jest + react-native preset; setup in `jest.setup.js`.
- Test files: colocate (e.g. `Button.test.tsx` next to `Button.tsx`) or under `__tests__/` (e.g. `__tests__/App.test.tsx`).
- Prefer testing user-visible behavior; mock external services as needed.
- Run `npm test` before committing; CI can run tests.

## Environment & Config

- **react-native-config:** `src/config/env.ts`.
- Never commit `.env`; use `.env.example` as template.
- App config: `src/config/` (not inside `shared/`).

## Platform-Specific Gotchas

- **Android:** KeyboardAvoidingView behavior; Hermes — date/i18n polyfills if needed; use `react-native-safe-area-context` for safe areas.
- **iOS:** SafeAreaView from RN vs safe-area-context; simulator limitations for push/keys as noted in guides.
- **General:** Match `App.tsx` provider order exactly: `GestureHandlerRootView` → `SafeAreaProvider` → `ThemeProvider` → `ErrorBoundary` → `QueryProvider` → (`OfflineBanner` + `NavigationRoot`). The i18n side-effect import (`import '@/i18n/i18n'`) is a module-level import above the component.

## Terminology

- **Route:** `src/navigation/routes.ts`.
- **Transport:** `src/shared/services/api/transport/`.
- **Query key / tag:** React Query key shape and tags for invalidation; defined in feature `api/keys.ts`.

## References

- **Navigation & route constants:** `src/navigation/` (`routes.ts`, stacks, tabs).
- **Theme & query client infra:** `src/shared/theme/`, `src/shared/services/api/query/`.
- **Feature API logic:** `src/features/<name>/services/`; **feature types:** `src/features/<name>/types/`.

## Docs

Same **topic-to-doc** matrix as [AGENTS.md#documentation-map](../AGENTS.md#documentation-map) (canonical). Root [README.md](../README.md) is the only project README; do not duplicate the full table there.

| Doc | Role |
|-----|------|
| [README.md](../README.md) | Landing: quick start, setup, env, links |
| [AGENTS.md](../AGENTS.md) | Agents/humans: rules, where code lives, doc map |
| This file | Claude Code stack reference + commands |
| [docs/development.md](../docs/development.md) | Hooks, architecture, icons, i18n, npm scripts |
| [.claude/rules/](rules/) | Scoped agent rules: assets, navigation, state, react-query, performance, security, i18n, testing, features, shared-components, shared-services, config |
| [docs/OPERATIONS.md](../docs/OPERATIONS.md) | Sentry, Maestro, CI, OTA, publishing |
| [docs/OFFLINE.md](../docs/OFFLINE.md) | Offline stack |
| [docs/permissions-bare-rn.md](../docs/permissions-bare-rn.md) | Permission catalog |
| [docs/TODO.md](../docs/TODO.md) | Roadmap / backlog |
| [CONTRIBUTING.md](../CONTRIBUTING.md) | PRs, changelog, quality checks, security reporting |
| [CHANGELOG.md](../CHANGELOG.md) | Version history |

## MCP Servers

Figma MCP is configured for design-to-code (get_design_context, etc.). Use for Figma URLs and design references.

## Common Pitfalls — Do NOT

- Do NOT add new npm packages without asking/RFC.
- Do NOT change any package version in `package.json` or `package-lock.json`. Fix consuming code to match the installed version instead.
- Do NOT use `fetch`; use project HTTP/transport only.
- Do NOT put feature logic in `src/shared/components/ui/` or `src/shared/stores/`.
- Do NOT use raw colors/spacing/fonts in UI; use theme tokens.
- Do NOT use Tailwind, NativeWind, or Styled Components.
- Do NOT create screens outside feature structure; use `src/features/<feature>/screens/`.
- Do NOT use deep relative imports; use path aliases only (enforced by check:imports).
- Do NOT forget to run `npm run gen:icons` and `npm run check:icons` when adding/changing SVGs under assets.
