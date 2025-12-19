// src/core/ui/toast.ts
import { Platform, ToastAndroid, Alert } from 'react-native';
import {
  normalizeError,
  type NormalizedError,
} from '@/infra/error/normalize-error';

export function showToast(message: string) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    Alert.alert('', message);
  }
}

export function showErrorToast(error: unknown) {
  const e: NormalizedError = normalizeError(error);
  showToast(e.message || 'Something went wrong');
}
