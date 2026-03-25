import { useState } from 'react'
import { getInitialRoute, type InitialRoute } from '@/session/bootstrap'

/** Sync read on first paint — avoids an empty root navigator frame before hydration. */
export function useInitialRoute(): InitialRoute {
  const [route] = useState<InitialRoute>(() => getInitialRoute())
  return route
}
