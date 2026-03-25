# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### 1.0.2 (2026-03-25)


### Features

* add UI components, CI workflows, offline docs, and feature types ([2883b1b](https://github.com/maximcoding/react-native-starter/commit/2883b1b7122c6f974d999fabe68ac4a3783f897b))
* fix settings modals, quick actions grid, and tab bar warning ([b520ecc](https://github.com/maximcoding/react-native-starter/commit/b520eccda9677178f60d6f5167f3e585d40fcaf6))
* HN news reader with offline-first feed and premium UI ([9113efe](https://github.com/maximcoding/react-native-starter/commit/9113efe206897082e25e5142bda73b0b0e398f60))
* production-ready UI, i18n, a11y, and test coverage ([9393382](https://github.com/maximcoding/react-native-starter/commit/9393382a0e87bb3506650f62319d990753cf04e1))


### Bug Fixes

* **dev:** add standard-version devDependency for release scripts ([5360c64](https://github.com/maximcoding/react-native-starter/commit/5360c64b996a06c0ad8dab478918a66b08e977e6))
* **lint:** apply biome format fixes across changed files ([666333c](https://github.com/maximcoding/react-native-starter/commit/666333cc7e28855da50bc1e9c9cdd7462eedd38c))
* **navigation:** React Navigation 7 static configuration (v1.0.1) ([88573f4](https://github.com/maximcoding/react-native-starter/commit/88573f4826ce9a225bbc36f195342ba93fbb464c))

## [1.0.1] - 2026-03-25

### Changed

- Navigation: migrate root stack and home tabs to React Navigation 7 **static configuration** (`createStaticNavigation`, `screens` maps). [`NavigationRoot`](src/navigation/NavigationRoot.tsx) renders the static root component with the same theme, persistence, and `onReady` (BootSplash) behavior. Param lists in [`root-param-list.ts`](src/navigation/root-param-list.ts) stay explicit and mirror the static `screens` map to avoid a circular import with stack screens.

## [1.0.0] - 2026-03-23

- Align **react-native-nitro-modules** with **react-native-mmkv** (pin mmkv 4.3.0 + nitro 0.35.0) to fix Android Kotlin compile (`CxxPart` / Nitrogen skew); **`package.json` `overrides`** pins nitro 0.35.0; refresh [`ios/Podfile.lock`](ios/Podfile.lock) (MMKVCore 2.4.0). Doc: [docs/development.md#react-native-mmkv-and-react-native-nitro-modules](docs/development.md#react-native-mmkv-and-react-native-nitro-modules).
- [docs/TODO.md](docs/TODO.md): rewrite — shipped vs maintainer vs ongoing sections; links to [OPERATIONS.md § Publishing & discoverability](docs/OPERATIONS.md#publishing--discoverability).
- Documentation: single root [README.md](README.md); canonical doc matrix in [AGENTS.md](AGENTS.md) (`#documentation-map`); removed `docs/README.md` and in-repo screenshot placeholders; [.claude/rules/](.claude/rules/) link to AGENTS/CLAUDE for alignment.
- Remove `SECURITY.md`; report security issues per [CONTRIBUTING.md](CONTRIBUTING.md) (private channel / GitHub advisories).
- Sentry: `@sentry/react-native`, `initSentry` + `captureBoundaryError` (`src/shared/services/monitoring/sentry.ts`), env keys in `.env.example`; doc `docs/OPERATIONS.md#sentry`.
- OTA policy, publishing checklist: `docs/OPERATIONS.md` (`#over-the-air-updates`, `#publishing--discoverability`, `#screenshots`).
- GitHub Actions: Android/iOS manual workflows use Node 20 and `npm ci`; iOS workflow fixed (`ReactNativeStarter.xcworkspace` / scheme, simulator `xcodebuild`). Doc: `docs/OPERATIONS.md#github-actions`.
- Add `.github/CODE_OF_CONDUCT.md`.
- Add `Activity` (`src/shared/components/ui/Activity.tsx`) and `SuspenseBoundary` (`SuspenseBoundary.tsx`) for visibility-without-unmount and themed async fallbacks.
- Maestro smoke flows: `maestro/smoke-android.yaml`, `maestro/smoke-ios.yaml`; see `docs/OPERATIONS.md#maestro`.
- `LanguageScreen`: use `useT()` for language button labels; locale keys `settings.language.{english,russian,german}`.
- Add theme-aware `ErrorBoundary` in `src/shared/components/ui/ErrorBoundary.tsx`, wired in `App.tsx` (inside `ThemeProvider`); optional `onError` for crash reporting.
- Add GitHub Actions workflow `.github/workflows/ci.yml` (Node 20): Biome, `tsc`, Jest, `check:icons`, `check:imports`.
- `Button` supports optional `testID` (forwarded to `Pressable`).
- i18n: `common.*` error strings; `generate-i18n-types.cjs` + parser output aligned to flat `locales/*.json`; `import 'i18next'` for correct module augmentation.
