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

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for the fork/branch/PR workflow and quality checks.

---

## License

MIT
