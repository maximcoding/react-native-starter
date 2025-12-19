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
import { isOffline } from '@/infra/network/netinfo'; // ← ADD
import { constants } from '@/core/config/constants'; // ← ADD

export interface LoginResponse {}

export const AuthService = {
  async login(payload: LoginRequest): Promise<AuthSession> {
    const ok = zLoginRequest.safeParse(payload);
    if (!ok.success) {
      throw new Error('Invalid login payload');
    }

    // DO NOT queue login while offline
    if (isOffline()) {
      throw new Error('Offline: login requires network');
    }

    const raw = await transport.mutate<LoginResponse>('auth/login', ok.data);

    const validated = zLoginResponse.parse(raw);
    const session = AuthMapper.toAuthSession(validated);

    // persist tokens under canonical keys (used by auth interceptor)
    kvStorage.setString(constants.AUTH_TOKEN, session.token);
    // set on login
    if (session.refreshToken) {
      kvStorage.setString(constants.REFRESH_TOKEN, session.refreshToken);
    }

    return session;
  },

  async logout() {
    // remove tokens first
    kvStorage.delete(constants.AUTH_TOKEN);
    kvStorage.delete(constants.REFRESH_TOKEN);
    // then reset app state & navigate to ROOT_AUTH
    await performLogout();
  },
};
