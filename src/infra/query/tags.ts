// src/infra/query/tags.ts
/**
 * FILE: tags.ts
 * LAYER: infra/query
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Single source of truth for:
 *   - Tag type
 *   - TagMap type (tag -> queryKey getters)
 *
 * NOTES:
 *   - Query keys in TanStack are readonly unknown[] (QueryKey).
 *   - We keep getters returning readonly arrays.
 * ---------------------------------------------------------------------
 */

export type Tag = string;
export type KeyGetter = () => readonly unknown[];
export type TagMap = Record<Tag, ReadonlyArray<KeyGetter>>;
