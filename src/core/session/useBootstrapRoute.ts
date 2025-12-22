import { useEffect, useState } from 'react';
import {
  getBootstrapRoute,
  type BootstrapRoute,
} from '@/core/session/bootstrap';

export function useBootstrapRoute() {
  const [route, setRoute] = useState<BootstrapRoute | null>(null);

  useEffect(() => {
    // sync read, but keep async-like shape for future expansion
    setRoute(getBootstrapRoute());
  }, []);

  return route;
}
