/**
 * FILE: netinfo.ts
 * LAYER: infra/network
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Central place to track offline/online state for the app and wire it
 *   into transport + sync-engine.
 *
 * RESPONSIBILITIES:
 *   - Keep a simple boolean "offline" flag.
 *   - Notify listeners when state changes.
 *   - Inform transport (setOfflineMode).
 *   - Trigger syncEngine.onConnected() when going online.
 *
 * DATA-FLOW:
 *   OS/network change (later via @react-native-community/netinfo)
 *      → setNetworkOffline(true/false)
 *         → setOfflineMode(...)
 *         → listeners notified
 *         → if back online → syncEngine.onConnected()
 *
 * EXTENSION GUIDELINES:
 *   - Replace manual setters with real NetInfo integration.
 *   - Add metrics/analytics for connectivity changes if needed.
 * ---------------------------------------------------------------------
 */
import { setOfflineMode } from '@/infra/transport/transport';
import { syncEngine } from '@/infra/offline/sync-engine';

type NetworkListener = (isOffline: boolean) => void;

let offline = false;
const listeners = new Set<NetworkListener>();

export function setNetworkOffline(isOffline: boolean) {
  if (offline === isOffline) return;

  offline = isOffline;
  setOfflineMode(isOffline);

  listeners.forEach(cb => cb(offline));

  if (!offline) {
    syncEngine.onConnected().catch(() => undefined);
  }
}

export function onNetworkChange(listener: NetworkListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function isOffline(): boolean {
  return offline;
}

// --- APPEND: optional NetInfo bridge (safe no-op if package is absent) ---
/**
 * Initializes network listener via @react-native-community/netinfo.
 * Safe: if the lib is not installed, this function is a no-op.
 */
export function initNetInfoBridge() {
  try {
    // require динамически, чтобы не падать без зависимости
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const NetInfo = require('@react-native-community/netinfo').default;

    NetInfo.addEventListener((state: any) => {
      const isOff = !(
        state?.isConnected && state?.isInternetReachable !== false
      );
      setNetworkOffline(isOff);
    });
  } catch {
    // NetInfo не установлен — оставляем ручное управление офлайн/онлайн
  }
}
