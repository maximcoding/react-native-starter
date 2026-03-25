# RN Starter Review Checklist

Use this as a concise pass/fail checklist during reviews.

## Correctness
- [ ] Logic changes handle happy path and edge cases.
- [ ] Async flows handle loading, success, and error states.
- [ ] Errors are not swallowed; context is preserved.

## Architecture and imports
- [ ] `src/shared` does not import feature code.
- [ ] Imports use `@/` aliases, not deep relative paths.
- [ ] New feature code is placed under `src/features/<feature>/...`.

## RN UI and theming
- [ ] No raw colors/spacing/fonts in UI code.
- [ ] Styling uses theme tokens and `StyleSheet.create()`.
- [ ] Platform-specific behavior is handled where required.

## Data and state
- [ ] Server state uses React Query patterns from feature `api/keys.ts`.
- [ ] Mutations include targeted invalidation patterns.
- [ ] No server/domain data is moved into Zustand global stores.
- [ ] No direct `fetch` usage; transport/API layer is used.

## Tests
- [ ] Non-trivial behavior changes include tests.
- [ ] Missing tests are called out with exact suggested scenarios.
- [ ] Residual risk and untested paths are explicitly noted.
