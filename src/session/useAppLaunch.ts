// src/app/hooks/useAppLaunch.ts
import { useInitialRoute } from '@/session/useInitialRoute'

export function useAppLaunch() {
  const route = useInitialRoute()
  return { isReady: route !== null }
}
