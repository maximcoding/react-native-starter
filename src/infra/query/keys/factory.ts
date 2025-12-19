// 2025 — infra/query/keys/factory.ts
/**
 * GUIDELINE: Query Key Factory (NO implementation)
 * ------------------------------------------------------------------
 * FORMAT (STRICT)
 *   [feature, entity, id? , params?]
 *   Infinite pagination: [feature, entity, 'infinite', params]
 *
 * RULES
 *   - Keys are built ONLY via helpers (this factory or feature-level api/keys.ts)
 *   - Components MUST NOT assemble keys manually
 *   - Keys MUST be serializable and stable (no functions/instances)
 *
 * EXAMPLES (descriptive)
 *   ['user','byId', userId]
 *   ['user','list','infinite', { q, sort }]
 *   ['auth','me']
 */
// src/infra/query/keys/factory.ts
type KeyPart = string | number | boolean | null | undefined | Record<string, unknown>;

export function qk(...parts: KeyPart[]) {
  return parts.filter((p) => p !== undefined && p !== null) as (string | number | boolean | Record<string, unknown>)[];
}

// helpers
export const listKey = (feature: string, entity: string, params?: Record<string, unknown>) =>
  qk(feature, entity, 'list', params);

export const infiniteKey = (feature: string, entity: string, params?: Record<string, unknown>) =>
  qk(feature, entity, 'infinite', params);

export const byIdKey = (feature: string, entity: string, id: string | number) =>
  qk(feature, entity, 'byId', id);

