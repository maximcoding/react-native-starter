# Operations

Tooling, CI, monitoring, OTA policy, and release checklist for this starter.

## Sentry

The app includes `@sentry/react-native` and initializes it when `SENTRY_DSN` is set in `.env` (via `react-native-config`).

### Quick setup

1. Create a project at [sentry.io](https://sentry.io) and copy the **DSN**.
2. Put it in `.env`:

   ```bash
   SENTRY_DSN=https://...@....ingest.sentry.io/...
   ```

3. Optional env (see [`.env.example`](../.env.example)):

   - `SENTRY_ENABLE_IN_DEV=1` — send events from debug builds (default is off).
   - `SENTRY_TRACES_SAMPLE_RATE` — `0`–`1` for performance sampling (`0` = off).

4. Rebuild native apps after changing env (`npm run ios` / `npm run android`).

5. **Source maps / native symbols:** for readable stack traces in production, follow [Sentry’s React Native guide](https://docs.sentry.io/platforms/react-native/) (Sentry Wizard, Gradle/Xcode integration). Run when you need release builds with deobfuscation:

   ```bash
   npx @sentry/wizard@latest -s -i reactNative
   ```

`App.tsx` wires `captureBoundaryError` into `ErrorBoundary`'s `onError` prop — component stack only, no user PII. Like `initSentry`, `captureBoundaryError` is a no-op in `__DEV__` unless `SENTRY_ENABLE_IN_DEV=1`.

### Firebase Crashlytics

If you prefer Crashlytics, add the Firebase SDK per [React Native Firebase](https://rnfirebase.io/) and call `crashlytics().recordError()` from the same `ErrorBoundary` `onError` hook (replace or complement Sentry).

## Maestro

[Maestro](https://maestro.mobile.dev/) drives the installed app without embedding a test framework into the native binary (unlike Detox). Install the CLI via their docs (Homebrew, curl, etc.).

### App IDs

| Platform | Identifier |
|----------|------------|
| Android | `com.reactnativestarter` — [`android/app/build.gradle`](../android/app/build.gradle) |
| iOS | `org.reactjs.native.example.ReactNativeStarter` — [`ios/.../project.pbxproj`](../ios/ReactNativeStarter.xcodeproj/project.pbxproj) (`PRODUCT_BUNDLE_IDENTIFIER`) |

If you change bundle ID / `applicationId`, update the matching `maestro/smoke-*.yaml` file.

### Run

Build and install the app first (`npm run android` / `npm run ios`), then from the repo root:

```bash
maestro test maestro/smoke-android.yaml
# or
maestro test maestro/smoke-ios.yaml
```

Flows wait up to 60s for the **Home** tab label (English `home.title`). Adjust assertions as you add `testID`s or change copy.

### Extend

Add YAML flows under `maestro/` and keep them deterministic (seed data, locale, or `testID` over fragile text where possible).

## GitHub Actions

| File | Trigger | Purpose |
|------|---------|---------|
| [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) | Push / PR to `master` or `main` | **Quality gate** (two parallel jobs): `lint` — Biome + TypeScript; `test` — Jest (with coverage summary) + `check:icons` + `check:imports`. Plus a `dependency-review` job on PRs. Stale runs cancelled via `concurrency`. |
| [`.github/workflows/android-ci.yml`](../.github/workflows/android-ci.yml) | Manual (`workflow_dispatch`) or tag `v*` push | **Android:** JDK 17, Android SDK, Gradle cache, `.env` seeded from `.env.example`, `assembleRelease` (debug keystore — replace with real signing before store upload). Commented stubs for AAB (`bundleRelease`) and Sentry source map upload. |
| [`.github/workflows/ios-ci.yml`](../.github/workflows/ios-ci.yml) | Manual (`workflow_dispatch`) or tag `v*` push | **iOS:** CocoaPods (with specs cache), `.env` seeded from `.env.example`, **simulator** `xcodebuild` for `ReactNativeStarter` scheme (no device signing). Commented stub for Sentry source map upload. |

### Notes

- **Release / Play / TestFlight** automation is not included; add Fastlane or your own jobs when you have signing secrets. Commented stubs in each native workflow show where to add signing and upload steps.
- Native workflows trigger automatically on `v*` tags (e.g. `v1.2.0`) in addition to `workflow_dispatch`.
- Align **Node** with `package.json` `engines` (>= 20) across all workflows.
- After renaming the app in Xcode / Gradle, update **workspace**, **scheme**, and **artifact paths** in the iOS workflow.
- **Sentry source maps:** uncomment the upload step in both native workflows and set `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT` as repository secrets.

### Optional consolidation

You can delete `android-ci.yml` / `ios-ci.yml` if you only want PR checks (`ci.yml`), or merge native builds into a single file with a matrix — keep one source of truth for Node version and install steps.

### Feature branches and store automation

- Run the same checks locally as **`ci.yml`** before push; CI runs them on push/PR to `main` / `master`.
- **Store release automation** (Google Play / TestFlight upload) is not included. Native workflows produce artifacts on tag push; add Fastlane `supply` / `pilot` lanes and the corresponding repository secrets (`GOOGLE_SERVICE_ACCOUNT_JSON`, `APP_STORE_CONNECT_API_KEY_JSON`) when you need automated uploads.

## Android: native clean and CMake (`codegen/jni`)

If **`./gradlew clean`** or **Android Studio → Clean Project** fails with CMake errors about missing directories under `node_modules/.../codegen/jni`, see [development.md#cmake--missing-codegenjni-after-clean](development.md#cmake--missing-codegenjni-after-clean). Use **`npm run android:clean`** and rebuild (`:app:assembleDebug` or **`npm run android`**); avoid plain **`./gradlew clean`** / IDE clean until codegen outputs exist again.

## Local release builds

```bash
# Android release APK
npm run android:build:release

# iOS — via Xcode or Fastlane when you add it
```

Release notes and version history: [CHANGELOG.md](../CHANGELOG.md).

## Optional: GitHub Actions secrets (store upload)

If you add Fastlane **supply** / **pilot** (or equivalent) jobs, you will typically need repository secrets such as:

| Secret | Typical purpose |
|--------|-----------------|
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Google Play upload via `supply` |
| `APP_STORE_CONNECT_API_KEY_JSON` | TestFlight upload via `pilot` |

## Over-the-air updates

Microsoft **CodePush** (App Center) is in maintenance; new apps usually pick another path. This repo keeps optional `.env` keys `CODEPUSH_KEY_IOS` / `CODEPUSH_KEY_ANDROID` for teams that still wire CodePush themselves.

### Options (pick one)

| Approach | Notes |
|----------|--------|
| **Expo EAS Update** | Strong fit if you adopt Expo tooling or use a compatible workflow. |
| **Shorebird** | Flutter-style patches for RN; evaluate licensing and supported RN versions. |
| **Store-only** | No OTA JS; ship via App Store / Play only (simplest compliance story). |
| **Legacy CodePush** | Only if you already have App Center keys; follow Microsoft’s current guidance. |

### Starter stance

- No OTA library is installed by default (keeps native surface small).
- When you choose a vendor, add their SDK and env/secrets per their docs; you can map keys into `react-native-config` the same way as `API_URL` / `SENTRY_DSN`.

### Related

- Env placeholders: [`.env.example`](../.env.example)
- Release tagging: [CONTRIBUTING.md](../CONTRIBUTING.md), [Publishing & discoverability](#publishing--discoverability)

## Publishing & discoverability

Copy-paste helpers for [docs/TODO.md](TODO.md) items that happen **outside** the repo (GitHub UI, community posts). **TODO.md** splits **already-shipped template work** from **unchecked maintainer tasks** so the checklist stays honest.

**Repo:** `https://github.com/maximcoding/react-native-starter`

### GitHub repository settings

**Suggested description:**

```text
Production-ready React Native (bare) starter: TypeScript, feature-first, theme, i18n, offline, React Query.
```

**Suggested topics** (comma-separated in GitHub UI):

```text
react-native, typescript, starter, boilerplate, bare-workflow, react-query, mmkv, i18n, offline-first, template
```

**Website (optional):** set if you enable GitHub Pages or a landing URL (see below).

### Screenshots

Add store or marketing captures where you publish the app (App Store, Play Console, README, landing page). Use stable paths if you embed them in markdown. This repo does not ship in-tree placeholder screenshots.

### GitHub Releases

When you tag with `npm run release:patch` (etc.), open **GitHub → Releases → Draft a new release**, select the tag, and paste the matching section from [CHANGELOG.md](../CHANGELOG.md).

### awesome-react-native PR

Target: [jondot/awesome-react-native](https://github.com/jondot/awesome-react-native) → section **Starter Kits / Templates** (or equivalent).

**One-line entry example:**

```markdown
- [react-native-starter](https://github.com/maximcoding/react-native-starter) — Bare RN 0.82, TypeScript, feature slices, theme tokens, i18n, React Query + offline helpers.
```

### Launch post (short template)

- **Where:** r/reactnative, React Native Discord, or X/Twitter.
- **Bullets:** bare workflow + TypeScript; feature-first `src/features`; shared layer in `src/shared`; CI (Biome, tests, guards); Maestro smoke flows ([Maestro](#maestro)).

### Optional: GitHub Pages

1. Repo **Settings → Pages**: Source **Deploy from a branch**, folder `/docs` or `/ (root)` with a static `index.html`, **or** use a GitHub Actions workflow that publishes `docs/` to `gh-pages`.
2. Point **Website** on the repo to the published URL.

No Pages workflow is committed by default; add one when you have real marketing copy.
