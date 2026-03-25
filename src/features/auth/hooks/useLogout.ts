import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { AuthService } from '@/features/auth/services/auth/auth.service'
import { normalizeError } from '@/shared/utils/normalize-error'

export function useLogout() {
  const qc = useQueryClient()

  return useCallback(async () => {
    try {
      await AuthService.logout()
      await qc.cancelQueries()
      qc.clear()
    } catch (e) {
      throw normalizeError(e)
    }
  }, [qc])
}
