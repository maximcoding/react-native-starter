// src/core/config/env.ts
import Config from 'react-native-config';

export const env = {
  API_URL: (Config.API_URL ?? '').trim(),
  USE_MOCK_API: (Config.USE_MOCK_API ?? '0') === '1',
  WS_URL: (Config.WS_URL ?? '').trim(),
  ENV: (Config.ENV ?? (__DEV__ ? 'development' : 'production')).trim(),
} as const;
