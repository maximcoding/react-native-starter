---
name: rn-code-reviewer
description: Reviews React Native bare-workflow changes in this starter for correctness, regressions, architecture boundaries, React Query usage, theming, and test coverage. Use when reviewing PRs, diffs, or requested code reviews.
---

# RN Code Reviewer

Project-specific code review workflow for this React Native starter.

## When to apply

Use this skill when:
- Reviewing pull requests or local diffs
- Asked to "review" code quality, bugs, or regressions
- Validating RN architecture and repo conventions before merge

## Review priorities

Always prioritize findings in this order:
1. Correctness and behavioral regressions
2. Security/privacy risks and error handling gaps
3. Architecture and boundary violations
4. Performance concerns with real user impact
5. Missing or weak tests

## Required checks

### 1) Correctness and risk
- Verify changed logic matches intended behavior and handles edge cases.
- Flag silent failures, swallowed errors, or lossy error handling.
- Check async flows for loading, success, and error-state handling.

### 2) Repository architecture constraints
- Enforce feature/shared boundaries (`src/shared` must not import from features).
- Enforce alias imports (`@/`); flag deep relative imports.
- Verify feature code stays under `src/features/<feature>/...` with expected folders.

### 3) React Native UI conventions
- Flag raw colors/spacing/fonts in UI; require theme tokens.
- Prefer `StyleSheet.create()` over broad inline styles (except dynamic values).
- Verify platform-specific behavior is handled where needed (`Platform.select`, native differences).

### 4) Data/state conventions
- Server state should use React Query (feature-level `api/keys.ts` key patterns).
- Mutations should use targeted invalidation (`meta.tags` / invalidation paths).
- Flag server data leaking into Zustand stores.
- Flag direct `fetch` usage (project transport layer should be used).

### 5) Tests and verification
- Ensure non-trivial logic changes include tests or justify why not.
- Suggest concrete missing tests (what behavior, where to add).
- Highlight risky untested paths before merge.

## Output format

Return findings first, ordered by severity:

1. `Critical` — must fix before merge
2. `Major` — high-impact issues, should fix
3. `Minor` — quality/maintainability improvements

For each finding include:
- File path
- Why it is a problem (risk/regression)
- Specific fix direction

Then include:
- Open questions/assumptions
- Brief change summary (secondary)
- Residual testing gaps

## Review behavior rules

- Do not lead with a broad summary before findings.
- Be explicit about potential regressions and user impact.
- Prefer actionable, minimal suggestions over large refactors.
- If no issues are found, explicitly state "No findings" and note residual risks or test gaps.

## Additional reference

Use this checklist for quick pass/fail scanning:
- [CHECKLIST.md](CHECKLIST.md)
