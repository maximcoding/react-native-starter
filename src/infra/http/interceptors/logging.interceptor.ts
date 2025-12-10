/**
 * FILE: logging.interceptor.ts
 * LAYER: infra/http/interceptors
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Provide basic dev-time logging for HTTP requests/responses to help
 *   debug networking issues during development.
 *
 * RESPONSIBILITIES:
 *   - Log outgoing requests (method + URL + params/body).
 *   - Log responses (status + URL).
 *   - Log errors in dev mode.
 *
 * DATA-FLOW:
 *   axiosInstance.request
 *      → logging.interceptor.ts (logs request)
 *      → backend
 *      → logging.interceptor.ts (logs response or error)
 *
 * EXTENSION GUIDELINES:
 *   - Disable logs in production.
 *   - Integrate with app-level logging/analytics if needed.
 * ---------------------------------------------------------------------
 */
export function attachLoggingInterceptor(instance: any) {
  if (__DEV__ !== true) {
    return;
  }

  instance.interceptors.request.use((config: any) => {
    // eslint-disable-next-line no-console
    console.log('[HTTP][REQUEST]', config.method?.toUpperCase(), config.url, config.params ?? config.data);
    return config;
  });

  instance.interceptors.response.use(
    (response: any) => {
      // eslint-disable-next-line no-console
      console.log('[HTTP][RESPONSE]', response.status, response.config.url);
      return response;
    },
    (error: any) => {
      // eslint-disable-next-line no-console
      console.log('[HTTP][ERROR]', error);
      throw error;
    },
  );
}
