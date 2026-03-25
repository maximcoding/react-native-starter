import { useState } from 'react'
import { type InitialRoute, getInitialRoute } from '@/session/bootstrap'

/** Sync read on first paint — avoids an empty root navigator frame before hydration. */
export function useInitialRoute(): InitialRoute {
  const [route] = useState<InitialRoute>(() => getInitialRoute())
  return route
}
