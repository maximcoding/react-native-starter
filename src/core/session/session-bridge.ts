// src/core/session/session-bridge.ts
import type { QueryClient } from '@tanstack/react-query';

let _qc: QueryClient | null = null;

/**
 * Set once at app startup (App.tsx).
 * Allows non-React code (interceptors, services) to access QueryClient.
 */
export function setSessionQueryClient(qc: QueryClient) {
  _qc = qc;
}

/** Read-only getter (may be null before App init). */
export function getSessionQueryClient(): QueryClient | null {
  return _qc;
}

/** Optional helper for tests / teardown. */
export function clearSessionQueryClient() {
  _qc = null;
}
