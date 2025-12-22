import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { normalizeError } from '@/infra/error/normalize-error';
import { AuthService } from '@/features/auth/services/auth/auth.service.ts';

export function useLogout() {
  const qc = useQueryClient();

  return useCallback(async () => {
    try {
      // AuthService.logout -> performLogout() inside
      // but we also pass qc to hard-clear in-memory cache
      // (we added performLogout(qc) support)
      await AuthService.logout();

      // safety: clear in-memory queries even if service didn't pass qc
      await qc.cancelQueries().catch(() => undefined);
      qc.clear();
    } catch (e) {
      throw normalizeError(e);
    }
  }, [qc]);
}
