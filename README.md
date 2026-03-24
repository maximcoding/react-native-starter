# React Native Bare Starter

[![Use this template](https://img.shields.io/badge/Use%20this%20template-2ea44f?logo=github&logoColor=white)](https://github.com/maximcoding/react-native-starter/generate)
![CI](https://github.com/maximcoding/react-native-starter/actions/workflows/ci.yml/badge.svg)
![React Native](https://img.shields.io/badge/React%20Native-0.82.1-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

A bare-workflow React Native starter for apps that need more than a demo.

Skip the weeks of boilerplate. Start with strict TypeScript, real navigation, offline-ready data flow, theming, i18n, and quality gates already wired — so you can ship features instead of rebuilding infrastructure.

---

## 🚀 Quick Start

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

> **Prerequisites:** Node ≥ 20 · Xcode (iOS) · Android Studio + SDK (Android) · CocoaPods (iOS)
>
> If `npm install` fails on peer deps, try `npm install --legacy-peer-deps`.

---

## ✨ Features

### 🧱 Core

- **Bare React Native 0.82** with Hermes — full native control, no Expo lock-in
- **Strict TypeScript** across the entire codebase
- **Feature-first project structure** that scales past the first few screens

### 🧭 Navigation & State

- **React Navigation** — stacks, bottom tabs, and modals already wired
- **TanStack Query** — server state with caching, persistence, retries, and tag-based invalidation
- **Zustand** — lightweight global state without Redux boilerplate

### 📡 Data & Networking

- **MMKV Storage** via Nitro Modules — up to 30× faster than AsyncStorage
- **Offline-ready flow** — query persistence, queue/replay, cache restore, transport-level offline mode
- **Pluggable transport layer** — adapters for REST, GraphQL, WebSocket, and Firebase; swap backends without rewiring

### 🎨 UI & Localization

- **Theme tokens** — light/dark mode with semantic design tokens, no magic values
- **i18next** — typed `useT()` hook with key extraction and type generation
- **SVG icon pipeline** — scripted generation via `npm run gen:icons`
- **BootSplash** — native splash screen included and ready to customize

### 🧪 Quality & CI

- **Biome** for linting and formatting
- **Jest** for unit tests
- **Maestro** for E2E flows
- **GitHub Actions** CI pipeline out of the box

---

## 🧭 Project Structure

Feature-first layout under `src/features`, shared code in `src/shared`.

- **Repository layout** → [docs/development.md#repository-layout](docs/development.md#repository-layout)
- **Code rules & ownership** → [AGENTS.md](AGENTS.md)

---

## 🔐 Environment Variables

Read at build time via `react-native-config`. See [`.env.example`](.env.example) for defaults. Rebuild the app after any change.

| Variable | Required | Purpose |
|---|---|---|
| `API_URL` | For real API | Backend base URL |
| `USE_MOCK_API` | No | `true` uses mock transport; login pre-fills demo credentials |
| `WS_URL` | No | WebSocket base URL |
| `ENV` | No | `development` / `staging` / `production` |
| `SENTRY_DSN` | No | Enables Sentry error tracking |
| `SENTRY_ENABLE_IN_DEV` | No | `1` sends Sentry events from `__DEV__` |
| `SENTRY_TRACES_SAMPLE_RATE` | No | Performance sampling (`0`–`1`) |
| `CODEPUSH_KEY_IOS` / `CODEPUSH_KEY_ANDROID` | No | Reserved for OTA (no CodePush SDK ships by default) |

Related: [Sentry setup](docs/OPERATIONS.md#sentry) · [OTA policy](docs/OPERATIONS.md#over-the-air-updates)

---

## ⌨️ Key Commands

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

Full command reference: [docs/development.md#key-commands](docs/development.md#key-commands)

---

## 🛠️ Android Troubleshooting

- **No connected devices** — start an emulator or connect via USB, then `npm run android:devices`
- **CMake / missing `codegen/jni`** — run `npm run android:clean`, then `npm run android`
- **Still failing** — `rm -rf node_modules/*/android/build`, reinstall, rebuild
- **Gradle clean without broken native tasks** — `npm run android:clean:gradle`

Full detail: [docs/development.md#android-build](docs/development.md#android-build)

---

## 🔐 Permissions

Declare only what you actually use. Full catalog: [docs/permissions-bare-rn.md](docs/permissions-bare-rn.md)

---

## 📚 Documentation

| Topic | Location |
|---|---|
| Rules, structure & contribution flow | [AGENTS.md](AGENTS.md) |
| Developer reference | [docs/development.md](docs/development.md) |
| Offline behavior | [docs/OFFLINE.md](docs/OFFLINE.md) |
| Operations, CI, releases, Sentry | [docs/OPERATIONS.md](docs/OPERATIONS.md) |
| Permissions catalog | [docs/permissions-bare-rn.md](docs/permissions-bare-rn.md) |
| Roadmap | [docs/TODO.md](docs/TODO.md) |
| Changelog | [CHANGELOG.md](CHANGELOG.md) |

---

## 🤝 Contributing

Contributions welcome — see [CONTRIBUTING.md](CONTRIBUTING.md) for branch/PR rules, quality checks, and PR checklist.

---

## 🚢 CI/CD & Release

GitHub Actions, local release builds, store secrets, Sentry, Maestro, OTA policy, and publishing notes: [docs/OPERATIONS.md](docs/OPERATIONS.md)

Version history: [CHANGELOG.md](CHANGELOG.md)

---

## License

MIT
