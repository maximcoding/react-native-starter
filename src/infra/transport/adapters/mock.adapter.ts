// src/infra/transport/adapters/mock.adapter.ts
/**
 * FILE: mock.adapter.ts
 * LAYER: infra/transport/adapters
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Mock Transport adapter for development without backend.
 *
 * FEATURES:
 *   - Implements OPS.AUTH_LOGIN / OPS.AUTH_REFRESH
 *   - Implements OPS.USER_ME / OPS.USER_UPDATE_PROFILE
 *   - Allows app to work + test offline queue + replay flow
 * ---------------------------------------------------------------------
 */

import type { Transport } from '@/infra/transport/transport.types';
import { OPS, type Operation } from '@/infra/transport/operations';
import { kvStorage } from '@/infra/storage/mmkv';
import { constants } from '@/core/config/constants';

type User = {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
};

type LoginPayload = { email: string; password: string };
type LoginResponse = {
  accessToken: string;
  refreshToken?: string;
  user: { id: string; email: string };
};

type RefreshPayload = { refreshToken: string };
type RefreshResponse = { token: string; refreshToken?: string };

// in-memory fake DB
let dbUser: User = {
  id: 'u_1',
  name: 'Test User',
  email: 'test@example.com',
  avatarUrl: undefined,
};

function sleep(ms: number) {
  return new Promise<void>(r => setTimeout(r, ms));
}

function requireAuth() {
  const t = kvStorage.getString(constants.AUTH_TOKEN);
  if (!t) {
    const err: any = new Error('Unauthorized');
    err.code = 'AUTH_UNAUTHORIZED';
    err.status = 401;
    throw err;
  }
}

export const mockAdapter: Transport = {
  async query<TResponse = unknown, TVariables = unknown>(
    operation: Operation,
    _variables?: TVariables,
  ): Promise<TResponse> {
    await sleep(150);

    switch (operation) {
      case OPS.USER_ME: {
        requireAuth();
        return dbUser as any as TResponse;
      }

      default: {
        const err: any = new Error(`Mock: unknown query op "${operation}"`);
        err.code = 'MOCK_UNKNOWN_OPERATION';
        err.status = 400;
        throw err;
      }
    }
  },

  async mutate<TResponse = unknown, TVariables = unknown>(
    operation: Operation,
    variables?: TVariables,
  ): Promise<TResponse> {
    await sleep(200);

    switch (operation) {
      case OPS.AUTH_LOGIN: {
        const p = (variables ?? {}) as any as LoginPayload;

        // super simple mock validation
        if (!p.email || !p.password) {
          const err: any = new Error('Invalid login payload');
          err.code = 'AUTH_INVALID_PAYLOAD';
          err.status = 400;
          throw err;
        }

        // issue fake tokens (service will store them too, but keep adapter usable)
        const accessToken = `mock_access_${Date.now()}`;
        const refreshToken = `mock_refresh_${Date.now()}`;

        // store so USER_ME works even if service doesn’t store (safety)
        kvStorage.setString(constants.AUTH_TOKEN, accessToken);
        kvStorage.setString(constants.REFRESH_TOKEN, refreshToken);

        const res: LoginResponse = {
          accessToken,
          refreshToken,
          user: { id: dbUser.id, email: p.email },
        };
        return res as any as TResponse;
      }

      case OPS.AUTH_REFRESH: {
        const p = (variables ?? {}) as any as RefreshPayload;

        if (!p.refreshToken) {
          const err: any = new Error('No refresh token');
          err.code = 'AUTH_NO_REFRESH';
          err.status = 401;
          throw err;
        }

        const token = `mock_access_${Date.now()}`;
        kvStorage.setString(constants.AUTH_TOKEN, token);

        const res: RefreshResponse = { token };
        return res as any as TResponse;
      }

      case OPS.USER_UPDATE_PROFILE: {
        requireAuth();

        const patch = (variables ?? {}) as Partial<User>;
        dbUser = {
          ...dbUser,
          ...patch,
        };

        // typical REST update might return updated entity
        return dbUser as any as TResponse;
      }

      default: {
        const err: any = new Error(`Mock: unknown mutate op "${operation}"`);
        err.code = 'MOCK_UNKNOWN_OPERATION';
        err.status = 400;
        throw err;
      }
    }
  },

  subscribe() {
    // no-op for mock
    return () => {};
  },

  async upload<TResponse = unknown>(operation: Operation): Promise<TResponse> {
    const err: any = new Error(
      `Mock: upload not implemented for "${operation}"`,
    );
    err.code = 'MOCK_UPLOAD_NOT_IMPLEMENTED';
    err.status = 400;
    throw err;
  },
};
