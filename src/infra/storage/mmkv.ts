/**
 * FILE: mmkv.ts
 * LAYER: infra/storage
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Abstract key-value storage used as the single secure storage layer
 *   for the entire app (tokens, session, preferences, caches).
 *
 *   Currently implemented using an in-memory Map for development.
 *   In production this MUST be replaced with react-native-mmkv or
 *   any secure storage backend (Keychain/Keystore/MMKV encrypted).
 *
 * RESPONSIBILITIES:
 *   - Provide minimal and universal key-value API.
 *   - Ensure consistent method signatures across all environments.
 *   - Hide implementation details from services and stores.
 *
 * DATA-FLOW:
 *   AuthService.login()
 *      → kvStorage.setString('token', ...)
 *
 *   transport.authInterceptor()
 *      → kvStorage.getString('token')
 *
 *   logout()
 *      → kvStorage.clearAll()
 *
 * EXTENSION GUIDELINES:
 *   - Replace `memory` Map with:
 *
 *       import { MMKV } from 'react-native-mmkv';
 *       const mmkv = new MMKV({ id: 'app-storage' });
 *
 *   - Preserve the KeyValueStorage interface EXACTLY.
 *   - If using encrypted MMKV, pass encryptionKey during MMKV init.
 *   - Do NOT store sensitive data in plain strings (only encrypted storage).
 *   - Implement namespace separation if needed:
 *       auth.*, session.*, cache.*, prefs.*
 *
 * SECURITY:
 *   - MMKV storage should be encrypted on production builds.
 *   - On logout: ALWAYS clear tokens and sensitive keys.
 *
 * THREAD SAFETY:
 *   - MMKV writes are synchronous → safe for RN JS thread.
 * ---------------------------------------------------------------------
 */

export interface KeyValueStorage {
  /**
   * Read a string value from storage.
   */
  getString(key: string): string | null;

  /**
   * Store a string value.
   */
  setString(key: string, value: string): void;

  /**
   * Remove a specific key.
   */
  delete(key: string): void;

  /**
   * Clear all storage (logout, hard reset).
   */
  clearAll(): void;
}

/**
 * CURRENT IMPLEMENTATION:
 *   Simple in-memory Map used only for development.
 *   It resets on app reload and is NOT persistent.
 */
const memory = new Map<string, string>();

export const kvStorage: KeyValueStorage = {
  getString(key) {
    return memory.has(key) ? memory.get(key)! : null;
  },

  setString(key, value) {
    memory.set(key, value);
  },

  delete(key) {
    memory.delete(key);
  },

  clearAll() {
    memory.clear();
  },
};

/**
 * FUTURE MMKV IMPLEMENTATION EXAMPLE:
 *
 * import { MMKV } from 'react-native-mmkv';
 *
 * const mmkv = new MMKV({ id: 'app-storage', encryptionKey: 'secure-key' });
 *
 * export const kvStorage: KeyValueStorage = {
 *   getString: (key) => mmkv.getString(key) ?? null,
 *   setString: (key, value) => mmkv.set(key, value),
 *   delete: (key) => mmkv.delete(key),
 *   clearAll: () => mmkv.clearAll(),
 * };
 */
