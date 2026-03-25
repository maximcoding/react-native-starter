import { ROUTES } from '@/navigation/routes'

export type StoryScreenParams = {
  id: string
  title: string
  url?: string
  points?: number
  author?: string
  numComments?: number
  time: string
  domain?: string
}

/** Bottom tab navigator screens. */
export type HomeTabParamList = {
  [ROUTES.TAB_HOME]: undefined
  [ROUTES.TAB_SETTINGS]: undefined
}

/** Root stack: onboarding, auth, main app shell, and global modals. */
export type RootStackParamList = {
  [ROUTES.ROOT_APP]: undefined
  [ROUTES.ROOT_AUTH]: undefined
  [ROUTES.ROOT_ONBOARDING]: undefined
  [ROUTES.HOME_STORY]: StoryScreenParams
  [ROUTES.MODAL_THEME_PICKER]: undefined
  [ROUTES.MODAL_LANGUAGE_PICKER]: undefined
}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
