/**
 * Extraction seed — NOT imported or called at runtime.
 *
 * i18next-parser only detects static `t('key')` calls. Keys that are used
 * dynamically (computed key strings) or in files outside the extraction glob
 * must be referenced here as static `t()` calls so they survive
 * `npm run i18n:extract` with `keepRemoved: false`.
 *
 * Keep this file in sync with actual usage.
 */

function _extractionSeed(t: (key: string) => string) {
  // Dynamic greeting keys used via t(greetingKey) in HomeScreen
  t('home.greeting_morning')
  t('home.greeting_afternoon')
  t('home.greeting_evening')

  // Fallback label used as a plain string literal in navigation-helpers
  t('app.title')

  // Quick action labels used via t(a.labelKey) in HomeScreen
  t('home.quick_action_task')
  t('home.quick_action_message')
  t('home.quick_action_schedule')
  t('home.quick_action_report')
  t('home.quick_action_upload')
}
