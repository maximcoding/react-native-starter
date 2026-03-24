```md
# React Native Bare Starter

## 🚀 Quick start

```bash
git clone https://github.com/maximcoding/react-native-starter.git
cd react-native-starter
npm install
npx pod-install ios
cp .env.example .env
npm start
npm run ios
npm run android

```

Edit `.env` as needed for your setup.  
Main values: `API_URL`, `USE_MOCK_API`, optional Sentry keys, optional OTA keys.

> `npm run ios` and `npm run android` run `env:ensure` first, so `.env` is created from `.env.example` if missing.
--------
## ✨ Features Included
- **🧱 Bare React Native** — full native control, no Expo lock-in
- **🧭 Navigation & State** — React Navigation (stacks, tabs, modals), Zustand for global state, TanStack Query for server state with caching, retries, and persistence.
- **📦 TanStack Query** — caching, persistence, retries, and invalidation
- **🪶 Zustand** — lightweight global state without Redux overhead
- **⚡ MMKV Storage** — `react-native-mmkv` via Nitro Modules — up to 30× faster than AsyncStorage.
- **📡 Offline-Ready** — Query persistence, queue/replay, cache restore, and transport-level offline mode for a solid experience on flaky networks.
- **🔌 Pluggable Transport** — Adapters for REST, GraphQL, WebSocket, and Firebase. Swap your backend strategy without rewiring the app.
- **🎨 Theming & i18n** — Light/dark mode with semantic tokens. `i18next` with typed `useT()` hook, ready from day one.
- **🌍 Localization** — typed i18n support from day one
- **🖼️ SVG via script** — easier icon generation and maintenance
- **🚀 BootSplash included** — native splash screen setup already in place
- **🧪 Developer Experience** — Biome linting, Jest tests, GitHub Actions CI, Maestro E2E, SVG icon generation, and native splash screen via BootSplash.

---

## 🧭 Project structure

The starter uses a **feature-first** layout under `src/features` with shared code in `src/shared`.

Use these docs for structure details:

-   **Repository layout** → [docs/development.md#repository-layout](https://chatgpt.com/c/docs/development.md#repository-layout)
    
-   **Code rules and ownership** → [AGENTS.md](https://chatgpt.com/c/AGENTS.md)
    

----------

## 🛠️ Getting started

### Prerequisites

Standard bare React Native toolchain:

-   Node.js ≥ 20
    
-   Xcode for iOS
    
-   Android Studio + SDK for Android
    
-   CocoaPods for iOS
    

### Install notes

If `npm install` fails because of peer dependency conflicts:

```bash
npm install --legacy-peer-deps

```

### Running the app

Keep Metro running in one terminal, then run the native app from another:

```bash
npm start
npm run ios
npm run android

```

### Android troubleshooting

-   **No connected devices** — start an emulator or connect a device, then run `npm run android:devices`
    
-   **Missing `codegen/jni` / CMake errors** — run `npm run android:clean`, then `npm run android`
    
-   **Still failing** — try `rm -rf node_modules/*/android/build`, reinstall dependencies, and rebuild
    
-   **Need Gradle clean without broken native tasks** — use `npm run android:clean:gradle`
    

Full detail: [docs/development.md#android-build](https://chatgpt.com/c/docs/development.md#android-build)

----------

## 🔐 Environment variables
Values are read at build time via react-native-config.
See .env.example. Rebuild the app after changing .env.

| Variable                                    | Required     | Purpose                                               |
| ------------------------------------------- | ------------ | ----------------------------------------------------- |
| `API_URL`                                   | For real API | Backend base URL                                      |
| `USE_MOCK_API`                              | No           | `true` / `1` uses the mock transport in dev           |
| `WS_URL`                                    | No           | WebSocket base URL                                    |
| `ENV`                                       | No           | Runtime label: `development`, `staging`, `production` |
| `SENTRY_DSN`                                | No           | Enables Sentry when non-empty                         |
| `SENTRY_ENABLE_IN_DEV`                      | No           | `1` sends Sentry events from `__DEV__`                |
| `SENTRY_TRACES_SAMPLE_RATE`                 | No           | Performance sampling value from `0` to `1`            |
| `CODEPUSH_KEY_IOS` / `CODEPUSH_KEY_ANDROID` | No           | Reserved for OTA; no CodePush SDK ships by default    |

Useful docs:

Sentry setup
OTA / updates policy
Publishing / discoverability

----------

# React Native Bare Starter

[![Use this template](https://img.shields.io/badge/Use%20this%20template-2ea44f?logo=github&logoColor=white)](https://github.com/maximcoding/react-native-starter/generate)
![CI](https://github.com/maximcoding/react-native-starter/actions/workflows/ci.yml/badge.svg)
![React Native](https://img.shields.io/badge/React%20Native-0.82.1-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

A bare-workflow React Native starter for apps that need more than a demo.

Clean foundation from day one: strict TypeScript, feature-first structure, theme tokens, i18n, offline-ready behavior, and solid quality gates — with room to grow without rebuilding the same setup again.

---

## Quick Start

```bash
git clone https://github.com/maximcoding/react-native-starter.git
cd react-native-starter
npm install
npx pod-install ios
cp .env.example .env
```

Edit `.env` as needed, then:

```bash
npm start       # Metro bundler
npm run ios     # or: npm run android
```

> Requires Node ≥ 20, Xcode (iOS), Android Studio + SDK (Android), CocoaPods (iOS).
> If `npm install` fails on peer deps, try `npm install --legacy-peer-deps`.

---

## What's Included

**Navigation & State** — React Navigation (stacks, tabs, modals), Zustand for global state, TanStack Query for server state with caching, retries, and persistence.

**Offline-Ready** — Query persistence, queue/replay, cache restore, and transport-level offline mode for a solid experience on flaky networks.

**Pluggable Transport** — Adapters for REST, GraphQL, WebSocket, and Firebase. Swap your backend strategy without rewiring the app.

**Theming & i18n** — Light/dark mode with semantic tokens. `i18next` with typed `useT()` hook, ready from day one.

**Fast Storage** — `react-native-mmkv` via Nitro Modules — up to 30× faster than AsyncStorage.

**Developer Experience** — Biome linting, Jest tests, GitHub Actions CI, Maestro E2E, SVG icon generation, and native splash screen via BootSplash.

---

## Environment Variables

Values are read at build time via `react-native-config`. See `.env.example` for the full list.

| Variable | Purpose |
|---|---|
| `API_URL` | Backend base URL |
| `USE_MOCK_API` | `true` uses the mock transport; login pre-fills demo credentials |
| `WS_URL` | WebSocket base URL |
| `ENV` | `development` / `staging` / `production` |
| `SENTRY_DSN` | Enables Sentry error tracking |
| `CODEPUSH_KEY_IOS` / `CODEPUSH_KEY_ANDROID` | Reserved for OTA updates |

After changing `.env`, rebuild the app.

---

## Key Commands

| Command | What it does |
|---|---|
| `npm start` | Start Metro (cache reset) |
| `npm run ios` / `npm run android` | Run on simulator or device |
| `npm run lint` | Biome check (read-only) |
| `npm run format` | Biome format + safe fixes |
| `npm test` | Jest |
| `npx tsc --noEmit` | Typecheck |
| `npm run i18n:all` | Extract i18n keys + generate types |
| `npm run gen:icons` | Regenerate SVG icon registry |
| `npm run android:clean` | Clean Android build artifacts |

---

## Documentation

| Topic | Location |
|---|---|
| Rules, structure & contribution flow | [AGENTS.md](AGENTS.md) |
| Deep developer reference | [docs/development.md](docs/development.md) |
| Offline behavior | [docs/OFFLINE.md](docs/OFFLINE.md) |
| Operations, CI, releases, Sentry | [docs/OPERATIONS.md](docs/OPERATIONS.md) |
| Permissions catalog | [docs/permissions-bare-rn.md](docs/permissions-bare-rn.md) |
| Roadmap | [docs/TODO.md](docs/TODO.md) |
| Changelog | [CHANGELOG.md](CHANGELOG.md) |

---


----------

## 📚 Documentation

This README stays intentionally short.  
Use the rest of the docs when you need deeper detail.

-   **Rules, structure, contribution flow** → [AGENTS.md](https://chatgpt.com/c/AGENTS.md)
    
-   **Developer reference** → [docs/development.md](https://chatgpt.com/c/docs/development.md)
    
-   **Offline behavior** → [docs/OFFLINE.md](https://chatgpt.com/c/docs/OFFLINE.md)
    
-   **Operations, CI, releases, OTA, Sentry** → [docs/OPERATIONS.md](https://chatgpt.com/c/docs/OPERATIONS.md)
    
-   **Roadmap / backlog** → [docs/TODO.md](https://chatgpt.com/c/docs/TODO.md)
    

----------

## 🔐 Permissions

Declare only what you actually use.

Full catalog:  
[docs/permissions-bare-rn.md](https://chatgpt.com/c/docs/permissions-bare-rn.md)

----------

## 🤝 Contributing

Contributions are welcome.

See [CONTRIBUTING.md](https://chatgpt.com/c/CONTRIBUTING.md) for:

-   branch and PR rules
    
-   quality checks
    
-   contribution workflow
    
-   PR checklist
    

----------

## 🚢 CI/CD & release

Operational details:  
[docs/OPERATIONS.md](https://chatgpt.com/c/docs/OPERATIONS.md)

Version history:  
[CHANGELOG.md](https://chatgpt.com/c/CHANGELOG.md)

This covers GitHub Actions, local release builds, optional store secrets, Sentry, Maestro, OTA policy, and publishing notes.
