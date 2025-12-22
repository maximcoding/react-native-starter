import { kvStorage } from '@/infra/storage/mmkv';
import { constants } from '@/core/config/constants';

export type BootstrapRoute = 'ROOT_ONBOARDING' | 'ROOT_AUTH' | 'ROOT_APP';

export function getBootstrapRoute(): BootstrapRoute {
  const onboardingDone = kvStorage.getString(constants.ONBOARDING_DONE) === '1';
  const token = kvStorage.getString(constants.AUTH_TOKEN);

  if (!onboardingDone) return 'ROOT_ONBOARDING';
  if (!token) return 'ROOT_AUTH';
  return 'ROOT_APP';
}

export function setOnboardingDone() {
  kvStorage.setString(constants.ONBOARDING_DONE, '1');
}
