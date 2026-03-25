// src/features/auth/hooks/useLoginMutation.ts

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authKeys } from '@/features/auth/api/keys'
import type { LoginRequest } from '@/features/auth/services/auth/auth.schemas'
import { AuthService } from '@/features/auth/services/auth/auth.service'
import { userKeys } from '@/features/user/api/keys'
import { SESSION_RELATED_QUERY_TAGS } from '@/shared/constants'
import { invalidateByTags } from '@/shared/services/api/query/helpers/invalidate-by-tags'
import { normalizeError } from '@/shared/utils/normalize-error'

export function useLoginMutation() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (payload: LoginRequest) => {
      try {
        return await AuthService.login(payload)
      } catch (e) {
        throw normalizeError(e)
      }
    },
    onSuccess: async () => {
      await invalidateByTags(qc, SESSION_RELATED_QUERY_TAGS, [
        authKeys.tagMap,
        userKeys.tagMap,
      ])
    },
  })
}
