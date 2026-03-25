/**
 * React Navigation state persistence (MMKV via navigationStorage).
 * @see https://reactnavigation.org/docs/state-persistence/
 */

import type { NavigationState, PartialState } from '@react-navigation/native'

import { constants } from '@/config/constants'
import { ROUTES } from '@/navigation/routes'
import { getInitialRoute } from '@/session/bootstrap'
import { navigationStorage } from '@/shared/services/storage/mmkv'

const KEY = constants.NAVIGATION_STATE_V1

const ROOT_NAMES = new Set<string>([
  ROUTES.ROOT_APP,
  ROUTES.ROOT_AUTH,
  ROUTES.ROOT_ONBOARDING,
])

function getRootRouteName(
  state: NavigationState | PartialState<NavigationState>,
): string | undefined {
  if (!state.routes || state.index === undefined) return undefined
  const route = state.routes[state.index]
  return route && typeof route.name === 'string' ? route.name : undefined
}

/**
 * Restored tree must match session bootstrap (token + onboarding), otherwise we drop it.
 */
export function isRestoredStateAllowed(
  state: NavigationState | PartialState<NavigationState>,
): boolean {
  const rootName = getRootRouteName(state)
  if (!rootName || !ROOT_NAMES.has(rootName)) return false
  const expected = getInitialRoute()
  return rootName === expected
}

export function loadPersistedNavigationState():
  | NavigationState
  | PartialState<NavigationState>
  | undefined {
  const raw = navigationStorage.getString(KEY)
  if (!raw) return undefined
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object') return undefined
    const state = parsed as PartialState<NavigationState>
    if (!isRestoredStateAllowed(state)) return undefined
    return state
  } catch {
    return undefined
  }
}

export function persistNavigationState(state: NavigationState | undefined) {
  if (state === undefined) return
  try {
    navigationStorage.setString(KEY, JSON.stringify(state))
  } catch {
    // ignore: non-serializable or storage failure
  }
}

export function clearNavigationPersistence() {
  navigationStorage.delete(KEY)
}
