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

import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { kvStorage } from '@/infra/storage/mmkv';
import { constants } from '@/core/config/constants';

function shouldSkipAuth(config: InternalAxiosRequestConfig) {
  const url = config.url || '';
  const skipFlag = (config.headers as any)?.['x-skip-auth'] === '1';

  // не добавляем Authorization там, где точно не нужно
  return (
    skipFlag || url.includes('/auth/login') || url.includes('/auth/refresh')
  );
}

export function attachAuthInterceptor(
  instance: AxiosInstance,
  getToken?: () => string | null,
) {
  instance.interceptors.request.use(config => {
    const cfg = config as InternalAxiosRequestConfig;

    if (shouldSkipAuth(cfg)) return cfg;

    // Prefer provided getter; fallback to MMKV
    let token = getToken ? getToken() : null;
    if (!token) token = kvStorage.getString(constants.AUTH_TOKEN);

    if (token) {
      cfg.headers = cfg.headers ?? {};
      (cfg.headers as any).Authorization = `Bearer ${token}`;
    }

    return cfg;
  });
}