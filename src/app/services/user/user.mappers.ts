/**
 * FILE: user.mappers.ts
 * LAYER: app/services/user
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Transform validated DTOs into domain-friendly User model.
 *
 * RESPONSIBILITIES:
 *   - UserProfileDTO → UserModel
 *
 * DATA-FLOW:
 *   validated DTO (user.schemas)
 *      → UserMapper.toUserModel()
 *         → domain model for UI/services/stores
 *
 * EXTENSION GUIDELINES:
 *   - Add mapping for roles, preferences, settings, etc.
 * ---------------------------------------------------------------------
 */
import type { UserProfileDTO } from './user.schemas';

export type UserModel = {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
};

export const UserMapper = {
  toUserModel(dto: UserProfileDTO): UserModel {
    return {
      id: dto.id,
      email: dto.email,
      name: dto.name,
      avatar: dto.avatar,
    };
  },
};
