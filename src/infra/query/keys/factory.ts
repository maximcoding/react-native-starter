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
export {};
