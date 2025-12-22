import type { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { kvStorage } from '@/infra/storage/mmkv';
import { constants } from '@/core/config/constants';
import { isOffline } from '@/infra/network/netinfo';
import { performLogout } from '@/core/session/logout';
import { getSessionQueryClient } from '@/core/session/session-bridge';

type RefreshResponse = {
  token: string;
  refreshToken?: string;
};

// Single-flight state
let isRefreshing = false;
let waitQueue: Array<(t: string | null) => void> = [];
let logoutPromise: Promise<void> | null = null;

function enqueue(cb: (t: string | null) => void) {
  waitQueue.push(cb);
}

function resolveQueue(newToken: string | null) {
  for (const cb of waitQueue) cb(newToken);
  waitQueue = [];
}

async function logoutOnce() {
  if (!logoutPromise) {
    const qc = getSessionQueryClient() ?? undefined;
    logoutPromise = performLogout(qc).finally(() => {
      logoutPromise = null;
    });
  }
  await logoutPromise;
}

async function doRefresh(instance: AxiosInstance): Promise<string | null> {
  if (isOffline()) return null;

  const refreshToken = kvStorage.getString(constants.REFRESH_TOKEN);
  if (!refreshToken) return null;

  try {
    // IMPORTANT:
    // - x-skip-auth: do not attach Bearer <expired>
    // - x-skip-refresh: do not attempt refresh recursion
    const res = await instance.post<RefreshResponse>(
      '/auth/refresh',
      { refreshToken },
      { headers: { 'x-skip-auth': '1', 'x-skip-refresh': '1' } as any },
    );

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
  const skipFlag = (config?.headers as any)?.['x-skip-refresh'] === '1';

  return (
    skipFlag || url.includes('/auth/login') || url.includes('/auth/refresh')
  );
}

export function attachRefreshTokenInterceptor(instance: AxiosInstance) {
  instance.interceptors.response.use(
    res => res,
    async (error: AxiosError) => {
      const status = error.response?.status;
      const original = error.config as
        | (AxiosRequestConfig & { _retry?: boolean })
        | undefined;

      // Only handle 401
      if (status !== 401 || !original) {
        return Promise.reject(error);
      }

      // prevent loops
      if (original._retry === true || shouldSkipRefresh(original)) {
        return Promise.reject(error);
      }
      original._retry = true;

      // If refresh already running, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          enqueue(newToken => {
            if (!newToken) return reject(error);
            original.headers = original.headers ?? {};
            (original.headers as any).Authorization = `Bearer ${newToken}`;
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

      // Refresh failed -> logout once
      if (!newToken) {
        await logoutOnce();
        return Promise.reject(error);
      }

      // Retry original with fresh token
      original.headers = original.headers ?? {};
      (original.headers as any).Authorization = `Bearer ${newToken}`;
      return instance(original);
    },
  );
}
