# Developer guide

Companion to the root [README.md](../README.md). For **where code lives** and agent rules, see [AGENTS.md](../AGENTS.md).

---

## Repository layout

ASCII overview of top-level folders (rules for imports and boundaries: [AGENTS.md](../AGENTS.md)).

```
src/
├── navigation/                 # App wiring: stacks, tabs, routes, modals, helpers
├── session/                    # Bootstrap, logout, session-bridge
├── config/                     # App-level: env, constants, feature-flags
├── i18n/                       # useT, locales, extraction
├── shared/                     # Cross-app code (must NOT import from features)
│   ├── components/ui/          # Button, Text, ScreenWrapper, OfflineBanner, IconSvg, ErrorBoundary, Activity, SuspenseBoundary
│   ├── hooks/                  # Shared hooks (useAppState, useToggle, …)
│   ├── constants/              # Shared non-config constants (tag arrays belong in feature api/keys.ts)
│   ├── services/
│   │   ├── api/                # http, transport, query, network, offline
│   │   ├── monitoring/         # Optional Sentry init + boundary reporting (see OPERATIONS.md#sentry)
│   │   └── storage/            # MMKV, cache, Zustand persistence adapter
│   ├── stores/                 # Zustand global UI state only
│   ├── utils/                  # normalize-error, toast, platform/
│   ├── theme/                  # Tokens, ThemeProvider, useTheme
│   └── types/                  # Global types (e.g. SVG declarations)
└── features/                   # Per-feature slices
    └── <feature>/
        ├── types/              # Interfaces + type aliases (index.ts barrel)
        ├── screens/
        ├── components/
        ├── hooks/
        ├── services/
        ├── api/
        └── navigation/

assets/
├── svgs/                       # Source SVGs — run gen:icons after changes
├── bootsplash/                 # Splash PNG scales + manifest (written by `npm run bootsplash:generate`)
├── bootsplash-logo.svg         # Optional launcher icon fallback source (used when PNG sources are missing)
├── app-icon.png                # Optional launcher icon fallback source (used when bootsplash PNGs are missing)
├── logo.png                    # Optional bootsplash override when SVG absent (else `bootsplash/logo.png`)
└── icons.ts                    # Auto-generated icon registry (never edit manually)
```

---

## Hooks

Reusable hooks in `@/shared/hooks` — import and use across any feature.

| Hook | What it does |
|------|----------------|
| `useAppState` | Track foreground / background lifecycle |
| `useBackHandler` | Intercept Android hardware back button |
| `useKeyboard` | Keyboard visibility and height |
| `useRefreshControl` | Pull-to-refresh state for lists |
| `useDebounce` / `useDebouncedValue` | Delay a value (e.g. search, autosave) |
| `useTimeout` | Declarative `setTimeout` with cleanup |
| `useInterval` | Declarative `setInterval` with optional pause |
| `useCountdown` | Countdown timer with start / pause / resume / stop |
| `useToggle` | Boolean state plus toggle / setTrue / setFalse |
| `usePrevious` | Previous render's value |
| `useMountEffect` | Run an effect once on mount |
| `useIsFirstRender` | `true` only on first render |
| `useArray` | Managed array with push, removeAt, updateAt, clear |
| `useAsync` | Async function → loading / error / data state |
| `useForm` | Lightweight form state and validation |
| `useClipBoard` | Clipboard read/write and local state |
| `useWindowDimensions` | Screen dimensions (re-export from React Native) |
| `useToast` | Show toast / error toast |
| `useAppLaunch` | App bootstrap ready |
| `useSafeAreaScroll` | Safe area insets for ScrollView content |
| `useOnlineStatus` | Online / offline status |

---

## Architecture overview

| Directory | Purpose |
|-----------|---------|
| `src/navigation/` | Stacks, tabs, routes, modals |
| `src/session/` | Bootstrap, logout, session bridge |
| `src/config/` | Env, constants, feature flags |
| `src/i18n/` | useT, locales, extraction |
| `src/shared/` | Cross-app: components, hooks, services, stores, utils, theme, types |
| `src/features/<name>/` | Product slices |

### Transport & Services

| Adapter | Use case |
|---------|----------|
| `rest.adapter.ts` | REST (apisauce) |
| `mock.adapter.ts` | Local / dev mock data |
| `graphql.adapter.ts` | GraphQL |
| `websocket.adapter.ts` | WebSocket |
| `firebase.adapter.ts` | Firebase |

### Offline Infrastructure

Full behavior, limits, and file map: **[OFFLINE.md](OFFLINE.md)**. In short: while offline the shared transport **queues** mutations; on reconnect the sync engine **replays** them. **Reads** offline come mainly from **TanStack Query cache persisted to MMKV**, not from the in-memory `cache-engine` (optional service snapshots).

| File | Role |
|------|------|
| `src/shared/services/api/offline/offline-queue.ts` | Buffer mutations/uploads while offline (in-memory; see doc) |
| `src/shared/services/api/offline/sync-engine.ts` | Replay queue when online; optional tag invalidation |
| `src/shared/services/storage/cache-engine.ts` | Optional in-memory snapshots (not the primary offline read path) |
| `src/shared/services/api/network/netinfo.ts` | NetInfo bridge → offline flag + replay trigger |

### React Query

| What | Where / Format |
|------|----------------|
| Server state | TanStack Query v5 |
| Keys | `src/features/<name>/api/keys.ts` — `[feature, entity, id?, params?]` |
| Invalidation | Mutations use `meta.tags` |
| Persistence | MMKV and `@tanstack/react-query-persist-client` (policy in `persistence/limits.ts`) — see [OFFLINE.md](OFFLINE.md) for how this relates to offline |

### State & storage (when to use what)

| Need | Use | Where |
|------|-----|-------|
| Key-value (sync) | MMKV | `src/shared/services/storage/mmkv.ts` (`kvStorage`); key names in `src/config/constants.ts` |
| Server / API data | TanStack Query | Feature `api/keys.ts`; e.g. `useMeQuery`, `useLoginMutation` |
| Global UI state | Zustand | `src/shared/stores/app.store.ts`; `zustand-mmkv-storage.ts` — no server data |

### Monitoring (Sentry)

| What | Where |
|------|--------|
| Init | `initSentry()` from `src/shared/services/monitoring/sentry.ts` — called at app startup in [`App.tsx`](../App.tsx) |
| React render errors | `ErrorBoundary` uses `onError={captureBoundaryError}` so class-boundary failures reach Sentry when configured |
| Native / JS crashes | Handled by `@sentry/react-native` once `SENTRY_DSN` is set; production source maps: follow [OPERATIONS.md#sentry](OPERATIONS.md#sentry) |

---

## Shared UI: loading, async, errors

| Component | Path | Role |
|-----------|------|------|
| **`ErrorBoundary`** | `src/shared/components/ui/ErrorBoundary.tsx` | Catches subtree render errors; themed + i18n fallback; optional `onError` (app wires Sentry) |
| **`Activity`** | `src/shared/components/ui/Activity.tsx` | Spinner / busy state for a mounted subtree (visibility or layout collapse) |
| **`SuspenseBoundary`** | `src/shared/components/ui/SuspenseBoundary.tsx` | Themed `Suspense` fallback for `React.lazy` / `useSuspenseQuery` — use under `ThemeProvider` |

`App.tsx` wraps the main tree with **`ThemeProvider` → `ErrorBoundary` → `QueryProvider` → …** so the boundary can use theme and translations in its fallback.

---

## Feature development

### Guide for adding a New Feature

1. **Create the directory structure:**

```
src/features/<feature-name>/
  screens/              # Screen components
  components/           # Feature-local components
  hooks/                # Feature-local hooks
  types/                # Interfaces and type aliases (barrel: index.ts)
  services/<name>/      # Zod schemas, mappers, service module
  api/
    keys.ts             # React Query key factory
  navigation/
    param-list.ts       # Stack/tab ParamList types for this feature
```

2. **Build screens** using `ScreenWrapper` as the root and theme-driven components — not raw RN views.

3. **Add translations** in `src/i18n/locales/en.json` (and `de.json`, `ru.json`). Run `npm run i18n:all` after.

4. **Types & service layer** — Domain types in `src/features/<name>/types/` with a barrel `index.ts` (import via `@/features/<name>/types`); API logic in `src/features/<name>/services/` (Zod schema, mapper, service module). Screens use feature services only — not the shared HTTP layer directly.

5. **Wire navigation** — add the route in `src/navigation/routes.ts`, `ParamList` entry, register in stack/tab.

---

## SVG icons

The project uses a code-generation workflow to keep SVG assets in sync with a type-safe icon registry.

### How it works

1. **Source:** Drop `.svg` files into `assets/svgs/`.
2. **Generate:** Run `npm run gen:icons` — the script (`scripts/generate-icons.js`) reads every `.svg` file in that directory and writes `assets/icons.ts`. **Never edit `assets/icons.ts` manually** — it is always overwritten.
3. **Output:** `assets/icons.ts` exports:
   - `IconName` enum — one entry per SVG (e.g. `IconName.ARROW_RIGHT`)
   - `AppIcon` registry — maps each `IconName` to its imported SVG component
   - `IconNameType` — union type of all valid icon keys

### Full workflow

```bash
# 1. Add your SVG file
cp my-icon.svg assets/svgs/my-icon.svg

# 2. Regenerate the registry
npm run gen:icons

# 3. Verify icons.ts is in sync (also runs in CI)
npm run check:icons
```

### Using an icon in code

```tsx
import { AppIcon, IconName } from '@assets/icons';

const ArrowIcon = AppIcon[IconName.ARROW_RIGHT];

<ArrowIcon width={24} height={24} />
```

### CI guard

`npm run check:icons` (`scripts/check-icons-stale.js`) compares the SVG files in `assets/svgs/` against the imports in `assets/icons.ts`. It exits with a non-zero code if they are out of sync — add this step to your CI pipeline to catch forgotten regenerations.

```
[FAIL] assets/icons.ts is stale vs assets/svgs
  Not imported:
   - my-new-icon.svg

Run: npm run gen:icons
```

### Naming convention

SVG filenames are converted automatically:

| File | `IconName` enum key | Component variable |
|---|---|---|
| `home.svg` | `HOME` | `Home` |
| `settings.svg` | `SETTINGS` | `Settings` |
| `user.svg` | `USER` | `User` |

> **Note:** The generator only capitalises the first letter and preserves all other characters. Hyphens and underscores are kept as-is, so `arrow-right.svg` would produce the invalid JS identifier `Arrow-right`. Use single-word, lowercase SVG filenames.

---

## i18n workflow

1. Use keys in code:

```tsx
const t = useT();
return <Text>{t('auth.login.title')}</Text>;
```

2. Run extraction to update JSON files:

```bash
npm run i18n:all
```

3. The parser extracts new keys into locale JSON files and the generator produces TypeScript types for type-safe key usage.

4. Add translations for all supported locales (`en`, `de`, `ru`).

---

## Key commands

### Development

| Command | Description |
|---|---|
| `npm start` | Start Metro bundler (with cache reset) |
| `npm run ios` | Run on iOS simulator |
| `npm run android` | Run on Android emulator/device |
| `npm run lint` | **Biome:** `biome check .` (format + lint + import check; no writes) |
| `npm run format` | **Biome:** `biome check . --write` (apply format, organize imports, safe fixes) |
| `npm test` | Run Jest test suite |
| `npx tsc --noEmit` | Type-check without emitting |

### Assets & Guards

| Command | Description |
|---|---|
| `npm run gen:icons` | Regenerate `assets/icons.ts` from SVGs |
| `npm run gen:app-icon` | Generate **launcher** icons: iOS `AppIcon.appiconset` + Android `mipmap-*` via [`scripts/generate-app-icon.cjs`](../scripts/generate-app-icon.cjs). This command is independent from splash generation. Source priority (first match): best `assets/bootsplash/logo@*.png` (`@4x` → `@3x` → `@2x` → `@1,5x` → `logo.png`), then `assets/app-icon.png`, then `assets/bootsplash-logo.svg` (rasterized with sharp). Flatten background `#111827`. |
| `npm run check:icons` | Verify `icons.ts` is in sync (use in CI) |
| `npm run check:imports` | Enforce path alias usage (no deep relative imports) |
| `npm run bootsplash:generate` | Regenerate **native** splash (iOS/Android) and `assets/bootsplash/*` via [`scripts/bootsplash-generate.cjs`](../scripts/bootsplash-generate.cjs). Source of truth: `assets/logo.png` only (command fails if missing). Background `#111827`, logo width 160. Then **clean Xcode build** and reinstall — iOS caches the launch screen. |

### i18n

| Command | Description |
|---|---|
| `npm run i18n:extract` | Extract i18next keys from source into JSON |
| `npm run i18n:types` | Generate TypeScript types for i18n keys |
| `npm run i18n:all` | Extract + generate types in one step |

### Android Build

| Command | Description |
|---|---|
| `npm run android:devices` | List connected emulators/devices (`adb devices`) |
| `npm run env:ensure` | Create `.env` from `.env.example` if missing (also runs before `ios` / `android` / Gradle APK builds) |
| `npm run android:build:debug` | Build debug APK |
| `npm run android:build:release` | Build release APK |
| `npm run android:clean` | Remove `android/app/.cxx`, `android/app/build`, and `android/build` only (does **not** run `./gradlew clean`, which can fail on New Architecture when `codegen/jni` dirs are missing) |
| `npm run gradle:clean` | Same artifact wipe as `android:clean` (no Gradle `clean` task) |
| `npm run android:clean:gradle` | Run `./gradlew clean` while excluding `:app:externalNativeBuildClean*` (Debug / DebugOptimized / Release) so CMake is not asked to clean missing `codegen/jni` paths |
| `npm run android:rebuild` | Wipe `.cxx` / build dirs + `:app:assembleDebug` + `run-android` (no `./gradlew clean`) |

#### CMake / missing `codegen/jni` after clean

With React Native **New Architecture**, `Android-autolinking.cmake` may `add_subdirectory` paths under `node_modules/.../android/build/generated/source/codegen/jni/`. Those folders appear after libraries run codegen. **`./gradlew clean`** and **Android Studio → Build → Clean Project** still run **`externalNativeBuildClean*`** for `:app`, so CMake can error (“not an existing directory”).

**Recovery:** `npm run android:clean`, then `cd android && ./gradlew :app:assembleDebug` or `npm run android`. If needed: `rm -rf node_modules/*/android/build`, `npm install`, then rebuild. Prefer **`android:clean`** / **`gradle:clean`** over bare **`./gradlew clean`** until you have a good build; use **`android:clean:gradle`** when you need Gradle’s clean without the native clean tasks.

#### `INSTALL_FAILED_INSUFFICIENT_STORAGE` on emulator

Gradle built the APK; **`installDebug`** failed because the **AVD internal storage** is full (or install location is invalid).

**Try:** In **Device Manager** → emulator ⋮ → **Wipe Data**, then cold boot. Or uninstall this app / other test apps: `adb uninstall com.reactnativestarter` (see `npm run android:uninstall`). Create a new AVD with a larger **Internal Storage** (e.g. 4–8 GB+). On the device, free space in **Settings → Storage**.

#### `react-native-mmkv` and `react-native-nitro-modules`

**react-native-mmkv** (Nitro) ships generated Kotlin that must match the **Nitro runtime** API. If **`react-native-nitro-modules`** is too old, Android fails with unresolved **`CxxPart`** / **`overrides nothing`** in `HybridMMKVPlatformContextSpec`.

This repo **pins** both in [`package.json`](../package.json) (e.g. mmkv **4.3.0** + nitro-modules **0.35.0**) and uses **`overrides`** so the Nitro runtime stays aligned even if another package requests a different range. **Avoid** `"react-native-mmkv": "^4.1.0"` together with `"react-native-nitro-modules": "^0.31.10"`: semver can install **mmkv 4.3.x** while **nitro** stays on **0.31**, which reproduces the **`CxxPart`** / **`overrides nothing`** Kotlin errors.

When you upgrade mmkv, check its release notes or `devDependencies` for the expected nitro version and bump together.

**After changing either:** `npm install`, then **`npm run pod-install`**. If CocoaPods errors on **`MMKVCore`** vs `Podfile.lock`, run from `ios/`: `pod update MMKVCore NitroModules NitroMmkv`, commit the updated [`Podfile.lock`](../ios/Podfile.lock). On Android, `npm run android:clean` then `./gradlew :app:assembleDebug` is enough in most cases.

**iOS New Architecture codegen:** Fabric headers such as `react/renderer/components/RNCWebViewSpec/Props.h` live under **`ios/build/generated/ios/`**, which is **gitignored** and created by **`pod install`**. If `xcodebuild` fails with **`file not found`** for a `*Spec` path, run **`npm run pod-install`** (then clean build in Xcode if needed).

### Release

| Command | Description |
|---|---|
| `npm run release:patch` | Bump patch version + changelog |
| `npm run release:minor` | Bump minor version + changelog |
| `npm run release:major` | Bump major version + changelog |
