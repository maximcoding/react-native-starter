// src/features/user/hooks/useUpdateProfile.ts
/**
 * PURPOSE:
 *   Update current user ("me") and invalidate related caches.
 * POLICY:
 *   - Validate input with Zod.
 *   - No response parsing here (we rely on refetch of queries).
 *   - Targeted invalidation by tags.
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiPut } from '@/infra/http/api';
import { normalizeError } from '@/infra/error/normalize-error';
import { invalidateByTags } from '@/infra/query/helpers/invalidate-by-tags';
import { userKeys } from '@/features/user/api/keys';
import { authKeys } from '@/features/auth/api/keys';
import { z } from 'zod';

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

export function useUpdateProfile() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ['user', 'updateProfile'],
    mutationFn: async (payload: UpdateProfileInput) => {
      const parsed = UpdateProfileInput.parse(payload);
      try {
        // REST example; if you later move to transport.mutate('user.updateProfile', parsed),
        // the onSuccess invalidation remains the same.
        await apiPut('/me', parsed);
      } catch (e) {
        throw normalizeError(e);
      }
    },
    onSuccess: async () => {
      await invalidateByTags(
        qc,
        ['user:me', 'user:list'],
        [userKeys.tagMap, authKeys.tagMap],
      );
    },
  });
}
