// src/app/hooks/useAppLaunch.ts
import { useBootstrapRoute } from '@/session/useBootstrapRoute'

export function useAppLaunch() {
  const route = useBootstrapRoute()
  return { isReady: route !== null }
}
