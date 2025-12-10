/**
 * FILE: auth.schemas.ts
 * LAYER: app/services/auth
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Zod schemas for validating all Auth-related API responses and request
 *   payloads. Ensures domain correctness before data enters the app.
 *
 * RESPONSIBILITIES:
 *   - Validate login request.
 *   - Validate login response.
 *   - Validate refresh-token response.
 *
 * DATA-FLOW:
 *   AuthService.login()
 *      → zLoginRequest.safeParse()
 *      → transport.mutate('auth/login')
 *      → zLoginResponse.parse(response)
 *      → AuthMapper.toAuthSession(...)
 *
 * EXTENSION GUIDELINES:
 *   - Add schemas for registration, reset-password, MFA, etc.
 * ---------------------------------------------------------------------
 */
import { z } from 'zod';

export const zLoginRequest = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const zLoginResponse = z.object({
  accessToken: z.string(),
  refreshToken: z.string().optional(),
  user: z.object({
    id: z.string(),
    email: z.string().email(),
  }),
});

export type LoginRequest = z.infer<typeof zLoginRequest>;
export type LoginResponse = z.infer<typeof zLoginResponse>;
