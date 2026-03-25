// src/features/user/hooks/useUpdateProfile.ts
/**
 * PURPOSE:
 *   Update current user ("me") and invalidate related caches.
 * POLICY:
 *   - Validate input with Zod.
 *   - Offline-first: MUST go through transport.mutate (so queue works).
 *   - If operation was queued (offline), DO NOT invalidate now.
 *     Sync-engine will replay and invalidate by tags.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { USER_PROFILE_TAGS, userKeys } from '@/features/user/api/keys'
import { invalidateByTags } from '@/shared/services/api/query/helpers/invalidate-by-tags'
import { OPS } from '@/shared/services/api/transport/operations'
import { transport } from '@/shared/services/api/transport/transport'

const UpdateProfileInput = z
  .object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    avatarUrl: z.string().url().optional(),
  })
  .refine(v => Object.keys(v).length > 0, {
    message: 'At least one field required',
  })

export type UpdateProfileInput = z.infer<typeof UpdateProfileInput>

type TransportResult = { offline?: boolean; queued?: boolean } | unknown

export function useUpdateProfile() {
  const qc = useQueryClient()

  return useMutation({
    mutationKey: ['user', 'updateProfile'],

    mutationFn: async (payload: UpdateProfileInput) => {
      const parsed = UpdateProfileInput.parse(payload)

      return transport.mutate(OPS.USER_UPDATE_PROFILE, parsed, {
        tags: USER_PROFILE_TAGS,
      }) as Promise<TransportResult>
    },

    onSuccess: async result => {
      if ((result as any)?.queued) return

      await invalidateByTags(qc, USER_PROFILE_TAGS, [userKeys.tagMap])
    },
  })
}
