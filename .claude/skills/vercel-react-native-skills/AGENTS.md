# Vercel RN performance skill — pointer (this folder only)

**Authoritative content** for this skill lives in:

- [`SKILL.md`](SKILL.md) — when to apply, project constraints, rule index
- [`rules/`](rules/) — one file per guideline (read these for examples)

This file is **not** a compiled rollup of all rules (that copy drifted from this starter’s stack).

## Stack this starter uses (bare React Native)

- **React Native** bare workflow (not Expo managed)
- **Navigation:** `@react-navigation/native-stack`, `@react-navigation/bottom-tabs` (see `src/navigation/root/root-navigator.tsx`)
- **Lists:** `@shopify/flash-list` — treat **FlashList** as the default virtualized list in rule examples
- **Styling:** theme tokens + `StyleSheet.create()` (no NativeWind / Tailwind in this repo)
- **Fonts:** `react-native-asset` / `npm run link` (not Expo config plugins)

**Project-wide boundaries** (features vs shared, aliases, don’ts): repository root [`AGENTS.md`](../../../AGENTS.md).
