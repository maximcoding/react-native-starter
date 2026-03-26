# React Native Bare Starter

[![Use this template](https://img.shields.io/badge/Use%20this%20template-2ea44f?logo=github&logoColor=white)](https://github.com/maximcoding/react-native-starter/generate)
![CI](https://github.com/maximcoding/react-native-starter/actions/workflows/ci.yml/badge.svg)
![React Native](https://img.shields.io/badge/React%20Native-0.82.1-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)


A bare React Native starter for serious apps — no Expo, fast storage, modern state management, and a production-minded foundation from day one.

---

<div align="center">

[![Demo video](thumbnail.png)](https://github.com/user-attachments/assets/f7e1c02d-bdcd-4ecc-96f8-ad315038b1eb)

</div>

## ✨ Features Included

- **🧱 Bare React Native 0.82.1** — full native control, (no Expo lock-in)
- **🧭 React Navigation 7.x** — stacks, tabs, modals, predefined presets and options
- **📦 TanStack Query 5.x** — Framework agnostic powerful server data fetching library. Caching, updating, retries, invalidation, and persistence.
- **🪶 Zustand 5.x** — A small 1KB size, fast state management hook-based API. Eliminating boilerplates and prop drilling.
- **⚡ MMKV Storage 4.3** — `react-native-mmkv` via Nitro Modules, commonly described as up to **30× faster than AsyncStorage**
- **📡 Offline-ready** — query persistence, queue/replay, cache restore, and transport-level offline mode for a solid experience on flaky networks
- **🔌 Pluggable transport** — adapters for REST, GraphQL, WebSocket, and Firebase, so you can change backend strategy without rewiring the app
- **🎨 Theming** — light/dark mode with semantic tokens, ```ThemeProvider``` and ```useTheme()``` hook.
- **🌍 i18next 25.x** — typed translations with a typed `useT()` hook
- **🖼️ SVG via script** — `react-native-svg 15.x` with scripted icon generation ```npm run gen:icons```
- **🚀 BootSplash 6.x** — Shows a splash screen, put your icon into assets/logo.png and execute ```npm run bootsplash:generate```.
- **🧪 Developer experience** — Biome 2.x, Jest 29.x, GitHub Actions CI, and Maestro E2E
- **AI / agent workflow docs** — includes `.claude` agents and repo rules for more consistent AI-assisted changes

---

## 🛠️ Getting started

### Prerequisites

Standard bare React Native toolchain:

- Node.js ≥ 20
- Xcode for iOS
- Android Studio + SDK for Android
- CocoaPods for iOS

---

## 🚀 Quick Start

```bash
git clone https://github.com/maximcoding/react-native-starter.git
cd react-native-starter
npm install
npx pod-install ios
cp .env.example .env
```

**Launcher icon (optional):** `npm run gen:app-icon` is independent from splash generation and uses `assets/app-icon.png`. See [docs/development.md](docs/development.md#assets--guards).

Edit `.env` as needed, then:

```bash
npm start       # Metro bundler
npm run ios     # or: npm run android
```

---

## 🧭 Project structure

Feature-first structure with clear boundaries.

```text
src/
├── navigation/   # App navigation: stacks, tabs, modals, routes
├── session/      # App bootstrap and session flow
├── config/       # Env, constants, feature flags
├── i18n/         # Localization setup and typed translations
├── shared/       # Cross-app code used by multiple features
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── stores/   # Global UI state only
│   ├── theme/
│   └── utils/
└── features/     # Per-feature slices: screens, hooks, services, api, navigation

assets/
├── svgs/                # Source SVGs
├── logo.png             # BootSplash source of truth (`npm run bootsplash:generate`)
├── bootsplash-logo.svg  # App icon fallback source (`npm run gen:app-icon`)
├── bootsplash/          # Splash PNGs + manifest (`npm run bootsplash:generate`)
└── icons.ts             # Auto-generated icon registry
```

* **Repository layout** → [docs/development.md#repository-layout](docs/development.md#repository-layout)
* **Code rules & ownership** → [AGENTS.md](AGENTS.md)

---

## 🔐 Environment variables

Values are read at build time via `react-native-config`.
See [`.env.example`](.env.example). Rebuild the app after changing `.env`.

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

* [Sentry setup](docs/OPERATIONS.md#sentry)
* [OTA / updates policy](docs/OPERATIONS.md#over-the-air-updates)
* [Publishing / discoverability](docs/OPERATIONS.md#publishing--discoverability)

---

## ⌨️ Key Commands

| Command                           | What it does                       |
| --------------------------------- | ---------------------------------- |
| `npm start`                       | Start Metro (cache reset)          |
| `npm run ios` / `npm run android` | Run on simulator or device         |
| `npm run lint`                    | Biome check (read-only)            |
| `npm run format`                  | Biome format + safe fixes          |
| `npm test`                        | Jest                               |
| `npx tsc --noEmit`                | Typecheck                          |
| `npm run i18n:all`                | Extract i18n keys + generate types |
| `npm run gen:icons`               | Regenerate SVG icon registry       |
| `npm run android:clean`           | Clean Android build artifacts      |

Full command reference: [docs/development.md#key-commands](docs/development.md#key-commands)

---

## 🛠️ Android Troubleshooting

* **No connected devices** — start an emulator or connect via USB, then `npm run android:devices`
* **CMake / missing `codegen/jni`** — run `npm run android:clean`, then `npm run android`
* **Still failing** — `rm -rf node_modules/*/android/build`, reinstall, rebuild
* **Gradle clean without broken native tasks** — `npm run android:clean:gradle`

Full detail: [docs/development.md#android-build](docs/development.md#android-build)

---

## 🔐 Permissions

Declare only what you actually use. Full catalog: [docs/permissions-bare-rn.md](docs/permissions-bare-rn.md)

---

## 📚 Documentation

| Topic                                | Location                                                   |
| ------------------------------------ | ---------------------------------------------------------- |
| Rules, structure & contribution flow | [AGENTS.md](AGENTS.md)                                     |
| Developer reference                  | [docs/development.md](docs/development.md)                 |
| Offline behavior                     | [docs/OFFLINE.md](docs/OFFLINE.md)                         |
| Operations, CI, releases, Sentry     | [docs/OPERATIONS.md](docs/OPERATIONS.md)                   |
| Permissions catalog                  | [docs/permissions-bare-rn.md](docs/permissions-bare-rn.md) |
| Roadmap                              | [docs/TODO.md](docs/TODO.md)                               |
| Changelog                            | [CHANGELOG.md](CHANGELOG.md)                               |

---

## 🤝 Contributing

Contributions welcome — see [CONTRIBUTING.md](CONTRIBUTING.md) for branch/PR rules, quality checks, and PR checklist.

---

## 🚢 CI/CD & Release

GitHub Actions, local release builds, store secrets, Sentry, Maestro, OTA policy, and publishing notes: [docs/OPERATIONS.md](docs/OPERATIONS.md)

Version history: [CHANGELOG.md](CHANGELOG.md)

