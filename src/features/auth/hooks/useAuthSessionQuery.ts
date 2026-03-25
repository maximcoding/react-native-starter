import { useQuery } from '@tanstack/react-query'
import { authKeys } from '@/features/auth/api/keys'
import { zSessionResponse } from '@/features/auth/services/auth/auth.schemas'
import { Freshness } from '@/shared/services/api/query/policy/freshness'
import { OPS } from '@/shared/services/api/transport/operations'
import { transport } from '@/shared/services/api/transport/transport'
import { normalizeError } from '@/shared/utils/normalize-error'

export function useAuthSessionQuery() {
  return useQuery({
    queryKey: authKeys.session(),
    staleTime: Freshness.nearRealtime.staleTime,
    gcTime: Freshness.nearRealtime.gcTime,
    queryFn: async () => {
      try {
        const data = await transport.query(OPS.AUTH_SESSION)
        return zSessionResponse.parse(data)
      } catch (e) {
        throw normalizeError(e)
      }
    },
  })
}
