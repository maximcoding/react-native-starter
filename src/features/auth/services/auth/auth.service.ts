/**
 * Domain service for authentication — business logic stays out of screens/hooks.
 * Path: `src/features/auth/services/auth/`
 */

import { constants, flags } from '@/config/constants'
import type { AuthSession } from '@/features/auth/types'
import { performLogout } from '@/session/logout'
import { isOffline } from '@/shared/services/api/network/netinfo'
import { OPS } from '@/shared/services/api/transport/operations'
import { transport } from '@/shared/services/api/transport/transport'
import { kvStorage } from '@/shared/services/storage/mmkv'
import { normalizeError } from '@/shared/utils/normalize-error'
import { AuthMapper } from './auth.mappers'
import {
  type LoginRequest,
  zLoginRequest,
  zLoginResponse,
} from './auth.schemas'

export const AuthService = {
  async login(payload: LoginRequest): Promise<AuthSession> {
    const ok = zLoginRequest.safeParse(payload)
    if (!ok.success) {
      const message =
        ok.error.issues.map(i => i.message).join('; ') || 'Invalid login'
      throw normalizeError(new Error(message))
    }

    // skip network check when mock transport is active
    if (!flags.USE_MOCK && isOffline()) {
      throw new Error('Offline: login requires network')
    }

    // use OPS (Operation = union of OPS)
    const raw = await transport.mutate<unknown>(OPS.AUTH_LOGIN, ok.data)

    const validated = zLoginResponse.parse(raw)
    const session = AuthMapper.toAuthSession(validated)

    // persist tokens under canonical keys (used by auth interceptor)
    kvStorage.setString(constants.AUTH_TOKEN, session.token)

    if (session.refreshToken) {
      kvStorage.setString(constants.REFRESH_TOKEN, session.refreshToken)
    }

    return session
  },

  async logout() {
    kvStorage.delete(constants.AUTH_TOKEN)
    kvStorage.delete(constants.REFRESH_TOKEN)
    await performLogout()
  },
}
