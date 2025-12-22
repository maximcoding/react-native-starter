// src/infra/network/netinfo.ts
/**
 * FILE: netinfo.ts
 * LAYER: infra/network
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Minimal network state bridge:
 *   - expose isOffline()
 *   - allow subscribe onNetworkChange(cb)
 *   - wire to transport.setOfflineMode()
 *   - on reconnect -> syncEngine.onConnected()
 *
 * IMPORTANT:
 *   Works even if @react-native-community/netinfo is not installed:
 *   - initNetInfoBridge() becomes a safe no-op
 * ---------------------------------------------------------------------
 */

import { setOfflineMode } from '@/infra/transport/transport';
import { syncEngine } from '@/infra/offline/sync-engine';

type Listener = (offline: boolean) => void;

let offline = false;
let listeners: Listener[] = [];
let didInit = false;

function emit(nextOffline: boolean) {
  offline = nextOffline;
  setOfflineMode(nextOffline);
  listeners.forEach(cb => cb(nextOffline));
}

export function isOffline() {
  return offline;
}

/** Subscribe to offline changes. Returns unsubscribe. */
export function onNetworkChange(cb: Listener) {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter(x => x !== cb);
  };
}

/**
 * Init NetInfo subscription if package exists.
 * - offline -> emit(true)
 * - online  -> emit(false) + syncEngine.onConnected()
 */
export function initNetInfoBridge() {
  if (didInit) return;
  didInit = true;

  // try require NetInfo dynamically (so project doesn't crash if missing)
  let NetInfo: any;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    NetInfo = require('@react-native-community/netinfo').default;
  } catch {
    // Package not installed -> keep manual mode
    return;
  }

  try {
    // initial
    NetInfo.fetch().then((state: any) => {
      const isConnected = !!state?.isConnected;
      const isInternetReachable =
        state?.isInternetReachable == null ? true : !!state.isInternetReachable;

      const nowOffline = !(isConnected && isInternetReachable);
      emit(nowOffline);
    });

    // subscribe
    NetInfo.addEventListener((state: any) => {
      const isConnected = !!state?.isConnected;
      const isInternetReachable =
        state?.isInternetReachable == null ? true : !!state.isInternetReachable;

      const nextOffline = !(isConnected && isInternetReachable);
      const wasOffline = offline;

      emit(nextOffline);

      // became online => replay offline queue
      if (wasOffline && !nextOffline) {
        syncEngine.onConnected().catch(() => undefined);
      }
    });
  } catch {
    // if NetInfo misbehaves, stay safe
  }
}

/**
 * DEV helper (optional):
 * Allow toggling offline manually when no NetInfo / for testing.
 */
export function __setOfflineForDev(nextOffline: boolean) {
  const wasOffline = offline;
  emit(nextOffline);
  if (wasOffline && !nextOffline) {
    syncEngine.onConnected().catch(() => undefined);
  }
}
