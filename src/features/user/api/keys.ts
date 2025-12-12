// 2025 — features/user/api/keys.ts (GUIDELINE)
// Keys:
//   ['user','byId', userId] → nearRealtime/reference (context-dependent)
//   ['user','list','infinite', params] → nearRealtime (pagination)
// Invalidate after mutations: detail + list keys that include edited user
export {};
