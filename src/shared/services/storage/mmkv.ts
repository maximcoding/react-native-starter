// src/infra/storage/mmkv.ts
/**
 * FILE: mmkv.ts
 * LAYER: infra/storage
 * ---------------------------------------------------------------------
 * PURPOSE:
 *   Abstract key-value storage used as the single secure storage layer
 *   for the entire app (tokens, session, preferences, caches).
 *
 *   Exports mmkvStorage (general) and navigationStorage (navigation state).
 *   kvStorage is backed by mmkvStorage so existing auth/RQ/Zustand code keeps working.
 *   Falls back to in-memory Maps when react-native-mmkv is unavailable.
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
 *   - Use mmkvStorage or navigationStorage directly for new features when separation is needed.
 *   - Preserve the KeyValueStorage interface EXACTLY.
 *   - Do NOT store sensitive data in plain strings (only encrypted storage).
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
  getString(key: string): string | null

  /**
   * Store a string value.
   */
  setString(key: string, value: string): void

  /**
   * Remove a specific key.
   */
  delete(key: string): void

  /**
   * Clear all storage (logout, hard reset).
   */
  clearAll(): void
}

/** MMKV-like interface for a single store (getString/set/delete/clearAll). */
export interface MMKVLike extends KeyValueStorage {
  set(key: string, value: string): void
}

function createKeyValueStorage(
  getString: (k: string) => string | null,
  setString: (k: string, v: string) => void,
  del: (k: string) => void,
  clearAll: () => void,
): KeyValueStorage {
  return { getString, setString, delete: del, clearAll }
}

function createMMKVLike(
  getString: (k: string) => string | null,
  set: (k: string, v: string) => void,
  del: (k: string) => void,
  clearAll: () => void,
): MMKVLike {
  return {
    getString,
    setString: set,
    set,
    delete: del,
    clearAll,
  }
}

/**
 * RUNTIME IMPLEMENTATION:
 *   - Tries to use react-native-mmkv if the lib is installed.
 *   - Exports mmkvStorage (general) and navigationStorage (navigation state).
 *   - kvStorage is backed by mmkvStorage so existing auth/RQ/Zustand code keeps working.
 *   - Falls back to in-memory Maps when MMKV is missing.
 */
let _mmkvStorage: MMKVLike
let _navigationStorage: MMKVLike
let _kvStorage: KeyValueStorage

try {
  // react-native-mmkv v4 (Nitro): factory function, no class constructor.
  // v4 also uses remove() instead of delete().
  const { createMMKV } = require('react-native-mmkv')

  const _mmkvRaw = createMMKV({ id: 'mmkv-storage' })
  const _navRaw = createMMKV({ id: 'navigation-storage' })

  _mmkvStorage = createMMKVLike(
    key => {
      const v = _mmkvRaw.getString(key)
      return v !== undefined ? v : null
    },
    (key, value) => _mmkvRaw.set(key, value),
    key => _mmkvRaw.remove(key),
    () => _mmkvRaw.clearAll(),
  )
  _navigationStorage = createMMKVLike(
    key => {
      const v = _navRaw.getString(key)
      return v !== undefined ? v : null
    },
    (key, value) => _navRaw.set(key, value),
    key => _navRaw.remove(key),
    () => _navRaw.clearAll(),
  )
  _kvStorage = createKeyValueStorage(
    key => _mmkvStorage.getString(key),
    (key, value) => _mmkvStorage.set(key, value),
    key => _mmkvStorage.delete(key),
    () => _mmkvStorage.clearAll(),
  )
} catch {
  const memory = new Map<string, string>()
  const navMemory = new Map<string, string>()

  _mmkvStorage = createMMKVLike(
    key => (memory.has(key) ? memory.get(key)! : null),
    (key, value) => memory.set(key, value),
    key => memory.delete(key),
    () => memory.clear(),
  )
  _navigationStorage = createMMKVLike(
    key => (navMemory.has(key) ? navMemory.get(key)! : null),
    (key, value) => navMemory.set(key, value),
    key => navMemory.delete(key),
    () => navMemory.clear(),
  )
  _kvStorage = createKeyValueStorage(
    key => _mmkvStorage.getString(key),
    (key, value) => _mmkvStorage.setString(key, value),
    key => _mmkvStorage.delete(key),
    () => _mmkvStorage.clearAll(),
  )
}

export const mmkvStorage = _mmkvStorage
export const navigationStorage = _navigationStorage
export const kvStorage: KeyValueStorage = _kvStorage
