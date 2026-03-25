/**
 * ┌──────────────────────────────────────────────────────────┐
 *  React Native Starter Hooks
 *  Drop this `hooks/` folder into any RN project.
 *  Zero external dependencies — only React + React Native
 *  (except useClipBoard: @react-native-clipboard/clipboard).
 * └──────────────────────────────────────────────────────────┘
 *
 *  HOOK                 WHAT IT DOES
 *  ──────────────────── ──────────────────────────────────────
 *  useAppState          Track foreground / background lifecycle
 *  useKeyboard          Keyboard visibility & height
 *  useRefreshControl    Pull-to-refresh for lists
 *  useDebounce          Delay a value (search, autosave)
 *  useTimeout           Declarative setTimeout with cleanup
 *  useInterval          Declarative setInterval with pause
 *  useCountdown         Countdown timer with controls
 *  useToggle            Boolean state + toggle/set helpers
 *  usePrevious          Previous render's value
 *  useMountEffect       Run once on mount
 *  useIsFirstRender     True only on first render
 *  useArray             Managed array with CRUD helpers
 *  useAsync             Async fn → loading/error/data state
 *  useForm              Lightweight form state & validation
 *  useClipBoard         Clipboard read/write + local state
 *  useWindowDimensions  Screen dimensions (re-export from RN)
 *  useToast             Show toast / error toast
 *  useSafeAreaScroll    Safe area insets for ScrollView
 *  useOnlineStatus      Online/offline status
 */

export { useAppState } from './useAppState'
export { useArray } from './useArray'
export { useAsync } from './useAsync'
export { useClipBoard } from './useClipBoard'
export { useCountdown } from './useCountdown'
export {
  useDebouncedValue,
  useDebouncedValue as useDebounce,
} from './useDebouncedValue'
export { useForm } from './useForm'
export { useInterval } from './useInterval'
export { useIsFirstRender } from './useIsFirstRender'
export { useKeyboard } from './useKeyboard'
export { useMountEffect } from './useMountEffect'
export { useOnlineStatus } from './useOnlineStatus'
export { usePrevious } from './usePrevious'
export { useRefreshControl } from './useRefreshControl'
export { useSafeAreaScroll } from './useSafeAreaScroll'
export { useTimeout } from './useTimeout'
export { useToast } from './useToast'
export { useToggle } from './useToggle'
export { useWindowDimensions } from './useWindowDimensions'
