import { ROUTES } from '@/navigation/routes'

/** Root navigator: onboarding, auth, main app shell, and global modals. */
export type RootStackParamList = {
  [ROUTES.ROOT_APP]: undefined
  [ROUTES.ROOT_AUTH]: undefined
  [ROUTES.ROOT_ONBOARDING]: undefined
  [ROUTES.MODAL_THEME_PICKER]: undefined
  [ROUTES.MODAL_LANGUAGE_PICKER]: undefined
}
