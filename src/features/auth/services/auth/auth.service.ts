// src/app/services/auth/auth.service.ts
/**
 * FILE: auth.service.ts
 * LAYER: app/services/auth
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   High-level domain service for authentication flows. Business logic
 *   lives here — never in screens or hooks.
 *
 * RESPONSIBILITIES:
 *   - Login user.
 *   - Handle offline login restrictions.
 *   - Store tokens (via key-value storage).
 *
 * DATA-FLOW:
 *   screen/hook
 *      → AuthService.login(credentials)
 *         → zLoginRequest.safeParse()
 *         → transport.mutate('auth/login')
 *         → zLoginResponse.parse(response)
 *         → AuthMapper.toAuthSession()
 *         → persist tokens
 *
 * OFFLINE BEHAVIOR:
 *   - Login cannot be queued (must be online).
 *   - If offline → error immediately.
 *
 * EXTENSION GUIDELINES:
 *   - Add logout, refresh, MFA, register, etc.
 * ---------------------------------------------------------------------
 */
import { transport } from '@/infra/transport/transport';
import { kvStorage } from '@/infra/storage/mmkv';
import {
  zLoginRequest,
  zLoginResponse,
  type LoginRequest,
} from './auth.schemas';
import { AuthMapper, type AuthSession } from './auth.mappers';
import { performLogout } from '@/core/session/logout';
import { isOffline } from '@/infra/network/netinfo';
import { constants, flags } from '@/core/config/constants';

import { OPS } from '@/infra/transport/operations';

export const AuthService = {
  async login(payload: LoginRequest): Promise<AuthSession> {
    const ok = zLoginRequest.safeParse(payload);
    if (!ok.success) {
      throw new Error('Invalid login payload');
    }

    // ✅ если MOCK — не трогаем сеть вообще
    if (!flags.USE_MOCK) {
      if (isOffline()) {
        const err: any = new Error('Offline: login requires network');
        err.code = 'NETWORK_OFFLINE';
        throw err;
      }
    }

    // ✅ Используем OPS (у тебя Operation = union из OPS)
    const raw = await transport.mutate<unknown>(OPS.AUTH_LOGIN, ok.data);

    const validated = zLoginResponse.parse(raw);
    const session = AuthMapper.toAuthSession(validated);

    // persist tokens under canonical keys (used by auth interceptor)
    kvStorage.setString(constants.AUTH_TOKEN, session.token);

    if (session.refreshToken) {
      kvStorage.setString(constants.REFRESH_TOKEN, session.refreshToken);
    }

    return session;
  },

  async logout() {
    kvStorage.delete(constants.AUTH_TOKEN);
    kvStorage.delete(constants.REFRESH_TOKEN);
    await performLogout();
  },
};