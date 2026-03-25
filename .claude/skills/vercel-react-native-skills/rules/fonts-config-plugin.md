---
title: Load fonts natively at build time
impact: LOW
impactDescription: fonts available at launch, no async loading
tags: fonts, performance, config-plugin
---

## Load Fonts at Build Time (managed workflow)

For managed workflow: use the font config plugin to embed fonts at build time instead of
`useFonts` or `Font.loadAsync`. Embedded fonts are more efficient.

**For bare React Native:** use `react-native-asset` via `npm run link` to link font files. See repository root **`AGENTS.md`** (project-wide rules).

**Incorrect (async font loading):**

```tsx
import { Text, View } from 'react-native'

function App() {
  const [fontsLoaded] = useFonts({
    'Geist-Bold': require('./assets/fonts/Geist-Bold.otf'),
  })

  if (!fontsLoaded) return null

  return (
    <View>
      <Text style={{ fontFamily: 'Geist-Bold' }}>Hello</Text>
    </View>
  )
}
```

**Correct (fonts embedded at build):**

Link fonts with `react-native-asset` or your build config, then use the font family directly—no loading state.
