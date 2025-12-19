// src/app/hooks/useOnlineStatus.ts
import { useEffect, useState } from 'react';
import {
  onNetworkChange,
  isOffline as getIsOffline,
} from '@/infra/network/netinfo';

export function useOnlineStatus() {
  const [isOffline, setOffline] = useState<boolean>(getIsOffline());

  useEffect(() => {
    return onNetworkChange(setOffline);
  }, []);

  return { isOffline, isOnline: !isOffline };
}
