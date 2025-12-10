/**
 * FILE: user.service.ts
 * LAYER: app/services/user
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Domain service for user-related queries / mutations.
 *
 * RESPONSIBILITIES:
 *   - Fetch user profile.
 *   - (Future) Update profile, preferences, settings, roles.
 *
 * DATA-FLOW:
 *   screen/hook
 *      → UserService.getProfile(userId)
 *         → transport.query('user/profile', { userId })
 *         → zUserProfile.parse()
 *         → UserMapper.toUserModel()
 *
 * OFFLINE BEHAVIOR:
 *   - Queries fail gracefully when offline.
 *   - Mutations can be queued automatically by transport.
 *
 * EXTENSION GUIDELINES:
 *   - Add caching layer (cacheEngine).
 *   - Add optimistic updates for profile changes.
 * ---------------------------------------------------------------------
 */
import { transport } from '@/infra/transport/transport';
import { zUserProfile } from './user.schemas';
import { UserMapper, type UserModel } from './user.mappers';

export const UserService = {
  async getProfile(userId: string): Promise<UserModel> {
    const raw = await transport.query('user/profile', { userId });
    const validated = zUserProfile.parse(raw);
    return UserMapper.toUserModel(validated);
  },
};
