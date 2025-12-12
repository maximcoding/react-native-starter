// 2025 — infra/query/client/provider.tsx
/**
 * GUIDELINE: Query Provider Wrapping (NO implementation)
 * ------------------------------------------------------------------
 * ORDER OF PROVIDERS
 *   I18nProvider -> ThemeProvider -> **QueryProvider** -> NavigationContainer
 *
 * RESPONSIBILITIES
 *   - Provide app-wide QueryClient instance.
 *   - Hook persistence (MMKV) before mounting navigation.
 *   - Subscribe to NetInfo (netmode) to update networkMode.
 *
 * CHECKLIST
 *   [ ] Wrap App root with QueryProvider
 *   [ ] Connect persistence/mmkv-persister.ts
 *   [ ] Bridge netinfo → networkMode
 *   [ ] Ensure ErrorBoundary for UI crashes
 */
export {};
