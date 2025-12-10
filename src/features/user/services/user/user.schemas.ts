/**
 * FILE: user.schemas.ts
 * LAYER: app/services/user
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Validation schemas for user-related operations.
 *
 * RESPONSIBILITIES:
 *   - Ensure profile objects are correct.
 *   - Validate update payloads.
 *
 * DATA-FLOW:
 *   UserService.getProfile()
 *      → transport.query()
 *      → zUserProfile.parse()
 *      → UserMapper.toUserModel()
 *
 * EXTENSION GUIDELINES:
 *   - Add more sections (settings, preferences, roles, etc.).
 * ---------------------------------------------------------------------
 */
import { z } from 'zod';

export const zUserProfile = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().nullable(),
  avatar: z.string().url().nullable(),
});

export type UserProfileDTO = z.infer<typeof zUserProfile>;
