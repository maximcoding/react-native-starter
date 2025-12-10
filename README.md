Вот без лишней воды — просто **готовый README.md**, который можно положить в корень репо.

````md
# React Native Mobile Starter

Production-oriented React Native starter: feature-first architecture, strict TypeScript, centralized theme + navigation, i18n, offline-ready infra and extensible transport layer (REST / GraphQL / WebSocket / Firebase).

---

## 🚀 Features

- React Native `0.82.x` + TypeScript (strict)
- Feature-first structure: `app/`, `core/`, `infra/`
- Centralized theme system (light/dark, tokens, semantic colors)
- Reusable UI Kit: `Button`, `Text`, `ScreenWrapper` (theme-driven)
- Enterprise navigation: root/app/auth/tabs + presets + tokens
- i18n with i18next, namespaces per feature, type-safe `useT()`
- Service layer per domain (`auth`, `user`) with mappers + schemas
- Transport layer with pluggable adapters (REST/GraphQL/WebSocket/Firebase)
- Offline layer: cache engine, offline queue, sync engine, NetInfo wrapper
- Normalized error handling for all data sources
- Native utilities: device info, permissions, haptics
- Dev scripts for Android builds, i18n extraction, releases (`standard-version`)
- Prepared for separate Android / iOS CI/CD pipelines

---

## 📁 Project Structure

```txt
assets/
  fonts/
  images/
  svgs/
  splash/

src/
  app/
    components/
      domain/
      ui/                # Button, Text, ScreenWrapper
    features/
      auth/
        i18n/           # de/en/ru JSON for auth
      home/
        i18n/
      settings/
        screens/
          LanguageScreen.tsx
    hooks/
    navigation/
      config/
        navConfig.tsx
      helpers/
        navigation-helpers.ts
      modals/
        global-modal.tsx
        half-sheet.tsx
      options/
        navigation.presets.ts
        navigation.tokens.ts
        navigation.ts
      root/
        root-navigator.tsx
      stacks/
        app/home-stack.tsx
        auth/auth-stack.tsx
      tabs/
        app-tabs.tsx
      types/
        index.ts
        routes.ts
    screens/             # generic / placeholder screens
    services/
      auth/
        auth.mappers.ts
        auth.schemas.ts
        auth.service.ts
      user/
        user.mappers.ts
        user.schemas.ts
        user.service.ts
    state/               # (Zustand stores – planned)
    App.tsx

  core/
    config/
      app-config.ts
      constants.ts
      env.ts
      feature-flags.ts
    i18n/
      locales/
        de/common.json
        en/common.json
        ru/common.json
      generate-i18n-types.cjs
      i18n.ts
      i18next-parser.config.cjs
      index.ts
      useT.ts
    native/
      device-info.ts
      haptics.ts
      permissions.ts
    theme/
      tokens/
        dark.ts
        light.ts
        index.ts
      ThemeContext.tsx
      ThemeProvider.tsx
      useTheme.ts
    utils/               # generic helpers (planned)

  infra/
    error/
      normalize-error.ts
    http/
      api.ts
      axios.instance.ts
      interceptors/
        auth.interceptor.ts
        error.interceptor.ts
        logging.interceptor.ts
    network/
      netinfo.ts
    offline/
      offline-queue.ts
      sync-engine.ts
    storage/
      cache-engine.ts
      mmkv.ts
    transport/
      adapters/
        firebase.adapter.ts
        graphql.adapter.ts
        rest.adapter.ts
        websocket.adapter.ts
      transport.ts
      transport.types.ts
````

---

## 🧩 Architecture Overview

* **`app/`** – всё, что видит пользователь:

    * UI-компоненты, экраны, фичи, navigation, services, state.
* **`core/`** – кросс-срезовые вещи:

    * тема, i18n, native-утилиты, config, общие utils.
* **`infra/`** – низкоуровневая инфраструктура:

    * HTTP-клиент, transport adapters, offline, storage, error-нормализация.

### Navigation

* Root Navigator переключает флоу:

    * `ROOT_AUTH` → `AuthStack`
    * `ROOT_APP` → `AppStack` (+ Tabs)
* Все опции/стили навигации централизованы:

    * `navigation.tokens.ts` – цвета/типографика из темы
    * `navigation.presets.ts` – базовые пресеты (stack/tab/modal)
    * `navConfig.tsx` + `routes.ts` – именованные маршруты, лейблы, иконки

### Theme

* `core/theme/tokens/*` – spacing, radius, typography, elevation, fonts
* `light.ts` / `dark.ts` – семантические палитры (`background`, `surface`, `textPrimary`, `primary`, `danger` и т.д.)
* `ThemeProvider` + `useTheme()` – доступ к теме из любого места
* Все UI-компоненты используют токены, а не голые числа/hex.

### i18n

* `core/i18n/i18n.ts` – инициализация i18next (+ авто-детект языка)
* `core/i18n/useT.ts` – hook-обёртка `useTranslation`
* `core/i18n/locales/*/common.json` – глобальные тексты
* `app/features/*/i18n/*.json` – текст фичей (namespaced)
* dev-скрипты:

    * `npm run i18n:extract`
    * `npm run i18n:types`

### Services & Infra

* `app/services/{auth,user}/…`:

    * `*.schemas.ts` – Zod-схемы (валидация входных/выходных данных)
    * `*.mappers.ts` – адаптация API → доменная модель
    * `*.service.ts` – публичные методы для фичей (используют `infra/transport`)

* `infra/transport`:

    * `transport.types.ts` – общий интерфейс Transport
    * `transport.ts` – выбор актуального адаптера (REST/GraphQL/WebSocket/Firebase)
    * адаптеры:

        * `rest.adapter.ts` – через Axios
        * `graphql.adapter.ts` – заглушка под Apollo/urql
        * `websocket.adapter.ts` – заглушка под WS-клиент
        * `firebase.adapter.ts` – заглушка под Firebase SDK

* `infra/offline`:

    * `offline-queue.ts` – очередь мутаций в оффлайне
    * `sync-engine.ts` – реплей очереди при восстановлении сети

* `infra/storage`:

    * `mmkv.ts` – интерфейс key-value-хранилища (пока in-memory, позже MMKV)
    * `cache-engine.ts` – кэш снапшотов запросов

---

## 🧑‍💻 Local Development Guide

### 1. Установка

```bash
npm install
```

(при конфликтах peerDeps можно использовать `npm install --legacy-peer-deps`)

### 2. Запуск Metro

```bash
npm start
```

### 3. Запуск приложений

```bash
# iOS (симулятор)
npm run ios
# Android (эмулятор/устройство)
npm run android
```

### 4. Полезные dev-скрипты

```bash
npm run lint          # ESLint
npm run test          # Jest
npm run cache:clean   # очистка npm cache
npm run clean         # очистка проекта RN
npm run clean:auto    # deep clean через react-native-clean-project

# Android tooling
npm run android:build:debug
npm run android:build:release
npm run android:build:bundle
npm run android:clean
npm run debug:key

# i18n
npm run i18n:extract  # вытащить ключи из кода
npm run i18n:types    # сгенерировать ts-типы для строк
npm run i18n:all      # extract + types

# Releases (semver + CHANGELOG)
npm run release
npm run release:patch
npm run release:minor
npm run release:major
```

---

## 🧱 Feature Development Guidelines

### Добавление новой фичи

1. Создай директорию:

```txt
src/app/features/<feature-name>/
  i18n/
  screens/
  hooks/
  components/
```

2. Создай экраны в `screens/` и используй:

    * `ScreenWrapper` для базовой разметки
    * UI-kit (`Text`, `Button` и т.п.) вместо raw RN view-компонентов.

3. Тексты:

    * `src/app/features/<feature-name>/i18n/en.json`
    * `…/ru.json`, `…/de.json` по необходимости
    * ключи по схеме: `"featureName.actionName"`.

4. Services:

    * Логика работы с API — в `src/app/services/<domain>`.
    * UI никогда не вызывает `infra` напрямую.

5. Navigation:

    * Добавь новый маршрут в `src/app/navigation/types/routes.ts`
    * Обнови `navConfig.tsx` для лейблов/иконок.
    * Подключи экран в нужный Stack/Tab.

---

## 🌗 Theme & UI Kit Usage

### ScreenWrapper

* Базовый контейнер, уже обёрнутый в SafeArea + background из темы.
* Использовать как root каждого экрана.

```tsx
import { ScreenWrapper } from '@/app/components/ui/ScreenWrapper';
import { Text } from '@/app/components/ui/Text';
import { Button } from '@/app/components/ui/Button';

export function ExampleScreen() {
  return (
    <ScreenWrapper>
      <Text>Example</Text>
      <Button title="Action" />
    </ScreenWrapper>
  );
}
```

### Text

* По умолчанию: `theme.typography.bodyMedium` + `textPrimary`
* При необходимости применяй другой стиль из `theme.typography.*`.

### Button

* Варианты: `primary | secondary | outline`
* Размеры: `md | lg`

---

## 🌍 i18n Workflow

1. Пишешь код с ключами `t('auth.login.title')` и т.п.
2. Запускаешь:

```bash
npm run i18n:all
```

3. Parser вытаскивает новые ключи в JSON.
4. Генератор создаёт типы, чтобы ключи были type-safe.

---

## 🏗 DevOps Overview (High-Level)

> У тебя уже есть несколько GitHub Actions workflow-файлов
> (`android-ci.yml`, `ios-ci.yml`, `mobile-ci.yml`, `ci.yml`, `release.yml`).
> Основная идея — разделить пайплайны для Android и iOS.

Рекомендуемый подход:

* **Обычная разработка**

    * пушишь в feature-ветки → только лёгкий CI (lint/test/build)
    * без релизных билдов, без деплоя.

* **Релизы**

    * создаёшь tag `vX.Y.Z` или пушишь в `release/*` →

        * Android workflow собирает AAB и (опционально) отправляет в Google Play Internal
        * iOS workflow собирает IPA и (опционально) отправляет в TestFlight

Локально для проверки релизных команд:

```bash
# Android
npm run android:build:release

# iOS — через Xcode/fastlane (когда настроим полностью)
```

---

## 🔐 Secrets & Environments (для CI/CD)

Для реального продакшена понадобятся секреты в GitHub:

* `GOOGLE_SERVICE_ACCOUNT_JSON` – для `supply` (Google Play)
* `APP_STORE_CONNECT_API_KEY_JSON` – для `pilot` (TestFlight)
* `.env` / `env.ts` – конфиги API-эндпоинтов, ключей и т.д.

---

## ✅ Roadmap / TODO

* [ ] Завести Zustand-сторы в `src/app/state`
* [ ] Добавить TanStack Query для server state
* [ ] Провести чистку GitHub workflows (оставить только android/ios/release)
* [ ] Вынести CodePush/OTA в отдельный DevOps-пакет
* [ ] Добавить Sentry/Crashlytics интеграцию
* [ ] Расширить UI Kit (Inputs, Cards, Lists, Toasts)

---

## 📝 Conventions

* Components: `PascalCase.tsx`
* Hooks: `useSomething.ts`
* Services / mappers / schemas: `kebab-case.ts`
* Никаких `../../../` — только alias-импорты (`@/app/...`, `@/core/...`, `@/infra/...`)
* Никаких magic numbers/hex в компонентах — всё через тему и токены

```

Если хочешь, следующим шагом можем:

- сделать **README_DEVOPS.md** чисто про CI/CD,  
- или **CLEANUP CLI** для удаления лишних YAML и наведения порядка в workflows.
```
