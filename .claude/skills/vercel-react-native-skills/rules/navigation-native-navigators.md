---
title: Use Native Navigators for Navigation
impact: HIGH
impactDescription: native performance, platform-appropriate UI
tags: navigation, react-navigation, native-stack, bottom-tabs
---

## Use Native Navigators for Navigation

Prefer **native-backed** navigators from React Navigation so stacks use platform APIs (e.g. `UINavigationController` on iOS) where possible.

**Stacks:** Use **`@react-navigation/native-stack`** (`createNativeStackNavigator`). Avoid the legacy JS-based **`@react-navigation/stack`** (`createStackNavigator`) unless you have a specific reason.

**Tabs (this starter):** Use **`@react-navigation/bottom-tabs`** (`createBottomTabNavigator`). A **custom `tabBar`** (e.g. themed or animated) is fine—see `src/navigation/root/root-navigator.tsx`.

### Stack Navigation

**Incorrect (JS stack navigator):**

```tsx
import { createStackNavigator } from '@react-navigation/stack'

const Stack = createStackNavigator()

function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  )
}
```

**Correct (native stack):**

```tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator()

function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  )
}
```

### Tab Navigation (this template)

**Correct (bottom tabs + custom tab bar, matches this repo):**

```tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

const Tab = createBottomTabNavigator()

function HomeTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <AnimatedTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="TAB_HOME" component={HomeScreen} />
      <Tab.Screen name="TAB_SETTINGS" component={SettingsScreen} />
    </Tab.Navigator>
  )
}
```

Use **route name constants** from `src/navigation/routes.ts` in real code.

### Optional: native bottom tabs (extra dependency)

For **platform-native** tab bars (SF Symbols on iOS, etc.), you can adopt Callstack’s **`@bottom-tabs/react-navigation`**—it is **not** installed in this starter. See: [React Native Bottom Tabs — React Navigation](https://oss.callstack.com/react-native-bottom-tabs/docs/guides/usage-with-react-navigation).

### Prefer Native Header Options Over Custom Components

**Incorrect (custom header component):**

```tsx
<Stack.Screen
  name="Profile"
  component={ProfileScreen}
  options={{
    header: () => <CustomHeader title="Profile" />,
  }}
/>
```

**Correct (native header options):**

```tsx
<Stack.Screen
  name="Profile"
  component={ProfileScreen}
  options={{
    title: 'Profile',
    headerLargeTitleEnabled: true,
    headerSearchBarOptions: {
      placeholder: 'Search',
    },
  }}
/>
```

### Why Native Stack

- **Performance**: Native transitions and gestures where supported
- **Platform behavior**: Large titles, search bars, blur on iOS
- **Accessibility**: Platform accessibility features integrate more predictably

Reference:

- [React Navigation Native Stack](https://reactnavigation.org/docs/native-stack-navigator)
- [React Navigation Bottom Tabs](https://reactnavigation.org/docs/bottom-tab-navigator)
