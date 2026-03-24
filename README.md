# React Native Bare Starter

[![Use this template](https://img.shields.io/badge/Use%20this%20template-2ea44f?logo=github&logoColor=white)](https://github.com/maximcoding/react-native-starter/generate)
![CI](https://github.com/maximcoding/react-native-starter/actions/workflows/ci.yml/badge.svg)
![React Native](https://img.shields.io/badge/React%20Native-0.82.1-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-%3E%3D20-brightgreen?logo=node.js)
![Version](https://img.shields.io/badge/version-1.0.0-blue)

A bare-workflow React Native starter for apps that need more than a demo.

Built for developers who want a clean foundation from day one: **strict TypeScript**, **feature-first structure**, **theme tokens**, **i18n**, **offline-ready behavior**, solid quality gates, and room to grow without rebuilding the same setup again.

### 🚀 Quick start

First-time setup:

```bash
git clone https://github.com/maximcoding/react-native-starter.git
cd react-native-starter
npm install
npx pod-install ios
cp .env.example .env
````

Then edit `.env` as needed (`API_URL`, `USE_MOCK_API`, optional Sentry / OTA keys).

Next step: [Running the app](#running-the-app)

Prerequisites: [Getting Started](#getting-started)

---

## 📚 Table of Contents

* [Features](#features)
* [Project structure](#project-structure)
* [Getting Started](#getting-started)
* [Environment variables](#environment-variables)
* [Key commands](#key-commands)
* [Documentation](#documentation)
* [Permissions](#permissions)
* [Contributing](#contributing)
* [CI/CD & Release](#cicd--release)

---

## ✨ Features

### 🔥 What’s already included

| Capability | Included | Why it matters |
|---|---|---|
| **🧱 Bare React Native** | Bare workflow (no Expo), Hermes, strict TypeScript | Full native control and a cleaner long-term foundation |
| **🧭 React Navigation** | Stacks, bottom tabs, and modals already wired | Start with real app navigation instead of building the shell from scratch |
| **📦 Server state** | `@tanstack/react-query` with persistence and tag-based invalidation | Cleaner API data flow, caching, retries, revalidation, and better async UX |
| **🪶 Global state** | `zustand` | Lightweight shared state without Redux boilerplate |
| **⚡ Fast local storage** | `react-native-mmkv` + `react-native-nitro-modules` | Very fast persisted storage, commonly positioned as up to **30× faster than AsyncStorage** |
| **📡 Offline-ready flow** | Query persistence, queue/replay, cache restore, transport offline mode | Better user experience on unstable networks and less fragile app behavior |
| **🔌 Transport layer** | Pluggable adapters for REST, GraphQL, WebSocket, and Firebase | Change backend strategy without rewriting the whole app foundation |
| **🎨 Theme tokens** | Light/Dark mode and semantic theming | Consistent UI without magic values everywhere |
| **🌍 Localization** | `i18next` + `react-i18next` + typed `useT()` | Real i18n support from day one, not something bolted on later |
| **🖼️ SVG icon workflow** | `react-native-svg` + `npm run gen:icons` | Easier icon pipeline with less manual asset wiring |
| **🚀 Splash screen included** | `react-native-bootsplash` + `npm run bootsplash:generate` | Native splash setup is already included and ready to customize |
| **🧪 Quality gates** | Biome, Jest, GitHub Actions, Maestro | Faster dev workflow and stronger delivery confidence |

Pinned versions live in [`package.json`](package.json).

For deeper implementation details, see:

- [docs/development.md](docs/development.md)
- [docs/OFFLINE.md](docs/OFFLINE.md)
- [docs/OPERATIONS.md](docs/OPERATIONS.md)

## 🧭 Project structure

Repository tree, folder layout, and comments:
**[docs/development.md#repository-layout](docs/development.md#repository-layout)**

Import rules and “where code lives”:
**[AGENTS.md](AGENTS.md)**

This starter is organized to scale past the first few screens without turning into a dump of shared files and ad-hoc folders.

---

## 🛠️ Getting Started

### Prerequisites

Use the standard bare React Native toolchain:

* Node.js ≥ 20
* Xcode for iOS
* Android Studio + SDK for Android
* CocoaPods for iOS

### Installation

Run the setup steps in [Quick start](#quick-start).

If `npm install` fails because of peer dependency conflicts, try:

```bash
npm install --legacy-peer-deps
```

### Running the app

During development, keep Metro running in one terminal and launch the native app from another:

```bash
npm start
npm run ios
npm run android
```

`npm run ios` and `npm run android` run **`env:ensure`** first, which creates `.env` from [`.env.example`](.env.example) if needed.

<details>
<summary>Android build troubleshooting</summary>

* **No connected devices** — start an emulator or connect a device with USB debugging, then run `npm run android:devices`
* **CMake errors about missing `codegen/jni`** — common with New Architecture. Do not keep repeating `./gradlew clean` until a successful native build regenerates those folders. Run `npm run android:clean`, then `npm run android`
* **Still failing** — try `rm -rf node_modules/*/android/build`, reinstall dependencies, and rebuild
* **Need a Gradle clean that skips broken native tasks** — use `npm run android:clean:gradle`

Full detail: [docs/development.md#android-build](docs/development.md#android-build)

</details>

### Environment variables

Values are read at build time via **`react-native-config`**. See [`.env.example`](.env.example).

After changing `.env`, rebuild the app.

| Variable                                    | Required     | Purpose                                                                                                                                                       |
| ------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `API_URL`                                   | For real API | Backend base URL                                                                                                                                              |
| `USE_MOCK_API`                              | No           | `true` / `1` uses the mock transport in **dev**; login screen pre-fills **`demo@example.com` / `password`** (any valid email + non-empty password also works) |
| `WS_URL`                                    | No           | WebSocket base URL for the WebSocket transport adapter                                                                                                        |
| `ENV`                                       | No           | Runtime environment label (`development` / `staging` / `production`); defaults to `development` in `__DEV__`, `production` otherwise                          |
| `SENTRY_DSN`                                | No           | Enables Sentry when non-empty; debug builds stay quiet unless `SENTRY_ENABLE_IN_DEV=1`                                                                        |
| `SENTRY_ENABLE_IN_DEV`                      | No           | `1` = send Sentry events from `__DEV__`                                                                                                                       |
| `SENTRY_TRACES_SAMPLE_RATE`                 | No           | `0`–`1` performance sampling (`0` = off)                                                                                                                      |
| `CODEPUSH_KEY_IOS` / `CODEPUSH_KEY_ANDROID` | No           | Reserved for OTA; no CodePush SDK ships by default — see [docs/OPERATIONS.md#over-the-air-updates](docs/OPERATIONS.md#over-the-air-updates)                   |

Useful docs:

* [Sentry setup](docs/OPERATIONS.md#sentry)
* [OTA / updates policy](docs/OPERATIONS.md#over-the-air-updates)
* [Going public / GitHub / releases](docs/OPERATIONS.md#publishing--discoverability)

---

## ⌨️ Key commands

| Command                                     | Description                                                                                                |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `npm start`                                 | Start Metro bundler (cache reset)                                                                          |
| `npm run ios` / `npm run android`           | Run on simulator or device (ensures `.env` exists)                                                         |
| `npm run env:ensure`                        | Create `.env` from `.env.example` if missing                                                               |
| `npm run android:clean`                     | Remove Android native/build dirs (`.cxx`, `android/app/build`, `android/build`) — avoids `./gradlew clean` |
| `npm run android:devices`                   | Run `adb devices`                                                                                          |
| `npm run lint`                              | Run Biome check (no writes)                                                                                |
| `npm run format`                            | Apply Biome formatting + safe fixes                                                                        |
| `npm test`                                  | Run Jest                                                                                                   |
| `npx tsc --noEmit`                          | Run typecheck                                                                                              |
| `npm run i18n:all`                          | Extract i18n keys + generate types                                                                         |
| `npm run gen:icons` / `npm run check:icons` | Manage icon registry                                                                                       |
| `npm run check:imports`                     | Run path-alias guard                                                                                       |

More scripts, including Android builds, release bumps, and splash generation:
[docs/development.md#key-commands](docs/development.md#key-commands)

---

## 📖 Documentation

This is the main README. For everything else:

* **Rules, structure, and contribution flow** → [AGENTS.md](AGENTS.md)
* **Deep developer reference** → [docs/development.md](docs/development.md)
* **Offline behavior** → [docs/OFFLINE.md](docs/OFFLINE.md)
* **Operations, CI, releases, OTA, Sentry** → [docs/OPERATIONS.md](docs/OPERATIONS.md)
* **Roadmap / backlog** → [docs/TODO.md](docs/TODO.md)

If you want the doc matrix, see:
**[AGENTS.md#documentation-map](AGENTS.md#documentation-map)**

---

## 🔐 Permissions

Declare only what you actually use.

Full catalog:
**[docs/permissions-bare-rn.md](docs/permissions-bare-rn.md)**

---

## 🤝 Contributing

Contributions are welcome.

See [CONTRIBUTING.md](CONTRIBUTING.md) for:

* fork / branch / PR rules
* quality checks
* PR checklist
* contribution workflow

---

## 🚢 CI/CD & Release

Canonical operational detail:
**[docs/OPERATIONS.md](docs/OPERATIONS.md)**

Version history:
**[CHANGELOG.md](CHANGELOG.md)**

This includes GitHub Actions, local release builds, optional store secrets, Sentry, Maestro, OTA policy, and publishing notes.
