/**
 * CENTRAL ROUTES ENUM
 * ------------------------------------------------------------
 * Naming rules:
 * - ROOT_* → top navigation containers (never shown directly)
 * - HOME_* → routes inside the authenticated app flow
 * - AUTH_* → authentication screens
 * - ONBOARDING_* → onboarding flow
 * - TAB_* → bottom tabs
 * - SETTINGS_* → settings screens
 */

export const ROUTES = {
  //
  // ROOT CONTAINERS (never visible screens)
  //
  ROOT_ONBOARDING: 'ROOT_ONBOARDING',
  ROOT_AUTH: 'ROOT_AUTH',
  ROOT_APP: 'ROOT_APP',

  //
  // ONBOARDING FLOW
  //
  ONBOARDING_MAIN: 'ONBOARDING_MAIN',

  //
  // AUTH FLOW
  //
  AUTH_LOGIN: 'AUTH_LOGIN',

  //
  // HOME FLOW
  //
  HOME_STACK: 'HOME_STACK', // parent stack
  HOME_TABS: 'HOME_TABS', // bottom tabs container

  //
  // HOME → TABS
  //
  TAB_HOME: 'TAB_HOME',
  TAB_SETTINGS: 'TAB_SETTINGS',

  //
  // SETTINGS STACK
  //
  SETTINGS_ROOT: 'SETTINGS_ROOT',
  SETTINGS_LANGUAGE: 'SETTINGS_LANGUAGE',
  SETTINGS_THEME: 'SETTINGS_THEME',
} as const;

// Derived type for autocompletion everywhere:
export type RouteName = (typeof ROUTES)[keyof typeof ROUTES];
