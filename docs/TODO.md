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

## Before / when you go public (maintainer)

**Copy-paste text and templates:** [OPERATIONS.md § Publishing & discoverability](OPERATIONS.md#publishing--discoverability).

These steps happen **outside** git (GitHub UI, design assets, community). Leave them unchecked until you actually do them:

- [ ] Set repository visibility to **Public** (GitHub → Settings → Danger zone).
- [ ] Set **description** and **topics** on the repo (suggested strings in [OPERATIONS.md § GitHub repository settings](OPERATIONS.md#github-repository-settings)).
- [ ] Add or refresh **README / marketing visuals** — screenshots or short GIF (guidance: [OPERATIONS.md § Screenshots](OPERATIONS.md#screenshots)); use stable paths (e.g. under `docs/images/`) if you commit images.
- [ ] Publish a **GitHub Release** for your first tag (process: [OPERATIONS.md § GitHub Releases](OPERATIONS.md#github-releases)).
- [ ] Submit a PR to **[awesome-react-native](https://github.com/jondot/awesome-react-native)** (Starter Kits / Templates) using the one-liner template in OPERATIONS.
- [ ] Post a **short launch** note (e.g. r/reactnative, React Native Discord, X) — bullet template in OPERATIONS.
- [ ] **Optional:** enable **GitHub Pages** or a small landing page — [OPERATIONS.md § Optional: GitHub Pages](OPERATIONS.md#optional-github-pages).

---

## After launch (ongoing)

Habits that help the repo stay trustworthy and discoverable (not one-and-done checkboxes):

- [ ] **Triage** issues and PRs within a few days early on.
- [ ] Keep **`main` CI green** (same checks as `.github/workflows/ci.yml`).
- [ ] Label **`good first issue`** where appropriate; pin a short roadmap or welcome issue if useful.
- [ ] **Tag releases** and paste CHANGELOG excerpts into GitHub Releases when you ship meaningful changes.
