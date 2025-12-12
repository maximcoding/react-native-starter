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
export {};
