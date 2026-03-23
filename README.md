# React Native Mobile Starter

[![Use this template](https://img.shields.io/badge/Use%20this%20template-2ea44f?logo=github&logoColor=white)](https://github.com/maximcoding/react-native-starter/generate)
![CI](https://github.com/maximcoding/react-native-starter/actions/workflows/ci.yml/badge.svg)
![React Native](https://img.shields.io/badge/React%20Native-0.82.1-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-%3E%3D20-brightgreen?logo=node.js)
![Version](https://img.shields.io/badge/version-1.0.0-blue)

Bare-workflow React Native starter with **TypeScript** (strict), **feature-first** layout under `src/features`, shared code in `src/shared`, **theme tokens**, **i18n**, and [offline behavior](docs/OFFLINE.md) (NetInfo, transport queue/replay, React Query + MMKV). Optional **Sentry**, shared **ErrorBoundary** / **Suspense** / **Activity**, Maestro smoke flows, and [operations docs](docs/OPERATIONS.md) for CI, OTA policy, and publishing.

**Highlights:** typed navigation; pluggable transport (REST / GraphQL / WebSocket / Firebase); TanStack Query with persistence; **Biome** + Jest + GitHub Actions quality gate.

### Quick start

First-time setup (once per clone):

```bash
git clone https://github.com/maximcoding/react-native-starter.git
cd react-native-starter
npm install
npx pod-install ios
cp .env.example .env
```

Edit `.env` as needed (`API_URL`, `USE_MOCK_API`, optional Sentry / OTA keys) — see [Environment variables](#environment-variables).

**Next:** [Running the app](#running-the-app).

Prerequisites: [Getting Started](#getting-started).

---

## Table of Contents

- [Features](#features)
- [Project structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment variables](#environment-variables)
- [Key commands](#key-commands)
- [Documentation](#documentation)
- [Permissions](#permissions)
- [Contributing](#contributing)
- [CI/CD & Release](#cicd--release)

---

## Features

Pinned versions live in [`package.json`](package.json); this table is an **at-a-glance** stack summary.

| Category | Library | Description |
|---|---|---|
| **Framework** | react-native | Bare workflow, TypeScript, Hermes engine |
| **Theme** | — | Light & Dark via `ThemeProvider`; semantic tokens; `useTheme()` |
| **Navigation** | @react-navigation | Native stacks, Bottom Tabs, Modals |
| **i18n** | i18next + react-i18next | Flat JSON per locale, feature-keyed sections, type-safe `useT()` |
| **Validation** | zod | Schema validation on API responses; typed domain mappers |
| **HTTP** | apisauce | Centralized instance with auth, error, and logging interceptors |
| **Transport** | — | Pluggable adapters: REST (Axios), GraphQL, WebSocket, Firebase |
| **Server State** | @tanstack/react-query | Query/mutation management with persistence and tag-based invalidation |
| **Offline** | — | NetInfo → transport offline mode; mutation queue + replay; Query cache + MMKV — [OFFLINE.md](docs/OFFLINE.md) |
| **Storage** | react-native-mmkv + react-native-nitro-modules | Fast key-value; **keep versions paired** — [development.md § MMKV / Nitro](docs/development.md#react-native-mmkv-and-react-native-nitro-modules) |
| **Lists** | @shopify/flash-list | High-performance virtualized lists |
| **SVG** | react-native-svg | Icons via `npm run gen:icons` |
| **Splash Screen** | react-native-bootsplash | `npm run bootsplash:generate` — [development.md](docs/development.md#key-commands) |
| **Native Utils** | — | Device info, haptics, runtime permissions |
| **Biome** | @biomejs/biome | Format, lint, import organization (`biome check`) |
| **Monitoring** | @sentry/react-native | Optional when `SENTRY_DSN` is set — [OPERATIONS.md#sentry](docs/OPERATIONS.md#sentry) |
| **CI/CD** | GitHub Actions | Quality + manual native builds — [OPERATIONS.md#github-actions](docs/OPERATIONS.md#github-actions) |

---

## Project structure

Repository tree (folders and comments): **[docs/development.md#repository-layout](docs/development.md#repository-layout)**. Import rules and “where code lives”: **[AGENTS.md](AGENTS.md)**.

---

## Getting Started

### Prerequisites

Same toolchain as a typical bare React Native app: Node.js ≥ 20, Xcode (iOS), Android Studio + SDK (Android), CocoaPods for iOS.

### Installation

Run the steps in [Quick start](#quick-start) above (clone through `cp .env.example .env`).

If `npm install` fails on peer dependency conflicts, use `npm install --legacy-peer-deps`.

### Running the App

Use this **every time** you develop: keep Metro running in one terminal, then build and launch the app from another.

```bash
npm start
npm run ios
npm run android
```

`npm run ios` and `npm run android` run **`env:ensure`** first (creates `.env` from [`.env.example`](.env.example) if missing).

<details>
<summary>Android build troubleshooting</summary>

- **”No connected devices”** — start an emulator or connect a device with USB debugging, then run `npm run android:devices`.
- **CMake errors about missing `codegen/jni`** (common with New Architecture) — do not repeat `./gradlew clean` until a successful native build regenerates those folders. Run `npm run android:clean` (removes `android/app/.cxx` and build outputs only), then `npm run android`.
- **Still failing** — try `rm -rf node_modules/*/android/build`, reinstall deps, and rebuild.
- **Gradle clean that skips broken native tasks** — use `npm run android:clean:gradle`.

Full detail: [docs/development.md#android-build](docs/development.md#android-build).
</details>

### Environment variables

Values are read at build time via **`react-native-config`** (see [`.env.example`](.env.example)). Rebuild the app after changing `.env`.

| Variable | Required | Purpose |
|----------|----------|---------|
| `API_URL` | For real API | Backend base URL |
| `USE_MOCK_API` | No | `true` / `1` uses the mock transport in **dev**; login screen pre-fills **`demo@example.com` / `password`** (any valid email + non-empty password also works) |
| `WS_URL` | No | WebSocket base URL for the WebSocket transport adapter |
| `ENV` | No | Runtime environment label (`development` / `staging` / `production`); defaults to `development` in `__DEV__`, `production` otherwise |
| `SENTRY_DSN` | No | Enables Sentry when non-empty; debug builds stay quiet unless `SENTRY_ENABLE_IN_DEV=1` |
| `SENTRY_ENABLE_IN_DEV` | No | `1` = send Sentry events from `__DEV__` |
| `SENTRY_TRACES_SAMPLE_RATE` | No | `0`–`1` performance sampling (`0` = off) |
| `CODEPUSH_KEY_IOS` / `CODEPUSH_KEY_ANDROID` | No | Reserved for OTA; no CodePush SDK ships by default — see [docs/OPERATIONS.md#over-the-air-updates](docs/OPERATIONS.md#over-the-air-updates) |

**Docs:** [Sentry setup](docs/OPERATIONS.md#sentry) · [OTA / updates policy](docs/OPERATIONS.md#over-the-air-updates) · [Going public / GitHub / releases](docs/OPERATIONS.md#publishing--discoverability)

---

## Key commands

| Command | Description |
|---------|-------------|
| `npm start` | Metro bundler (cache reset) |
| `npm run ios` / `npm run android` | Run on simulator or device (ensures `.env` exists) |
| `npm run env:ensure` | Create `.env` from `.env.example` if missing |
| `npm run android:clean` | Remove Android native/build dirs (`.cxx`, `android/app/build`, `android/build`) — no `./gradlew clean` |
| `npm run android:devices` | `adb devices` |
| `npm run lint` | Biome check (no writes) |
| `npm run format` | Biome apply format + safe fixes (writes files) |
| `npm test` | Jest |
| `npx tsc --noEmit` | Typecheck |
| `npm run i18n:all` | i18n extract + types |
| `npm run gen:icons` / `npm run check:icons` | Icon registry |
| `npm run check:imports` | Path-alias guard |

**All npm scripts** (Android builds, release bumps, splash, etc.): [docs/development.md#key-commands](docs/development.md#key-commands).

---

## Documentation

This file is the only **README** in the repo. **Which doc for what:** see the matrix in **[AGENTS.md#documentation-map](AGENTS.md#documentation-map)**.

Coding rules and structure: **[AGENTS.md](AGENTS.md)**. Deep developer reference (hooks, architecture, icons, i18n): **[docs/development.md](docs/development.md)**. Roadmap and backlog: **[docs/TODO.md](docs/TODO.md)**.

---

## Permissions

Declare only what you use. Full catalog: **[docs/permissions-bare-rn.md](docs/permissions-bare-rn.md)**.

---

## Contributing

Contributions welcome — see [CONTRIBUTING.md](CONTRIBUTING.md) for fork/branch/PR guidelines, quality checks, and PR checklists.

---

## CI/CD & Release

**Canonical detail:** [docs/OPERATIONS.md](docs/OPERATIONS.md) (GitHub Actions, local release builds, optional store secrets, Sentry, Maestro, OTA, publishing). **Version history:** [CHANGELOG.md](CHANGELOG.md).

---
