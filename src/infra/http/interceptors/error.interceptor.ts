/**
 * FILE: error.interceptor.ts
 * LAYER: infra/http/interceptors
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Normalize all HTTP/transport errors into a unified NormalizedError
 *   shape so that services and UI don't need to know about Axios internals.
 *
 * RESPONSIBILITIES:
 *   - Catch response errors from axiosInstance.
 *   - Convert them via normalizeError.
 *   - Reject promise with NormalizedError.
 *
 * DATA-FLOW:
 *   axiosInstance.request
 *      → backend
 *      → error
 *         → error.interceptor.ts
 *            → normalizeError(...)
 *               → Promise.reject(NormalizedError)
 *      → adapter / services receive NormalizedError.
 * ---------------------------------------------------------------------
 */
import { normalizeError } from '@/infra/error/normalize-error';

export function attachErrorInterceptor(instance: any) {
  instance.interceptors.response.use(
    (response: any) => response,
    (error: any) => {
      const normalized = normalizeError(error);
      return Promise.reject(normalized);
    },
  );
}
