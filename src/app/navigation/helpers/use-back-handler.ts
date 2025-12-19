// src/app/navigation/helpers/use-back-handler.ts
import { useEffect, useRef } from 'react';
import { BackHandler, Platform } from 'react-native';
import { navigationRef } from '@/app/navigation/helpers/navigation-helpers';

/**
 * Android back button handler.
 * canExit(routeName) → true, если с этого роута можно выйти из приложения.
 */
export function useBackButtonHandler(
  canExit: (routeName: string | undefined) => boolean,
) {
  // keep latest canExit without re-subscribing
  const canExitRef = useRef(canExit);
  useEffect(() => {
    canExitRef.current = canExit;
  }, [canExit]);

  useEffect(() => {
    // iOS: do nothing, but hooks are still called (no early return)
    if (Platform.OS !== 'android') return;

    const onBackPress = () => {
      if (!navigationRef.isReady()) return false;

      const state = navigationRef.getRootState();
      const routeName = getActiveRouteNameSafe(state);

      // allow exiting app on specific root screens
      if (canExitRef.current(routeName)) {
        BackHandler.exitApp();
        return true;
      }

      // otherwise pop navigation if possible
      if (navigationRef.canGoBack()) {
        navigationRef.goBack();
        return true;
      }

      return false;
    };

    // new RN API: subscription.remove()
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );

    return () => {
      subscription.remove();
    };
  }, []);
}

// Safe active-route resolver (supports nested navigators)
function getActiveRouteNameSafe(state: any): string | undefined {
  if (!state || !state.routes || typeof state.index !== 'number')
    return undefined;
  const route = state.routes[state.index];
  if (route?.state) return getActiveRouteNameSafe(route.state);
  return route?.name;
}
