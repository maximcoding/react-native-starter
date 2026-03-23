# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Changed
- **CI (`ci.yml`):** split quality gate into two parallel jobs (`lint`: Biome + TypeScript; `test`: Jest with coverage summary + `check:icons` + `check:imports`); add `concurrency` group to cancel stale PR runs; add `dependency-review` job on pull requests.
- **Android CI (`android-ci.yml`):** add `v*` tag trigger alongside `workflow_dispatch`; add Gradle cache (`~/.gradle`); seed `.env` from `.env.example` before build; add commented stubs for AAB (`bundleRelease`) and Sentry source map upload.
- **iOS CI (`ios-ci.yml`):** add `v*` tag trigger alongside `workflow_dispatch`; add CocoaPods specs cache (`~/.cocoapods`); seed `.env` from `.env.example` before build; add commented stub for Sentry source map upload.
- **`docs/OPERATIONS.md`:** update GitHub Actions table and notes to reflect parallel jobs, caching, tag triggers, and Sentry upload stubs.

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
