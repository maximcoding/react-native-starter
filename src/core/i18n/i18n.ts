import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager, NativeModules } from 'react-native';

// ---- IMPORT JSON ----
import en from './locales/en.json';
import ru from './locales/ru.json';
import de from './locales/de.json';

export enum LanguageKey {
  english = 'en',
  russian = 'ru',
  germany = 'de',
}

export const resources = {
  [LanguageKey.english]: {
    translation: en, // nested json
  },
  [LanguageKey.russian]: {
    translation: ru,
  },
  [LanguageKey.germany]: {
    translation: de,
  },
};

// Опционально — если хочешь брать локаль устройства
const deviceSettings = NativeModules?.SettingsManager?.settings;
const currentLocale =
  deviceSettings?.AppleLocale ||
  deviceSettings?.AppleLanguages?.[0] ||
  NativeModules?.I18nManager?.localeIdentifier;

if (currentLocale) {
  I18nManager.allowRTL(true);
}

const fallbackLng = LanguageKey.english;

// ВАЖНО: не ставим keySeparator: false,
// чтобы работали nested пути: onboarding.welcome
i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: fallbackLng, // можешь заменить на детекцию из currentLocale
  fallbackLng,
  resources,
  defaultNS: 'translation',
  interpolation: {
    escapeValue: false,
  },
  // keySeparator по умолчанию = '.', это нам и нужно
});

export { i18n, fallbackLng, currentLocale };
export default i18n;
