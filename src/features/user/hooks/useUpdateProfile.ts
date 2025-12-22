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

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { transport } from '@/infra/transport/transport';
import { invalidateByTags } from '@/infra/query/helpers/invalidate-by-tags';
import { userKeys } from '@/features/user/api/keys';
import { authKeys } from '@/features/auth/api/keys';
import { OPS } from '@/infra/transport/operations';

const UpdateProfileInput = z
  .object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    avatarUrl: z.string().url().optional(),
  })
  .refine(v => Object.keys(v).length > 0, {
    message: 'At least one field required',
  });

export type UpdateProfileInput = z.infer<typeof UpdateProfileInput>;

type TransportResult = { offline?: boolean; queued?: boolean } | unknown;

const TAGS = ['user:me', 'user:list', 'auth:me', 'auth:session'] as const;

export function useUpdateProfile() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ['user', 'updateProfile'],

    mutationFn: async (payload: UpdateProfileInput) => {
      const parsed = UpdateProfileInput.parse(payload);

      return transport.mutate(OPS.USER_UPDATE_PROFILE, parsed, {
        tags: TAGS,
      }) as Promise<TransportResult>;
    },

    onSuccess: async result => {
      if ((result as any)?.queued) return;

      await invalidateByTags(qc, TAGS, [userKeys.tagMap, authKeys.tagMap]);
    },
  });
}