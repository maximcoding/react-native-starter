// src/features/user/hooks/useMeQuery.ts
/**
 * PURPOSE:
 *   Fetch current user profile ("me") with React Query.
 * POLICY:
 *   - Zod-validate response before entering cache.
 *   - nearRealtime freshness (staleTime ~60s).
 *   - Normalized errors only.
 */
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/infra/http/api';
import { normalizeError } from '@/infra/error/normalize-error';
import { userKeys } from '@/features/user/api/keys';
import { z } from 'zod';
import { Freshness } from '@/infra/query/policy/freshness.ts';

const MeSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string(),
  email: z.string().email().optional(),
  avatarUrl: z.string().url().optional(),
});
export type Me = z.infer<typeof MeSchema>;

export function useMeQuery() {
  return useQuery({
    queryKey: userKeys.me(),
    staleTime: Freshness.nearRealtime.staleTime,
    gcTime: Freshness.nearRealtime.gcTime,
    queryFn: async () => {
      try {
        const data = await apiGet('/me');
        return MeSchema.parse(data);
      } catch (e) {
        throw normalizeError(e);
      }
    },
  });
}
