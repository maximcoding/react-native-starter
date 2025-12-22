import { useQuery } from '@tanstack/react-query';
import { transport } from '@/infra/transport/transport';
import { normalizeError } from '@/infra/error/normalize-error';
import { authKeys } from '@/features/auth/api/keys';
import { Freshness } from '@/infra/query/policy/freshness';
import { z } from 'zod';

const SessionSchema = z.object({
  userId: z.string().or(z.number()),
  email: z.string().email().optional(),
});

export type AuthSessionDto = z.infer<typeof SessionSchema>;

export function useAuthSessionQuery() {
  return useQuery({
    queryKey: authKeys.session(),
    staleTime: Freshness.nearRealtime.staleTime,
    gcTime: Freshness.nearRealtime.gcTime,
    queryFn: async () => {
      try {
        const data = await transport.query('auth.session');
        return SessionSchema.parse(data);
      } catch (e) {
        throw normalizeError(e);
      }
    },
  });
}
