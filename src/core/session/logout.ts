// src/core/session/logout.ts
/**
 * Centralized logout helper:
 * - removes auth token from storage
 * - resets navigation to ROOT_AUTH
 * - (optional) clear lightweight caches
 */
import { kvStorage } from '@/infra/storage/mmkv';
import { constants } from '@/core/config/constants';
import { resetRoot } from '@/app/navigation/helpers/navigation-helpers';
import { ROUTES } from '@/app/navigation/routes';

/** Call on user sign-out, token expiry, or 401-guard */
export async function performLogout() {
  try {
    // 1) Remove sensitive credentials
    kvStorage.delete(constants.AUTH_TOKEN);

    // 2) (Optional) drop rq cache snapshot key; cache will rebuild
    // kvStorage.delete(constants.RQ_CACHE);

    // 3) Reset navigation to Auth root
    resetRoot({
      index: 0,
      routes: [{ name: ROUTES.ROOT_AUTH as never }],
    });
  } catch {
    // Always force navigation even if storage errors
    resetRoot({
      index: 0,
      routes: [{ name: ROUTES.ROOT_AUTH as never }],
    });
  }
}
