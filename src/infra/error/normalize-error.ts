// src/infra/error/normalize-error.ts
/**
 * FILE: normalize-error.ts
 * LAYER: infra/error
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Convert ANY error shape (Axios, GraphQL, Firebase, Zod, JS Error,
 *   network offline, or custom code) into a unified NormalizedError.
 *
 * WHY:
 *   - UI and services must never guess error structure.
 *   - Prevent "cannot read property 'message'" crashes.
 *   - Provide stable error.code, error.message, error.status for all layers.
 *
 * RESPONSIBILITIES:
 *   - Map unknown → NormalizedError.
 *   - Extract best-possible message for user-facing errors.
 *   - Preserve raw for logging/analytics.
 *
 * SUPPORTED SOURCES:
 *   - AxiosError
 *   - GraphQL error arrays
 *   - FirebaseError
 *   - ZodError
 *   - Network offline errors
 *   - Native JS Error
 *
 * EXTENSION:
 *   - Add backend/business-level mapping: map code → domain codes.
 *   - Add translations: map code → localized messages.
 *   - Add telemetry hooks: log normalized errors to Sentry/Datadog.
 * ---------------------------------------------------------------------
 */

export type NormalizedError = {
  code: string | null; // machine code (e.g. "AUTH_INVALID", "NETWORK_OFFLINE")
  message: string; // human-readable message
  status?: number; // HTTP code (if present)
  raw: unknown; // original error for debugging/logging
};

/**
 * Guard: check if a value already matches the NormalizedError shape.
 * This makes normalizeError() idempotent (safe to call multiple times).
 */
function isNormalizedError(x: any): x is NormalizedError {
  return (
    x &&
    typeof x === 'object' &&
    typeof x.message === 'string' &&
    'raw' in x &&
    'code' in x
  );
}

/**
 * Extract human-readable message from different possible shapes.
 */
function extractMessage(e: any): string {
  // GraphQL
  if (Array.isArray(e?.graphQLErrors) && e.graphQLErrors.length > 0) {
    return e.graphQLErrors[0].message ?? 'GraphQL error';
  }

  // Axios
  if (e?.response?.data?.message) return e.response.data.message;
  if (e?.response?.data?.error) return e.response.data.error;

  // Zod
  if (e?.errors && Array.isArray(e.errors)) {
    return e.errors.map((z: any) => z.message).join(', ');
  }

  // Firebase / JS Error
  if (e?.message && typeof e.message === 'string') return e.message;

  // Fallback
  return e?.message ?? 'Unknown error';
}

/**
 * Extract machine-readable error code if available.
 */
function extractCode(e: any): string | null {
  return (
    e?.code ??
    e?.response?.data?.code ??
    e?.graphQLErrors?.[0]?.extensions?.code ??
    null
  );
}

/**
 * Extract HTTP status code when applicable.
 */
function extractStatus(e: any): number | undefined {
  return e?.response?.status;
}

/**
 * Detect offline / no-internet type errors across different sources.
 * This is intentionally conservative and can be expanded later.
 */
function isOfflineErrorLike(e: any): boolean {
  const code = e?.code;
  const msg = typeof e?.message === 'string' ? e.message : '';

  // Our own explicit code
  if (code === 'NETWORK_OFFLINE') return true;

  // Transport offline error message (your transport throws this)
  if (msg.startsWith('Offline:')) return true;

  // Common network messages (axios/fetch)
  if (msg === 'Network Error' || msg === 'Failed to fetch') return true;

  // Axios: no response usually means network-level failure
  if (e?.isAxiosError && !e?.response) return true;

  return false;
}

/**
 * Normalize ANY error shape to consistent NormalizedError.
 */
export function normalizeError(error: unknown): NormalizedError {
  // ✅ Idempotent: if already normalized, keep as-is
  if (isNormalizedError(error)) return error;

  // string thrown
  if (typeof error === 'string') {
    const offline = error.startsWith('Offline:') || error === 'Offline';
    return {
      code: offline ? 'NETWORK_OFFLINE' : null,
      message: offline ? 'No internet connection' : error,
      raw: error,
    };
  }

  // Native JS Error (also covers many library errors)
  if (error instanceof Error) {
    const e: any = error;

    // OFFLINE detection has priority
    if (isOfflineErrorLike(e)) {
      return {
        code: 'NETWORK_OFFLINE',
        message: 'No internet connection',
        raw: error,
      };
    }

    return {
      code: extractCode(e),
      message: extractMessage(e),
      status: extractStatus(e),
      raw: error,
    };
  }

  // Unknown object (common in axios + graphql errors)
  const e: any = error ?? {};

  // OFFLINE detection for non-Error shapes
  if (isOfflineErrorLike(e)) {
    return {
      code: 'NETWORK_OFFLINE',
      message: 'No internet connection',
      raw: error,
    };
  }

  return {
    code: extractCode(e),
    message: extractMessage(e),
    status: extractStatus(e),
    raw: error,
  };
}
