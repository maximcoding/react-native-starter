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
import { zLoginRequest, zLoginResponse, type LoginRequest } from './auth.schemas';
import { AuthMapper, type AuthSession } from './auth.mappers';

export interface LoginResponse {
}

export const AuthService = {
  async login(payload: LoginRequest): Promise<AuthSession> {
    const ok = zLoginRequest.safeParse(payload);
    if (!ok.success) {
      throw new Error('Invalid login payload');
    }

    const raw = await transport.mutate<LoginResponse>('auth/login', ok.data);

    const validated = zLoginResponse.parse(raw);
    const session = AuthMapper.toAuthSession(validated);

    kvStorage.setString('token', session.token);
    if (session.refreshToken) {
      kvStorage.setString('refreshToken', session.refreshToken);
    }

    return session;
  },

  logout() {
    kvStorage.delete('token');
    kvStorage.delete('refreshToken');
  },
};
