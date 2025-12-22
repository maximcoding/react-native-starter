// src/infra/transport/operations.ts
/**
 * Central registry of transport operations.
 * Use OPS.* everywhere instead of raw strings.
 */
export const OPS = Object.freeze({
  AUTH_LOGIN: 'auth.login',
  AUTH_REFRESH: 'auth.refresh',
  USER_ME: 'user.me',
  USER_UPDATE_PROFILE: 'user.updateProfile',
} as const);

export type Operation = (typeof OPS)[keyof typeof OPS];
