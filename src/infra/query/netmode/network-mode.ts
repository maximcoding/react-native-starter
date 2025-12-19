// 2025 — infra/query/netmode/network-mode.ts
/**
 * GUIDELINE: NetInfo → Query networkMode (NO implementation)
 * ------------------------------------------------------------------
 * NETWORK MODES
 *   'online'       : normal behavior, fetch allowed
 *   'offlineFirst' : serve cache immediately; don't start new fetches
 *   'always'       : explicit polling cases (rare)
 *
 * BRIDGE
 *   - Subscribe to infra/network/netinfo.onNetworkChange
 *   - Offline  → switch to 'offlineFirst'
 *   - Online   → 'online' + trigger silent refetch
 */
// src/infra/query/netmode/network-mode.ts
import { isOffline as isAppOffline, onNetworkChange } from '@/infra/network/netinfo';

export type NetworkMode = 'online' | 'offlineFirst' | 'always';

let current: NetworkMode = 'online';

export function getNetworkMode(): NetworkMode {
  return current;
}

// simple bridge: when offline → 'offlineFirst', when online → 'online'
export function initNetworkModeBridge() {
  current = isAppOffline() ? 'offlineFirst' : 'online';
  onNetworkChange((offline) => { current = offline ? 'offlineFirst' : 'online'; });
}

