// AUTO-GENERATED FILE — DO NOT EDIT MANUALLY
// Run: npm run gen:icons

import Check from '@assets/svgs/check.svg'
import Globe from '@assets/svgs/globe.svg'
import Home from '@assets/svgs/home.svg'
import Info from '@assets/svgs/info.svg'
import Layers from '@assets/svgs/layers.svg'
import Logout from '@assets/svgs/logout.svg'
import Moon from '@assets/svgs/moon.svg'
import Settings from '@assets/svgs/settings.svg'
import Sun from '@assets/svgs/sun.svg'
import User from '@assets/svgs/user.svg'

export enum IconName {
  CHECK = 'CHECK',
  GLOBE = 'GLOBE',
  HOME = 'HOME',
  INFO = 'INFO',
  LAYERS = 'LAYERS',
  LOGOUT = 'LOGOUT',
  MOON = 'MOON',
  SETTINGS = 'SETTINGS',
  SUN = 'SUN',
  USER = 'USER',
}

export const AppIcon = {
  [IconName.CHECK]: Check,
  [IconName.GLOBE]: Globe,
  [IconName.HOME]: Home,
  [IconName.INFO]: Info,
  [IconName.LAYERS]: Layers,
  [IconName.LOGOUT]: Logout,
  [IconName.MOON]: Moon,
  [IconName.SETTINGS]: Settings,
  [IconName.SUN]: Sun,
  [IconName.USER]: User,
} as const

export type IconNameType = keyof typeof AppIcon
