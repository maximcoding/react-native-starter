import { Platform } from 'react-native';

export const deviceInfo = {
  isAndroid: Platform.OS === 'android',
  isIOS: Platform.OS === 'ios',
  platform: Platform.OS,
};
