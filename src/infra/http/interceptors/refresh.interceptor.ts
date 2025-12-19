// src/infra/http/interceptors/refresh.interceptor.ts
/**
 * FILE: refresh.interceptor.ts
 * LAYER: infra/http/interceptors
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Intercept 401 responses once, attempt token refresh (single-flight),
 *   then retry the original request with the new token.
 *
 * RESPONSIBILITIES:
 *   - Skip refresh for login/refresh endpoints to avoid loops.
 *   - Ensure only one refresh request is in-flight (queue others).
 *   - Persist new tokens using kvStorage + constants keys.
 *   - Respect offline mode (do not attempt refresh when offline).
 *
 * DATA-FLOW:
 *   axiosInstance.response
 *     → (401?) refresh.interceptor.ts
 *       → POST /auth/refresh { refreshToken }
 *         → kvStorage.set(AUTH_TOKEN, newToken)
 *         → retry original request with Authorization: Bearer <newToken>
 *     → error.interceptor.ts (normalize on failure)
 *
 * EXTENSION GUIDELINES:
 *   - Adjust endpoint/method/payload to match your backend.
 *   - Extend shouldSkipRefresh() if some routes must never trigger refresh.
 *   - Add jitter/backoff if your backend requires it.
 * ---------------------------------------------------------------------
 */
import type { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { kvStorage } from '@/infra/storage/mmkv';
import { constants } from '@/core/config/constants';
import { isOffline } from '@/infra/network/netinfo';

type RefreshResponse = {
  token: string;
  refreshToken?: string;
};

// Single-flight state
let isRefreshing = false;
let waitQueue: Array<(t: string | null) => void> = [];

function enqueue(cb: (t: string | null) => void) {
  waitQueue.push(cb);
}

function resolveQueue(newToken: string | null) {
  waitQueue.forEach(cb => cb(newToken));
  waitQueue = [];
}

async function doRefresh(instance: AxiosInstance): Promise<string | null> {
  if (isOffline()) return null;

  const refreshToken = kvStorage.getString(constants.REFRESH_TOKEN);
  if (!refreshToken) return null;

  try {
    // Adjust path/payload to your API
    const res = await instance.post<RefreshResponse>('/auth/refresh', {
      refreshToken,
    });
    const { token, refreshToken: nextRefresh } =
      res.data || ({} as RefreshResponse);

    if (!token) return null;

    kvStorage.setString(constants.AUTH_TOKEN, token);
    if (nextRefresh) kvStorage.setString(constants.REFRESH_TOKEN, nextRefresh);

    return token;
  } catch {
    return null;
  }
}

function shouldSkipRefresh(config?: AxiosRequestConfig) {
  const url = config?.url || '';
  // Avoid loops and explicit auth flows
  return url.includes('/auth/login') || url.includes('/auth/refresh');
}

export function attachRefreshTokenInterceptor(instance: AxiosInstance) {
  instance.interceptors.response.use(
    res => res,
    async (error: AxiosError) => {
      const status = error.response?.status;
      const original = error.config as
        | (AxiosRequestConfig & { _retry?: boolean })
        | undefined;

      // Not a 401, or no config, or already retried, or must skip — pass through
      if (
        status !== 401 ||
        !original ||
        original._retry === true ||
        shouldSkipRefresh(original)
      ) {
        return Promise.reject(error);
      }

      // Mark to prevent infinite loops
      original._retry = true;

      // If a refresh is already running, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          enqueue(newToken => {
            if (!newToken) return reject(error);
            original.headers = original.headers ?? {};
            (
              original.headers as Record<string, string>
            ).Authorization = `Bearer ${newToken}`;
            resolve(instance(original));
          });
        });
      }

      // Start refresh
      isRefreshing = true;
      const newToken = await doRefresh(instance).finally(() => {
        isRefreshing = false;
      });

      // Release queued requests
      resolveQueue(newToken);

      // If refresh failed, bubble up to error interceptor
      if (!newToken) return Promise.reject(error);

      // Retry original with fresh token
      original.headers = original.headers ?? {};
      (
        original.headers as Record<string, string>
      ).Authorization = `Bearer ${newToken}`;
      return instance(original);
    },
  );
}
