// src/infra/http/interceptors/logging.interceptor.ts
/**
 * FILE: logging.interceptor.ts
 * LAYER: infra/http/interceptors
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Dev-time HTTP logging without leaking secrets.
 *
 * RESPONSIBILITIES:
 *   - Log outgoing requests (method, URL, masked params/body/headers).
 *   - Log responses (status, URL, elapsed ms).
 *   - Log errors (status, URL, elapsed ms, masked payload).
 *   - Redact sensitive fields: Authorization, *token*, *password*, *secret*.
 *
 * NOTES:
 *   - Disabled in production (__DEV__ check).
 *   - Minimal overhead; shallow masking + small recursion depth.
 * ---------------------------------------------------------------------
 */

type AnyObj = Record<string, any> | undefined | null;

const SENSITIVE_KEYS = new Set([
  'authorization',
  'auth',
  'token',
  'accessToken',
  'refreshToken',
  'password',
  'secret',
  'apiKey',
]);

const SENSITIVE_REGEX =
  /(authorization|auth|token|password|secret|api[-_]?key)/i;

/** Masks a string value (Bearer tokens, long strings) */
function maskString(v: string): string {
  if (!v) return v;
  // Mask common Bearer token format
  if (/^Bearer\s+/i.test(v)) return 'Bearer *** (masked)';
  // For long strings, keep prefix
  if (v.length > 16) return `${v.slice(0, 8)}…(masked)`;
  return '***';
}

/** Redact headers shallowly */
function maskHeaders(h: AnyObj): AnyObj {
  if (!h || typeof h !== 'object') return h;
  const out: Record<string, any> = {};
  for (const k of Object.keys(h)) {
    const keyLower = k.toLowerCase();
    const val = (h as any)[k];
    if (SENSITIVE_KEYS.has(keyLower) || SENSITIVE_REGEX.test(k)) {
      out[k] = typeof val === 'string' ? maskString(val) : '***';
    } else {
      out[k] = val;
    }
  }
  return out;
}

/** Redact nested objects up to a small depth */
function maskData<T = unknown>(data: T, depth = 2): T {
  if (depth < 0) return data;
  if (data == null) return data;
  if (typeof data === 'string') return maskString(data) as any as T;
  if (typeof data !== 'object') return data;

  if (Array.isArray(data)) {
    return data.map(v => maskData(v, depth - 1)) as any as T;
  }

  const src = data as Record<string, any>;
  const out: Record<string, any> = {};
  for (const k of Object.keys(src)) {
    if (SENSITIVE_KEYS.has(k.toLowerCase()) || SENSITIVE_REGEX.test(k)) {
      const v = src[k];
      out[k] = typeof v === 'string' ? maskString(v) : '***';
    } else {
      out[k] = maskData(src[k], depth - 1);
    }
  }
  return out as any as T;
}

// attach a timestamp to measure simple duration
function stampStart(config: any) {
  try {
    (config as any).__ts = Date.now();
  } catch {
    // ignore
  }
  return config;
}

function elapsed(configOrError: any): string | undefined {
  try {
    const start = configOrError?.config?.__ts ?? configOrError?.__ts;
    if (typeof start === 'number') {
      const ms = Date.now() - start;
      return `${ms}ms`;
    }
  } catch {
    // ignore
  }
  return undefined;
}

export function attachLoggingInterceptor(instance: any) {
  if (__DEV__ !== true) return;

  instance.interceptors.request.use((config: any) => {
    stampStart(config);
    // eslint-disable-next-line no-console
    console.log(
      '[HTTP][REQUEST]',
      (config.method || '').toUpperCase(),
      config.url,
      {
        params: maskData(config.params),
        data: maskData(config.data),
        headers: maskHeaders(config.headers),
      },
    );
    return config;
  });

  instance.interceptors.response.use(
    (response: any) => {
      // eslint-disable-next-line no-console
      console.log(
        '[HTTP][RESPONSE]',
        response.status,
        response.config?.url,
        elapsed(response),
      );
      return response;
    },
    (error: any) => {
      const status = error?.response?.status;
      const url = error?.config?.url;
      // Keep error payloads small & masked
      const safeData =
        typeof error?.response?.data === 'string'
          ? maskString(error.response.data).slice(0, 200)
          : maskData(error?.response?.data);

      // eslint-disable-next-line no-console
      console.log('[HTTP][ERROR]', status, url, elapsed(error), {
        data: safeData,
        headers: maskHeaders(error?.response?.headers),
      });

      // Re-throw to let error interceptor normalize it
      throw error;
    },
  );
}