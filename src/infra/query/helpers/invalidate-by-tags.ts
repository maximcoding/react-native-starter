// src/infra/query/helpers/invalidate-by-tags.ts
import { QueryClient } from '@tanstack/react-query';
import type { Tag, TagMap } from '@/infra/query/tags';

/**
 * Invalidate React Query keys by logical tags.
 * Usage:
 *   await invalidateByTags(qc, ['user:me','user:list'], [authKeys.tagMap, userKeys.tagMap])
 */
export async function invalidateByTags(
  qc: QueryClient,
  tags: readonly Tag[],
  maps: readonly TagMap[],
) {
  if (!tags?.length || !maps?.length) return;

  const keys: (readonly unknown[])[] = [];

  for (const tag of tags) {
    for (const map of maps) {
      const getters = map[tag];
      if (!getters || getters.length === 0) continue;

      for (const getKey of getters) {
        try {
          const key = getKey();
          if (Array.isArray(key)) keys.push(key);
        } catch {
          // ignore invalid key getter
        }
      }
    }
  }

  // de-dupe by JSON signature and invalidate
  const seen = new Set<string>();
  await Promise.all(
    keys.map(key => {
      const sig = JSON.stringify(key);
      if (seen.has(sig)) return Promise.resolve();
      seen.add(sig);
      return qc.invalidateQueries({ queryKey: key as any });
    }),
  );
}
