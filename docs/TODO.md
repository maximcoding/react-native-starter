**Not architecture SSOT.** Product backlog, publishing checklist, and “what’s left for open source.” For structure and rules see [AGENTS.md](../AGENTS.md), [README.md](../README.md), and [.claude/rules/](../.claude/rules/).

---

## Dependency upgrades to track

### React Navigation v8
- **Status:** alpha only (`8.0.0-alpha.16` as of 2026-03-25) — do not upgrade until stable/RC.
- **Current:** `@react-navigation/native ^7.1.24`, `@react-navigation/native-stack ^7.8.5`, `@react-navigation/bottom-tabs ^7.8.11`
- **Watch:** https://github.com/react-navigation/react-navigation/releases
- **When stable:** bump all three `@react-navigation/*` packages together; check peer dep requirements for `react-native-screens` and `react-native-safe-area-context`; review breaking changes in changelog before migrating.
- **Expected changes:** further static config improvements, possible `screenOptions` API changes, `react-native-screens` peer dep bump.

---
