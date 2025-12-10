### Deeper project structure (with file names)

Below is the full tree of `src/` including files that currently exist in the repository.

```txt
src/
  app/
    assets/
      fonts/
        Inter-Bold.ttf
        Inter-Medium.ttf
        Inter-Regular.ttf
        Inter-SemiBold.ttf
        JetBrainsMono-Regular.ttf
      svgs/
        user.svg
      icons.ts
      index.ts

    components/
      Button.tsx
      IconSvg.tsx
      ScreenWrapper.tsx
      Text.tsx

    features/
      auth/
        screens/
          AuthScreen.tsx
      home/
        screens/
          HomeScreen.tsx
      settings/
        screens/
          LanguageScreen.tsx
          OnboardingScreen.tsx
          SettingsScreen.tsx
          ThemeScreen.tsx

    hooks/
      (no files present)

    navigation/
      helpers/
        navigation-helpers.ts
      modals/
        global-modal.tsx
        half-sheet.tsx
      options/
        navigation.presets.ts
        navigation.tokens.ts
        navigation.ts
        tabOptions.tsx
      root/
        root-navigator.tsx
      stacks/
        auth-stack.tsx
        home-stack.tsx
        onboarding-stack.tsx
        settings-stack.tsx
      tabs/
        home-tabs.tsx
      types/
        auth-types.ts
        home-types.ts
        onboarding-types.ts
        root-types.ts
        settings-types.ts
        tab-types.ts
      index.ts
      routes.ts

    screens/
      TabsScreen.tsx

    services/
      auth/
        auth.mappers.ts
        auth.schemas.ts
        auth.service.ts
      user/
        user.mappers.ts
        user.schemas.ts
        user.service.ts
      index.ts

    state/
      (no files present)

    types/
      svg.d.ts

  core/
    config/
      app-config.ts
      constants.ts
      env.ts
      feature-flags.ts

    i18n/
      generate-i18n-types.cjs
      i18n.ts
      i18next-parser.config.cjs
      index.ts
      useT.ts
      locales/
        de.json
        en.json
        ru.json

    native/
      device-info.ts
      haptics.ts
      permissions.ts

    theme/
      ThemeContext.tsx
      ThemeProvider.tsx
      dark.ts
      index.ts
      light.ts
      tokens/
        elevation.ts
        fonts.ts
        radius.ts
        spacing.ts
        typography.ts
      useTheme.ts

    utils/
      (no files present)

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
      transport.ts
      transport.types.ts
      adapters/
        firebase.adapter.ts
        graphql.adapter.ts
        rest.adapter.ts
        websocket.adapter.ts
```

### Quick summary of what the project includes
- React Native + TypeScript starter using a feature-first app layout.
- Navigation (root/auth/home stacks, tabs), presets, and tokens.
- i18n with i18next and typed helpers; locale JSONs in `core/i18n/locales`.
- Theming system with tokens and a small UI kit (`Button`, `Text`, `ScreenWrapper`).
- Domain services (`auth`, `user`) with mappers and schemas.
- Infra layer with HTTP client + interceptors and transport adapters (REST/GraphQL/WebSocket/Firebase).
- Offline capabilities (cache engine, offline queue, sync engine) and NetInfo wrapper.

If you want, I can export this as a Markdown file, generate a `.tree` diagram, or annotate each folder with responsibilities.