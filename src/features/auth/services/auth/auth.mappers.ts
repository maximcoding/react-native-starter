/**
 * FILE: auth.mappers.ts
 * LAYER: app/services/auth
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Convert raw validated DTOs (from API) into domain-friendly models,
 *   ensuring UI never sees transport-level shapes.
 *
 * RESPONSIBILITIES:
 *   - Map LoginResponse → AuthSession model.
 *   - Normalize missing/optional fields.
 *
 * DATA-FLOW:
 *   validated DTO (auth.schemas)
 *      → AuthMapper.toAuthSession()
 *         → domain model
 *         → UI / stores / service consumers
 *
 * EXTENSION GUIDELINES:
 *   - Add mappers for registration, MFA, profile update, etc.
 * ---------------------------------------------------------------------
 */
import type { LoginResponse } from './auth.schemas';

export type AuthSession = {
  token: string;
  refreshToken?: string;
  userId: string;
  email: string;
};

export const AuthMapper = {
  toAuthSession(dto: LoginResponse): AuthSession {
    return {
      token: dto.accessToken,
      refreshToken: dto.refreshToken,
      userId: dto.user.id,
      email: dto.user.email,
    };
  },
};
