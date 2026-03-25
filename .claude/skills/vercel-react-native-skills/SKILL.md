---
name: vercel-react-native-skills
description:
  React Native (bare workflow) best practices for building performant mobile apps. Use
  when building React Native components, optimizing list performance,
  implementing animations, or working with native modules. Triggers on tasks
  involving React Native, mobile performance, or native platform APIs.
license: MIT
metadata:
  author: vercel
  version: '1.0.0'
---

# React Native Skills

Comprehensive best practices for React Native applications. Contains
rules across multiple categories covering performance, animations, UI patterns,
and platform-specific optimizations.

## When to Apply

Reference these guidelines when:

- Building bare React Native apps
- Optimizing list and scroll performance
- Implementing animations with Reanimated
- Working with images and media
- Configuring native modules or fonts
- Structuring projects with native dependencies

> **Project constraints:** Bare workflow only, no Nativewind, no Tailwind. Styling uses `StyleSheet.create()` with theme tokens only. Font setup uses `react-native-asset`. Use React Native's built-in `Image` or `react-native-fast-image`. **Lists:** prefer `@shopify/flash-list` (examples in `rules/` use FlashList). **Monorepo** rules apply only in a multi-package repo; this starter is a **single app**—skip them unless you adopt a monorepo layout.

## Rule Categories by Priority

| Priority | Category         | Impact   | Prefix               |
| -------- | ---------------- | -------- | -------------------- |
| 1        | List Performance | CRITICAL | `list-performance-`  |
| 2        | Animation        | HIGH     | `animation-`         |
| 3        | Navigation       | HIGH     | `navigation-`        |
| 4        | UI Patterns      | HIGH     | `ui-`                |
| 5        | State Management | MEDIUM   | `react-state-`       |
| 6        | Rendering        | MEDIUM   | `rendering-`         |
| 7        | Monorepo         | MEDIUM   | `monorepo-`          |
| 8        | Configuration    | LOW      | `fonts-`, `imports-` |

## Quick Reference

### 1. List Performance (CRITICAL)

- `list-performance-virtualize` - Use FlashList for large lists
- `list-performance-item-memo` - Memoize list item components
- `list-performance-callbacks` - Stabilize callback references
- `list-performance-inline-objects` - Avoid inline style objects
- `list-performance-function-references` - Extract functions outside render
- `list-performance-images` - Optimize images in lists
- `list-performance-item-expensive` - Move expensive work outside items
- `list-performance-item-types` - Use item types for heterogeneous lists

### 2. Animation (HIGH)

- `animation-gpu-properties` - Animate only transform and opacity
- `animation-derived-value` - Use useDerivedValue for computed animations
- `animation-gesture-detector-press` - Use Gesture.Tap instead of Pressable

### 3. Navigation (HIGH)

- `navigation-native-navigators` - Use `@react-navigation/native-stack` for stacks; this template uses `@react-navigation/bottom-tabs` with a custom tab bar (optional: Callstack native bottom tabs if you add the dependency)

### 4. UI Patterns (HIGH)

- `ui-optimized-image` - use react-native-fast-image for bare workflow
- `ui-image-gallery` - Use Galeria for image lightboxes
- `ui-pressable` - Use Pressable over TouchableOpacity
- `ui-safe-area-scroll` - Handle safe areas in ScrollViews
- `ui-scrollview-content-inset` - Use contentInset for headers
- `ui-menus` - Use native context menus
- `ui-native-modals` - Use native modals when possible
- `ui-measure-views` - Use onLayout, not measure()
- `ui-styling` - Use StyleSheet.create with theme tokens (Nativewind is **not used** in this project)

### 5. State Management (MEDIUM)

- `react-state-minimize` - Minimize state subscriptions
- `react-state-dispatcher` - Use dispatcher pattern for callbacks
- `react-state-fallback` - Show fallback on first render
- `react-compiler-destructure-functions` - Destructure for React Compiler
- `react-compiler-reanimated-shared-values` - Handle shared values with compiler

### 6. Rendering (MEDIUM)

- `rendering-text-in-text-component` - Wrap text in Text components
- `rendering-no-falsy-and` - Avoid falsy && for conditional rendering

### 7. Monorepo (MEDIUM)

- `monorepo-native-deps-in-app` - Keep native dependencies in app package (**ignore** in single-package apps)
- `monorepo-single-dependency-versions` - Single versions across packages (**ignore** unless monorepo)

### 8. Configuration (LOW)

- `fonts-config-plugin` - not applicable for bare workflow; use `react-native-asset` via `npm run link`
- `imports-design-system-folder` - Organize design system imports
- `js-hoist-intl` - Hoist Intl object creation

## How to Use

Read individual rule files for detailed explanations and code examples:

```
rules/list-performance-virtualize.md
rules/animation-gpu-properties.md
```

Each rule file contains:

- Brief explanation of why it matters
- Incorrect code example with explanation
- Correct code example with explanation
- Additional context and references

## Pointer doc

[`AGENTS.md`](AGENTS.md) in this folder summarizes the stack and links to repository-wide [`AGENTS.md`](../../../AGENTS.md). **All expanded examples** live under `rules/`—there is no monolithic compiled rollup (avoids drift from this starter).
