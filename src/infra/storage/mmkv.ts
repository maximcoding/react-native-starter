// src/infra/storage/mmkv.ts
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
 * RUNTIME IMPLEMENTATION:
 *   - Tries to use react-native-mmkv if the lib is installed.
 *   - Falls back to an in-memory Map in dev environments.
 *   - Preserves the KeyValueStorage interface EXACTLY.
 */
function createStorage(): KeyValueStorage {
  try {
    // Dynamic require so builds don’t fail if MMKV isn’t installed yet.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { MMKV } = require('react-native-mmkv');

    // NOTE: Add encryptionKey in production apps.
    const mmkv = new MMKV({
      id: 'app-storage',
      // encryptionKey: 'secure-key', // ← configure via env for production
    });

    return {
      getString(key) {
        return mmkv.getString(key) ?? null;
      },
      setString(key, value) {
        mmkv.set(key, value);
      },
      delete(key) {
        mmkv.delete(key);
      },
      clearAll() {
        mmkv.clearAll();
      },
    };
  } catch {
    // Fallback: simple, non-persistent in-memory Map (dev only).
    const memory = new Map<string, string>();

    return {
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
  }
}

export const kvStorage: KeyValueStorage = createStorage();

/**
 * FUTURE MMKV IMPLEMENTATION EXAMPLE (explicit):
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
