/**
 * FILE: auth.interceptor.ts
 * LAYER: infra/http/interceptors
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Attach Authorization header to outgoing HTTP requests when a token
 *   is available (e.g. JWT, session token, API key).
 *
 * RESPONSIBILITIES:
 *   - Inject Bearer token into request headers.
 *   - Stay decoupled from concrete token storage (Keychain/MMKV/etc.).
 *
 * DATA-FLOW:
 *   service → transport (REST adapter) → axios.instance
 *      → auth.interceptor.ts (adds Authorization)
 *      → backend
 *
 * EXTENSION GUIDELINES:
 *   - Replace getToken implementation to read from secure storage.
 *   - Support refresh-tokens by pairing with a response interceptor.
 * ---------------------------------------------------------------------
 */
export function attachAuthInterceptor(instance: any, getToken?: () => string | null) {
  instance.interceptors.request.use((config: any) => {
    const token = getToken ? getToken() : null;
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}
