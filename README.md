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

## ⌨️ Key commands

Command

Description

`npm start`

Start Metro bundler

`npm run ios` / `npm run android`

Run on simulator or device

`npm run env:ensure`

Create `.env` from `.env.example` if missing

`npm run android:clean`

Remove Android native/build directories

`npm run android:devices`

List connected Android devices

`npm run lint`

Run Biome checks

`npm run format`

Apply Biome formatting and safe fixes

`npm test`

Run Jest

`npx tsc --noEmit`

Run typecheck

`npm run i18n:all`

Extract i18n keys and generate types

`npm run gen:icons` / `npm run check:icons`

Manage SVG icon registry

`npm run check:imports`

Run path-alias guard

More scripts:  
[docs/development.md#key-commands](https://chatgpt.com/c/docs/development.md#key-commands)

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
