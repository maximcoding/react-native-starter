import Config from 'react-native-config';

// --- APPEND (do not remove anything) ---
export const constants = {
  // ...your existing entries
  MAX_UPLOAD_SIZE: 20 * 1024 * 1024,
  DEFAULT_PAGE_SIZE: 20,
  AUTH_TOKEN: 'auth.token',
  RQ_CACHE: 'rq.cache.v1',
  REFRESH_TOKEN: 'auth.refreshToken', // ← add this line
  ONBOARDING_DONE: 'onboarding.done.v1',
};

export const flags = {
  USE_MOCK: __DEV__ && (Config.USE_MOCK_API ?? '0') === '1',
};
