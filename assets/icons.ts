
// AUTO-GENERATED FILE — DO NOT EDIT MANUALLY
// Run: npm run gen:icons

import User from '@assets/svgs/user.svg';


export enum IconName {
  USER = 'USER',

}

export const AppIcon = {
  [IconName.USER]: User,

} as const;

export type IconNameType = keyof typeof AppIcon;
