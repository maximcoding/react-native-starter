/**
 * FILE: index.ts
 * LAYER: app/services
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Provide a single entry-point to all domain services.
 *
 * RESPONSIBILITIES:
 *   - Centralize exports.
 *   - Make service usage explicit and organized.
 * ---------------------------------------------------------------------
 */
export * from './auth/auth.service';
export * from './user/user.service';
