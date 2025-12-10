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
  code: string | null;   // machine code (e.g. "AUTH_INVALID", "NETWORK_OFFLINE")
  message: string;       // human-readable message
  status?: number;       // HTTP code (if present)
  raw: unknown;          // original error for debugging/logging
};

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

  // Firebase
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
 * Normalize ANY error shape to consistent NormalizedError.
 */
export function normalizeError(error: unknown): NormalizedError {
  // string thrown
  if (typeof error === 'string') {
    return {
      code: null,
      message: error,
      raw: error,
    };
  }

  // Native JS Error
  if (error instanceof Error) {
    const e: any = error;
    return {
      code: extractCode(e),
      message: extractMessage(e),
      status: extractStatus(e),
      raw: error,
    };
  }

  // Unknown object (common in axios + graphql errors)
  const e: any = error ?? {};

  return {
    code: extractCode(e),
    message: extractMessage(e),
    status: extractStatus(e),
    raw: error,
  };
}
