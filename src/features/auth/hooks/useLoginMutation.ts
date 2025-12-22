// src/features/auth/hooks/useLoginMutation.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { normalizeError } from '@/infra/error/normalize-error';
import { invalidateByTags } from '@/infra/query/helpers/invalidate-by-tags';
import { authKeys } from '@/features/auth/api/keys';
import { userKeys } from '@/features/user/api/keys';
import { AuthService } from '@/features/auth/services/auth/auth.service';
import {
  LoginRequest,
  zLoginRequest,
} from '@/features/auth/services/auth/auth.schemas';

const TAGS = ['auth:me', 'auth:session', 'user:me', 'user:list'] as const;

export function useLoginMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ['auth', 'login'],
    mutationFn: async (payload: LoginRequest) => {
      const ok = zLoginRequest.safeParse(payload);
      if (!ok.success) throw normalizeError(ok.error);

      try {
        return await AuthService.login(ok.data);
      } catch (e) {
        throw normalizeError(e);
      }
    },
    onSuccess: async () => {
      await invalidateByTags(qc, TAGS, [authKeys.tagMap, userKeys.tagMap]);
    },
  });
}